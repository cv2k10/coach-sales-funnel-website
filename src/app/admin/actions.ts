"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { bookings, coupons, emailQueue, orders, sequenceSteps, sequences } from "@/db/schema";
import { ADMIN_COOKIE, adminPassword, requireAdmin, sessionToken } from "@/lib/admin-auth";
import { processQueue } from "@/lib/automation";

export async function loginAction(_: { error?: string } | undefined, form: FormData) {
  if (String(form.get("password")) !== adminPassword()) return { error: "Incorrect password" };
  (await cookies()).set(ADMIN_COOKIE, sessionToken(), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  redirect("/admin");
}

export async function logoutAction() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function toggleSequence(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  await db.update(sequences).set({ active: sql`not ${sequences.active}` }).where(eq(sequences.id, id));
  revalidatePath("/admin/automations");
}

export async function saveStep(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  const data = {
    subject: String(form.get("subject") ?? "").slice(0, 200),
    body: String(form.get("body") ?? ""),
    delayHours: Math.max(0, Number(form.get("delayHours") ?? 0) || 0),
  };
  if (id) {
    await db.update(sequenceSteps).set(data).where(eq(sequenceSteps.id, id));
  } else {
    const sequenceId = Number(form.get("sequenceId"));
    const [{ c }] = await db.select({ c: sql<number>`count(*)::int` }).from(sequenceSteps).where(eq(sequenceSteps.sequenceId, sequenceId));
    await db.insert(sequenceSteps).values({ ...data, sequenceId, position: c });
  }
  revalidatePath("/admin/automations");
}

export async function deleteStep(form: FormData) {
  await requireAdmin();
  await db.delete(sequenceSteps).where(eq(sequenceSteps.id, Number(form.get("id"))));
  revalidatePath("/admin/automations");
}

export async function runQueue() {
  await requireAdmin();
  await processQueue();
  revalidatePath("/admin/emails");
}

export async function fastForward() {
  await requireAdmin();
  await db.update(emailQueue).set({ sendAt: new Date() }).where(eq(emailQueue.status, "scheduled"));
  await processQueue();
  revalidatePath("/admin/emails");
}

export async function cancelEmail(form: FormData) {
  await requireAdmin();
  await db.update(emailQueue).set({ status: "cancelled" }).where(eq(emailQueue.id, Number(form.get("id"))));
  revalidatePath("/admin/emails");
}

export async function createCoupon(form: FormData) {
  await requireAdmin();
  const code = String(form.get("code") ?? "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const percentOff = Math.min(100, Math.max(1, Number(form.get("percentOff")) || 0));
  if (code) await db.insert(coupons).values({ code, percentOff }).onConflictDoUpdate({ target: coupons.code, set: { percentOff, active: true } });
  revalidatePath("/admin/coupons");
}

export async function toggleCoupon(form: FormData) {
  await requireAdmin();
  await db.update(coupons).set({ active: sql`not ${coupons.active}` }).where(eq(coupons.code, String(form.get("code"))));
  revalidatePath("/admin/coupons");
}

export async function setBookingStatus(form: FormData) {
  await requireAdmin();
  await db.update(bookings).set({ status: String(form.get("status")) }).where(eq(bookings.id, Number(form.get("id"))));
  revalidatePath("/admin/bookings");
}

export async function refundOrder(form: FormData) {
  await requireAdmin();
  await db.update(orders).set({ status: "refunded" }).where(eq(orders.id, Number(form.get("id"))));
  revalidatePath("/admin/orders");
}

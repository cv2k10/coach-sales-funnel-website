"use server";

import { db } from "@/db";
import { bookings, contacts, coupons, orders, type OrderItem } from "@/db/schema";
import { addTags, cancelOrderEmails, fireTrigger, track, upsertContact } from "@/lib/automation";
import { getProduct } from "@/lib/catalog";
import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export type FormState = { error?: string } | undefined;

/* ---------- Lead magnet opt-in ---------- */
export async function optInAction(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "");
  const name = String(form.get("name") ?? "");
  const source = String(form.get("source") ?? "lead-magnet");
  if (!validEmail(email)) return { error: "Please enter a valid email address." };
  const contact = await upsertContact({ email, name, source, tags: ["lead-magnet", "blueprint"] });
  await track("optin", { contactId: contact.id, path: "/free-guide", meta: { source } });
  await fireTrigger("lead_magnet_optin", contact.id);
  redirect(`/free-guide/thank-you?c=${contact.id}`);
}

/* ---------- Webinar registration ---------- */
export async function webinarAction(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "");
  const name = String(form.get("name") ?? "");
  const session = String(form.get("session") ?? "");
  if (!validEmail(email)) return { error: "Please enter a valid email address." };
  if (!session) return { error: "Please choose a session." };
  const contact = await upsertContact({ email, name, source: "webinar", tags: ["webinar-registrant"] });
  await track("webinar_registered", { contactId: contact.id, path: "/webinar", meta: { session } });
  await fireTrigger("webinar_registered", contact.id, { session });
  redirect(`/webinar/confirmed?s=${encodeURIComponent(session)}`);
}

/* ---------- Strategy call booking ---------- */
export async function bookCallAction(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "");
  const name = String(form.get("name") ?? "");
  const phone = String(form.get("phone") ?? "");
  const slot = String(form.get("slot") ?? "");
  const revenue = String(form.get("revenue") ?? "");
  const goal = String(form.get("goal") ?? "");
  if (!name.trim()) return { error: "Please enter your name." };
  if (!validEmail(email)) return { error: "Please enter a valid email address." };
  if (!slot) return { error: "Please pick a time slot." };
  const contact = await upsertContact({ email, name, phone, source: "strategy-call", tags: ["call-booked"] });
  await db.insert(bookings).values({ contactId: contact.id, slot, revenue, goal });
  await track("call_booked", { contactId: contact.id, path: "/book-call", meta: { slot } });
  await fireTrigger("call_booked", contact.id, { slot });
  redirect(`/book-call/confirmed?slot=${encodeURIComponent(slot)}`);
}

/* ---------- Checkout ---------- */
export async function startCheckout(input: { sku: string; email: string; name: string }) {
  const product = getProduct(input.sku);
  if (!product || !validEmail(input.email)) return { error: "Invalid checkout" as const };
  const contact = await upsertContact({ email: input.email, name: input.name, source: "checkout", tags: ["checkout-started"] });
  const [existing] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.contactId, contact.id), eq(orders.productSku, product.sku), eq(orders.status, "pending")));
  if (existing) return { orderId: existing.id };
  const [order] = await db
    .insert(orders)
    .values({
      contactId: contact.id,
      productSku: product.sku,
      items: [{ sku: product.sku, name: product.name, price: product.price, kind: "main" }],
      amount: product.price,
    })
    .returning();
  await track("checkout_started", { contactId: contact.id, path: `/checkout/${product.slug}`, meta: { sku: product.sku } });
  await fireTrigger("checkout_abandoned", contact.id, { product: product.slug }, order.id);
  return { orderId: order.id };
}

export async function checkCoupon(
  code: string,
): Promise<{ ok: true; code: string; percentOff: number } | { ok: false; error: string }> {
  const [c] = await db.select().from(coupons).where(eq(coupons.code, code.trim().toUpperCase()));
  if (!c || !c.active) return { ok: false, error: "Invalid or expired coupon" };
  return { ok: true, code: c.code, percentOff: c.percentOff };
}

export async function completeCheckout(input: {
  sku: string;
  email: string;
  name: string;
  bump: boolean;
  coupon?: string;
  plan: "full" | "installments";
}) {
  const product = getProduct(input.sku);
  if (!product) return { error: "Product not found" };
  if (!validEmail(input.email)) return { error: "Please enter a valid email." };
  if (!input.name.trim()) return { error: "Please enter your name." };
  const started = await startCheckout({ sku: input.sku, email: input.email, name: input.name });
  if ("error" in started) return { error: "Unable to start checkout" };

  let percentOff = 0;
  let couponCode: string | null = null;
  if (input.coupon) {
    const c = await checkCoupon(input.coupon);
    if (c.ok) {
      percentOff = c.percentOff;
      couponCode = c.code;
      await db.update(coupons).set({ uses: sql`${coupons.uses} + 1` }).where(eq(coupons.code, c.code));
    }
  }
  const mainPrice = Math.round(product.price * (1 - percentOff / 100));
  const items: OrderItem[] = [{ sku: product.sku, name: product.name, price: mainPrice, kind: "main" }];
  const bump = getProduct("vault")!;
  if (input.bump) items.push({ sku: bump.sku, name: bump.name, price: bump.price, kind: "bump" });
  const amount = items.reduce((s, i) => s + i.price, 0);
  const plan = input.plan === "installments" && product.plan ? "installments" : "full";

  const [order] = await db
    .update(orders)
    .set({ status: "paid", items, amount, couponCode, paymentPlan: plan, paidAt: new Date() })
    .where(eq(orders.id, started.orderId))
    .returning();

  await cancelOrderEmails(order.id);
  const tags = ["customer", `bought-${product.sku}`];
  if (input.bump) tags.push("bought-vault");
  await addTags(order.contactId, tags, "customer");
  await track("purchase", { contactId: order.contactId, meta: { sku: product.sku, amount, bump: input.bump } });
  if (input.bump) await track("bump_accepted", { contactId: order.contactId, meta: { orderId: order.id } });
  await fireTrigger("purchase", order.contactId, { product: product.name });
  if (product.kind === "tripwire") await fireTrigger("tripwire_purchase", order.contactId);
  return { orderId: order.id };
}

/* ---------- One-click upsell / downsell ---------- */
async function addOfferToOrder(orderId: number, sku: string, kind: "upsell" | "downsell") {
  const product = getProduct(sku)!;
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order || order.status !== "paid") return null;
  if (order.items.some((i) => i.sku === sku)) return order;
  const items = [...order.items, { sku, name: product.name, price: product.price, kind }];
  await db
    .update(orders)
    .set({ items, amount: order.amount + product.price })
    .where(eq(orders.id, orderId));
  await addTags(order.contactId, [`bought-${sku}`], kind === "upsell" ? "vip" : "customer");
  await track(`${kind}_accepted`, { contactId: order.contactId, meta: { orderId, sku } });
  return order;
}

export async function upsellDecision(form: FormData) {
  const orderId = Number(form.get("order"));
  const accept = form.get("decision") === "yes";
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order) redirect("/");
  if (accept) {
    await addOfferToOrder(orderId, "vip", "upsell");
    redirect(`/thank-you?order=${orderId}`);
  }
  await track("upsell_declined", { contactId: order.contactId, meta: { orderId } });
  redirect(`/offer/downsell?order=${orderId}`);
}

export async function downsellDecision(form: FormData) {
  const orderId = Number(form.get("order"));
  const accept = form.get("decision") === "yes";
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  if (!order) redirect("/");
  if (accept) {
    await addOfferToOrder(orderId, "replays", "downsell");
  } else {
    await track("downsell_declined", { contactId: order.contactId, meta: { orderId } });
    await fireTrigger("upsell_declined", order.contactId);
  }
  redirect(`/thank-you?order=${orderId}`);
}

/* ---------- Member lookup ---------- */
export async function memberLookup(form: FormData) {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const [c] = await db.select().from(contacts).where(eq(contacts.email, email));
  redirect(c ? `/members?m=${c.id}&e=${encodeURIComponent(email)}` : `/members?notfound=1`);
}

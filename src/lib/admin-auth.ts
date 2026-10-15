import "server-only";
import { createHash } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "elevate_admin";
export const adminPassword = () => process.env.ADMIN_PASSWORD || "coach123";
export const sessionToken = () => createHash("sha256").update(`elevate:${adminPassword()}`).digest("hex");

export async function isAdmin() {
  const c = await cookies();
  return c.get(ADMIN_COOKIE)?.value === sessionToken();
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

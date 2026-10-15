import "server-only";
import { and, eq, like, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";

export async function countEvents(type: string, opts: { path?: string; pathLike?: string; sku?: string } = {}) {
  const conds: SQL[] = [eq(events.type, type)];
  if (opts.path) conds.push(eq(events.path, opts.path));
  if (opts.pathLike) conds.push(like(events.path, opts.pathLike));
  if (opts.sku) conds.push(sql`${events.meta}->>'sku' = ${opts.sku}`);
  const [r] = await db.select({ c: sql<number>`count(*)::int` }).from(events).where(and(...conds));
  return r?.c ?? 0;
}

export async function countPurchasesOfKind(skus: string[]) {
  if (!skus.length) return 0;
  const [r] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(events)
    .where(and(eq(events.type, "purchase"), sql`${events.meta}->>'sku' in (${sql.join(skus.map((s) => sql`${s}`), sql`, `)})`));
  return r?.c ?? 0;
}

export const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1)}%` : "—");

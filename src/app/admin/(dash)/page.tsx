import Link from "next/link";
import { desc, eq, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { bookings, contacts, emailQueue, events, orders } from "@/db/schema";
import { money } from "@/lib/catalog";

export default async function Overview() {
  const [rev] = await db.select({ total: sql<number>`coalesce(sum(${orders.amount}),0)::int`, n: sql<number>`count(*)::int` }).from(orders).where(eq(orders.status, "paid"));
  const [leads] = await db.select({ n: sql<number>`count(*)::int` }).from(contacts);
  const [customers] = await db.select({ n: sql<number>`count(*)::int` }).from(contacts).where(ne(contacts.stage, "lead"));
  const [pending] = await db.select({ n: sql<number>`count(*)::int` }).from(orders).where(eq(orders.status, "pending"));
  const [sent] = await db.select({ n: sql<number>`count(*)::int` }).from(emailQueue).where(eq(emailQueue.status, "sent"));
  const [scheduled] = await db.select({ n: sql<number>`count(*)::int` }).from(emailQueue).where(eq(emailQueue.status, "scheduled"));
  const [calls] = await db.select({ n: sql<number>`count(*)::int` }).from(bookings);

  const daily = await db.execute<{ d: string; total: number }>(sql`
    select to_char(g.d, 'Mon DD') as d, coalesce(sum(o.amount),0)::int as total
    from generate_series(current_date - interval '13 days', current_date, interval '1 day') g(d)
    left join orders o on o.status = 'paid' and date_trunc('day', o.paid_at) = g.d
    group by g.d order by g.d`);
  const days = daily.rows;
  const max = Math.max(1, ...days.map((d) => Number(d.total)));

  const activity = await db
    .select({ id: events.id, type: events.type, meta: events.meta, createdAt: events.createdAt, email: contacts.email })
    .from(events)
    .leftJoin(contacts, eq(contacts.id, events.contactId))
    .where(ne(events.type, "page_view"))
    .orderBy(desc(events.createdAt))
    .limit(12);

  const kpis = [
    ["Total revenue", money(rev.total), "💰"],
    ["Paid orders", rev.n, "🧾"],
    ["Avg. order value", money(rev.n ? Math.round(rev.total / rev.n) : 0), "📈"],
    ["Contacts", leads.n, "👥"],
    ["Customers", customers.n, "⭐"],
    ["Open carts", pending.n, "🛒"],
    ["Emails sent", sent.n, "✉️"],
    ["Calls booked", calls.n, "📅"],
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Overview</h1>
          <p className="text-sm text-slate-500">Your business at a glance. {scheduled.n} automated emails scheduled.</p>
        </div>
        <Link href="/admin/funnels" className="btn-primary px-4 py-2 text-sm">View funnel analytics →</Link>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(([l, v, i]) => (
          <div key={l} className="card p-5">
            <div className="flex items-center justify-between text-sm text-slate-500">{l}<span>{i}</span></div>
            <p className="mt-2 text-2xl font-extrabold">{v}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="card p-6">
          <h2 className="font-bold">Revenue — last 14 days</h2>
          <div className="mt-6 flex h-48 items-end gap-1.5 sm:gap-2">
            {days.map((d) => (
              <div key={d.d} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-violet-500 transition group-hover:opacity-80" style={{ height: `${Math.max(2, (Number(d.total) / max) * 160)}px` }}>
                  <span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-white group-hover:block">{money(Number(d.total))}</span>
                </div>
                <span className="hidden text-[10px] text-slate-400 sm:block">{d.d.split(" ")[1]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-bold">Live activity</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {activity.length === 0 && <li className="text-slate-500">No activity yet. Try opting in on the website!</li>}
            {activity.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-xs font-semibold text-indigo-700">{a.type.replace(/_/g, " ")}</span>
                  <p className="mt-0.5 truncate text-slate-600">{a.email ?? "anonymous"}{typeof a.meta?.trigger === "string" ? ` · ${a.meta.trigger}` : ""}</p>
                </div>
                <time className="shrink-0 text-xs text-slate-400">{a.createdAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</time>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

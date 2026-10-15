import { desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { contacts, orders } from "@/db/schema";
import { money } from "@/lib/catalog";

const STAGE: Record<string, string> = {
  lead: "bg-slate-100 text-slate-700",
  customer: "bg-emerald-100 text-emerald-800",
  vip: "bg-amber-100 text-amber-800",
};

export default async function ContactsPage({ searchParams }: { searchParams: Promise<{ q?: string; stage?: string }> }) {
  const { q = "", stage = "" } = await searchParams;
  const filters = [];
  if (q) filters.push(or(ilike(contacts.email, `%${q}%`), ilike(contacts.name, `%${q}%`), sql`${contacts.tags}::text ilike ${"%" + q + "%"}`));
  if (stage) filters.push(eq(contacts.stage, stage));
  const rows = await db
    .select({
      c: contacts,
      ltv: sql<number>`coalesce((select sum(${orders.amount}) from ${orders} where ${orders.contactId} = ${contacts.id} and ${orders.status} = 'paid'),0)::int`,
    })
    .from(contacts)
    .where(filters.length ? sql.join(filters.map((f) => sql`(${f})`), sql` and `) : undefined)
    .orderBy(desc(contacts.createdAt))
    .limit(200);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Contacts</h1>
        <p className="text-sm text-slate-500">Every lead and customer, auto-tagged by funnel activity.</p>
      </div>
      <form className="flex flex-col gap-2 sm:flex-row">
        <input name="q" defaultValue={q} placeholder="Search name, email or tag…" className="input sm:max-w-sm" />
        <select name="stage" defaultValue={stage} className="input sm:w-44">
          <option value="">All stages</option>
          <option value="lead">Leads</option>
          <option value="customer">Customers</option>
          <option value="vip">VIP</option>
        </select>
        <button className="btn-primary px-5">Filter</button>
      </form>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Stage</th><th className="px-4 py-3">Tags</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">LTV</th><th className="px-4 py-3">Joined</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No contacts yet.</td></tr>}
            {rows.map(({ c, ltv }) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3"><b className="block">{c.name || "—"}</b><span className="text-slate-500">{c.email}</span></td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STAGE[c.stage] ?? STAGE.lead}`}>{c.stage}</span></td>
                <td className="px-4 py-3"><div className="flex max-w-xs flex-wrap gap-1">{c.tags.map((t) => <span key={t} className="rounded bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium text-indigo-700">{t}</span>)}</div></td>
                <td className="px-4 py-3 text-slate-600">{c.source}</td>
                <td className="px-4 py-3 font-semibold">{money(ltv)}</td>
                <td className="px-4 py-3 text-slate-500">{c.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { contacts, orders } from "@/db/schema";
import { memberLookup } from "@/app/actions";
import { getProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Member Area — Elevate Academy" };

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ m?: string; e?: string; notfound?: string }> }) {
  const { m, e, notfound } = await searchParams;
  let member: typeof contacts.$inferSelect | undefined;
  let owned: string[] = [];
  if (m && e && Number(m)) {
    [member] = await db.select().from(contacts).where(and(eq(contacts.id, Number(m)), eq(contacts.email, e)));
    if (member) {
      const rows = await db.select().from(orders).where(and(eq(orders.contactId, member.id), eq(orders.status, "paid")));
      owned = Array.from(new Set(rows.flatMap((r) => r.items.map((i) => i.sku))));
    }
  }

  if (!member) {
    return (
      <section className="container-x flex min-h-[60vh] max-w-md flex-col justify-center py-16">
        <div className="card p-8">
          <h1 className="text-2xl font-extrabold">Member login</h1>
          <p className="mt-1 text-sm text-slate-500">Enter the email you used at checkout to access your programs.</p>
          <form action={memberLookup} className="mt-6 space-y-3">
            <input name="email" type="email" required placeholder="you@example.com" className="input" />
            <button className="btn-primary w-full">Access my courses</button>
          </form>
          {notfound && <p className="mt-3 text-sm text-rose-600">No account found for that email.</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="container-x py-14">
      <p className="eyebrow">Member area</p>
      <h1 className="mt-2 text-3xl font-extrabold">Welcome back{member.name ? `, ${member.name}` : ""} 👋</h1>
      {owned.length === 0 ? (
        <div className="card mt-8 p-8 text-center">
          <p className="text-slate-600">You don&apos;t own any programs yet.</p>
          <Link href="/courses" className="btn-primary mt-4">Browse courses</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {owned.map((sku) => {
            const p = getProduct(sku);
            if (!p) return null;
            return (
              <div key={sku} className="card p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold capitalize text-indigo-700">{p.kind === "bump" ? "bonus" : p.kind}</span>
                    <h2 className="mt-2 text-xl font-bold">{p.name}</h2>
                    <p className="text-sm text-slate-500">{p.tagline}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">0% complete</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-2 w-[3%] rounded-full bg-indigo-500" /></div>
                {p.modules ? (
                  <ul className="mt-5 divide-y divide-slate-100">
                    {p.modules.map((mod, i) => (
                      <li key={mod.title} className="flex items-center justify-between py-3 text-sm">
                        <span><b className="mr-2 text-indigo-600">{i + 1}.</b>{mod.title}</span>
                        <span className="text-slate-400">{mod.lessons} lessons ▶</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="mt-5 space-y-2 text-sm text-slate-600">
                    {(p.bullets ?? [p.description]).map((b) => <li key={b}>✓ {b}</li>)}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

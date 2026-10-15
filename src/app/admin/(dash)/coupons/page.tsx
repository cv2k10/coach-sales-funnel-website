import { asc } from "drizzle-orm";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { createCoupon, toggleCoupon } from "../../actions";

export default async function CouponsPage() {
  const rows = await db.select().from(coupons).orderBy(asc(coupons.code));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Coupons</h1>
        <p className="text-sm text-slate-500">Discount codes for launches, cart recovery and promotions.</p>
      </div>
      <form action={createCoupon} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
        <div className="flex-1"><label className="label">Code</label><input name="code" required placeholder="BLACKFRIDAY" className="input uppercase" /></div>
        <div className="sm:w-40"><label className="label">% off</label><input name="percentOff" type="number" min={1} max={100} required defaultValue={15} className="input" /></div>
        <button className="btn-primary">Create coupon</button>
      </form>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Discount</th><th className="px-4 py-3">Uses</th><th className="px-4 py-3">Status</th><th /></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((c) => (
              <tr key={c.code}>
                <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                <td className="px-4 py-3">{c.percentOff}%</td>
                <td className="px-4 py-3">{c.uses}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>{c.active ? "Active" : "Disabled"}</span></td>
                <td className="px-4 py-3 text-right">
                  <form action={toggleCoupon}><input type="hidden" name="code" value={c.code} /><button className="text-xs font-medium text-indigo-600 hover:underline">{c.active ? "Disable" : "Enable"}</button></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

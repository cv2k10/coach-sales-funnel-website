import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { contacts, orders } from "@/db/schema";
import { getProduct, money } from "@/lib/catalog";
import { refundOrder } from "../../actions";

const S: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  refunded: "bg-rose-100 text-rose-800",
};

export default async function OrdersPage() {
  const rows = await db
    .select({ o: orders, email: contacts.email, name: contacts.name })
    .from(orders)
    .leftJoin(contacts, eq(contacts.id, orders.contactId))
    .orderBy(desc(orders.createdAt))
    .limit(200);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Orders</h1>
        <p className="text-sm text-slate-500">Pending orders are open carts — the abandoned-cart sequence is recovering them automatically.</p>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th><th /></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No orders yet.</td></tr>}
            {rows.map(({ o, email, name }) => (
              <tr key={o.id} className="align-top hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs">#{String(o.id).padStart(5, "0")}</td>
                <td className="px-4 py-3"><b className="block">{name || "—"}</b><span className="text-slate-500">{email}</span></td>
                <td className="px-4 py-3">
                  {o.status === "pending" ? <span className="text-slate-500">{getProduct(o.productSku)?.name} (cart)</span> : o.items.map((i) => (
                    <div key={i.sku} className="flex items-center gap-1.5">
                      {i.name}
                      {i.kind !== "main" && <span className="rounded bg-violet-100 px-1.5 text-[10px] font-semibold uppercase text-violet-700">{i.kind}</span>}
                    </div>
                  ))}
                  {o.couponCode && <span className="text-xs text-emerald-600">Coupon: {o.couponCode}</span>}
                </td>
                <td className="px-4 py-3 font-semibold">{money(o.amount)}{o.paymentPlan === "installments" && <span className="block text-xs font-normal text-slate-500">3-pay plan</span>}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${S[o.status]}`}>{o.status === "pending" ? "open cart" : o.status}</span></td>
                <td className="px-4 py-3 text-slate-500">{o.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</td>
                <td className="px-4 py-3">
                  {o.status === "paid" && (
                    <form action={refundOrder}><input type="hidden" name="id" value={o.id} /><button className="text-xs text-rose-600 hover:underline">Refund</button></form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

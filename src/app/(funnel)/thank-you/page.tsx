import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contacts, orders } from "@/db/schema";
import { money } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Welcome! Order confirmed" };

export default async function ThankYou({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: orderId } = await searchParams;
  const [order] = orderId && Number(orderId) ? await db.select().from(orders).where(eq(orders.id, Number(orderId))) : [];
  if (!order) redirect("/");
  const [contact] = await db.select().from(contacts).where(eq(contacts.id, order.contactId));
  const memberUrl = `/members?m=${contact.id}&e=${encodeURIComponent(contact.email)}`;
  return (
    <section className="container-x max-w-2xl py-14">
      <div className="text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500 text-4xl text-white shadow-lg shadow-emerald-500/30">✓</div>
        <h1 className="mt-6 text-4xl font-extrabold">Welcome aboard{contact.name ? `, ${contact.name.split(" ")[0]}` : ""}! 🎉</h1>
        <p className="mt-3 text-lg text-slate-600">Your order is confirmed. A receipt and login details were sent to <b>{contact.email}</b>.</p>
      </div>
      <div className="card mt-10 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Order #{String(order.id).padStart(5, "0")}</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Paid</span>
        </div>
        <ul className="mt-4 divide-y divide-slate-100 text-sm">
          {order.items.map((i) => (
            <li key={i.sku} className="flex justify-between py-3">
              <span>{i.name} {i.kind !== "main" && <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] uppercase text-slate-500">{i.kind}</span>}</span>
              <span className="font-semibold">{money(i.price)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between border-t border-slate-200 pt-3 font-extrabold"><span>Total</span><span>{money(order.amount)}</span></div>
        {order.paymentPlan === "installments" && <p className="mt-1 text-xs text-slate-500">Billed on a 3-payment plan.</p>}
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link href={memberUrl} className="btn-primary py-4">Access my courses →</Link>
        <Link href="/book-call" className="btn-secondary py-4">Book onboarding call</Link>
      </div>
      <div className="mt-10 rounded-2xl bg-indigo-50 p-6 text-sm text-indigo-900">
        <b>Next steps:</b> Join the private community, watch the welcome video in Module 1, and introduce yourself. 💜
      </div>
    </section>
  );
}

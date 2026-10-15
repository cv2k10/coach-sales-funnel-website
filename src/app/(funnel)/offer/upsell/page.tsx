import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { upsellDecision } from "@/app/actions";
import { Countdown } from "@/components/client";
import { getProduct, money } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Special Offer — Elevate Academy" };

export default async function UpsellPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: orderId } = await searchParams;
  const [order] = orderId && Number(orderId) ? await db.select().from(orders).where(eq(orders.id, Number(orderId))) : [];
  if (!order || order.status !== "paid") redirect("/");
  const vip = getProduct("vip")!;
  return (
    <section className="container-x max-w-4xl py-10">
      <div className="mx-auto max-w-xl">
        <div className="flex justify-between text-xs font-semibold text-slate-500">
          <span className="text-emerald-600">✓ Order complete</span><span className="text-indigo-600">Upgrade</span><span>Access</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-slate-200"><div className="h-2.5 w-2/3 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-600" /></div>
      </div>

      <div className="mt-8 text-center">
        <p className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-800">✓ Your purchase was successful!</p>
        <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
          Want me to personally help you <span className="text-indigo-600">get results 3× faster?</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          New students only: join <b>{vip.name}</b> at over 50% off. This offer is only available on this page.
        </p>
        <div className="mt-6 flex justify-center"><Countdown minutes={10} storageKey={`upsell-${order.id}`} /></div>
      </div>

      <div className="card mt-10 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-300">VIP upgrade</p>
            <h2 className="mt-2 text-2xl font-extrabold">{vip.name}</h2>
            <p className="mt-2 text-indigo-100">{vip.tagline}</p>
            <ul className="mt-6 space-y-3">{vip.bullets?.map((b) => <li key={b} className="flex gap-2"><span className="text-amber-300">★</span>{b}</li>)}</ul>
          </div>
          <div className="flex flex-col justify-center p-8 text-center">
            <p className="text-slate-500">Normally <span className="line-through">{money(vip.compareAt!)}</span></p>
            <p className="text-5xl font-extrabold">{money(vip.price)}</p>
            <p className="mt-1 text-sm text-emerald-600">One-click — no need to re-enter your card</p>
            <form action={upsellDecision} className="mt-6 space-y-3">
              <input type="hidden" name="order" value={order.id} />
              <button name="decision" value="yes" className="btn-cta w-full">Yes! Upgrade my order →</button>
              <button name="decision" value="no" className="w-full text-sm text-slate-500 underline underline-offset-2 hover:text-slate-700">
                No thanks, I&apos;ll figure it out on my own
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

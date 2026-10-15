import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { downsellDecision } from "@/app/actions";
import { getProduct, money } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Wait — one last offer" };

export default async function DownsellPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: orderId } = await searchParams;
  const [order] = orderId && Number(orderId) ? await db.select().from(orders).where(eq(orders.id, Number(orderId))) : [];
  if (!order || order.status !== "paid") redirect("/");
  const p = getProduct("replays")!;
  return (
    <section className="container-x max-w-2xl py-14 text-center">
      <p className="eyebrow !text-rose-600">Wait! Not ready for live coaching?</p>
      <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Get the next best thing for {money(p.price)}</h1>
      <p className="mt-4 text-slate-600">{p.description} {p.tagline}</p>
      <div className="card mt-8 p-8">
        <h2 className="text-xl font-bold">{p.name}</h2>
        <ul className="mx-auto mt-4 max-w-xs space-y-2 text-left text-slate-700">{p.bullets?.map((b) => <li key={b}>✓ {b}</li>)}</ul>
        <p className="mt-6 text-slate-500">Normally <span className="line-through">{money(p.compareAt!)}</span></p>
        <p className="text-4xl font-extrabold">{money(p.price)}</p>
        <form action={downsellDecision} className="mt-6 space-y-3">
          <input type="hidden" name="order" value={order.id} />
          <button name="decision" value="yes" className="btn-cta w-full">Yes, add the Replay Library →</button>
          <button name="decision" value="no" className="w-full text-sm text-slate-500 underline underline-offset-2">No thanks, take me to my course</button>
        </form>
      </div>
    </section>
  );
}

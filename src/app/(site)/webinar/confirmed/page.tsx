import Link from "next/link";
import { money, getProduct } from "@/lib/catalog";

export const metadata = { title: "You're registered! — Elevate Academy" };

export default async function WebinarConfirmed({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s } = await searchParams;
  const mini = getProduct("mini")!;
  return (
    <section className="container-x max-w-3xl py-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">✓</div>
      <h1 className="mt-5 text-4xl font-extrabold">You&apos;re registered! 🎉</h1>
      <p className="mt-3 text-lg text-slate-600">
        Your seat is reserved for <b>{s ?? "the masterclass"}</b>. Check your inbox for the confirmation and calendar link.
      </p>
      <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
        {[["1", "Check your email", "Whitelist hello@elevate-academy.com so you get reminders."], ["2", "Add to calendar", "We'll send a reminder 1 hour before we go live."], ["3", "Show up live", "Live attendees get a bonus checklist & Q&A access."]].map(([n, t, d]) => (
          <div key={n} className="card p-5">
            <span className="text-sm font-black text-indigo-600">STEP {n}</span>
            <h3 className="mt-1 font-bold">{t}</h3>
            <p className="mt-1 text-sm text-slate-600">{d}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-8 ring-1 ring-orange-200">
        <p className="eyebrow !text-orange-600">While you wait…</p>
        <h2 className="mt-2 text-2xl font-extrabold">Get a head start with the {mini.name}</h2>
        <p className="mt-2 text-slate-600">{mini.tagline}</p>
        <p className="mt-4 text-3xl font-extrabold">{money(mini.price)} <span className="text-lg font-medium text-slate-400 line-through">{money(mini.compareAt!)}</span></p>
        <Link href={`/checkout/${mini.slug}`} className="btn-cta mt-5">Get instant access →</Link>
      </div>
    </section>
  );
}

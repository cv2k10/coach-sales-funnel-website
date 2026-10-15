import Link from "next/link";
import { Countdown } from "@/components/client";
import { getProduct, money } from "@/lib/catalog";

export const metadata = { title: "Check your inbox! + Special one-time offer" };

export default function OptInThankYou() {
  const mini = getProduct("mini")!;
  return (
    <section className="container-x max-w-4xl py-10">
      {/* Progress bar */}
      <div className="mx-auto max-w-xl">
        <div className="flex justify-between text-xs font-semibold text-slate-500">
          <span className="text-emerald-600">✓ Guide sent</span>
          <span className="text-indigo-600">Special offer</span>
          <span>Done</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-slate-200"><div className="h-2.5 w-2/3 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-600" /></div>
      </div>

      <div className="mt-8 text-center">
        <p className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-800">
          ✉️ Your Blueprint is on its way to your inbox!
        </p>
        <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
          Wait! Your order is not complete… <br className="hidden sm:block" />
          <span className="text-indigo-600">Get my 7-Day Client Magnet course for just {money(mini.price)}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          This page will only be shown once. Turn the Blueprint into real results with daily 15-minute action lessons.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="text-sm font-semibold text-rose-600">This special price expires in:</p>
        <Countdown minutes={15} storageKey="tripwire" />
      </div>

      <div className="card mt-10 grid gap-8 p-6 sm:p-10 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">{mini.name}</h2>
          <ul className="mt-5 space-y-3 text-slate-700">
            {["Day 1: Your irresistible client avatar", "Day 2: The 'no-brainer' starter offer", "Day 3: 10 warm leads in 30 minutes", "Day 4: The conversation script", "Day 5: Handling 'I can't afford it'", "Day 6: Closing with confidence", "Day 7: Onboarding your new client"].map((d) => (
              <li key={d} className="flex gap-2"><span className="text-emerald-600">✓</span>{d}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-center rounded-2xl bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-500">Regular price <span className="line-through">{money(mini.compareAt!)}</span></p>
          <p className="mt-1 text-5xl font-extrabold">{money(mini.price)}</p>
          <p className="mt-1 text-sm font-semibold text-emerald-600">You save 85% today</p>
          <Link href={`/checkout/${mini.slug}`} className="btn-cta mt-6 w-full">Yes! Add the course for {money(mini.price)} →</Link>
          <Link href="/free-guide/download" className="mt-4 text-sm text-slate-500 underline underline-offset-2 hover:text-slate-700">
            No thanks, I&apos;ll just take the free guide
          </Link>
        </div>
      </div>
    </section>
  );
}

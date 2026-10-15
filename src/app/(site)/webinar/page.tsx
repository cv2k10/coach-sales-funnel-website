import Image from "next/image";
import { COACH } from "@/lib/catalog";
import { WebinarForm } from "@/components/forms";

export const metadata = { title: "Free Masterclass — Elevate Academy" };

export default function WebinarPage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 text-white">
      <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="container-x relative grid gap-12 py-16 lg:grid-cols-[1.2fr_1fr] lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" /> Free live masterclass
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
            How to Sign 5 High-Ticket Clients a Month <span className="text-amber-300">Without Paid Ads</span>
          </h1>
          <p className="mt-5 text-lg text-indigo-100">
            In 60 minutes, I&apos;ll show you the exact 3-part funnel my students use to fill their coaching programs on autopilot.
          </p>
          <h3 className="mt-8 font-bold">You&apos;ll discover:</h3>
          <ul className="mt-3 space-y-3 text-indigo-100">
            {[
              "The 'Authority Content' formula that makes clients reach out to YOU",
              "How to structure a $3,000+ offer people say yes to",
              "My automated email + webinar funnel (I'll share my screen)",
              "The 5-step sales call that converts at 40%+",
            ].map((t) => (
              <li key={t} className="flex gap-3"><span className="text-amber-300">★</span>{t}</li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-4">
            <Image src="/images/coach.jpg" alt={COACH.name} width={56} height={56} className="h-14 w-14 rounded-full object-cover ring-2 ring-white/30" />
            <div>
              <p className="font-semibold">Hosted by {COACH.name}</p>
              <p className="text-sm text-indigo-200">{COACH.title}</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-7 text-slate-900 shadow-2xl">
          <h2 className="text-xl font-extrabold">Reserve your free seat</h2>
          <p className="mb-5 mt-1 text-sm text-slate-500">Bonus for live attendees: Funnel Checklist PDF</p>
          <WebinarForm />
        </div>
      </div>
    </section>
  );
}

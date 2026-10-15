import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COACH, COURSES, FAQS, TESTIMONIALS, getProductBySlug, money } from "@/lib/catalog";
import { Countdown, Faq } from "@/components/client";
import { Stars } from "@/components/site";

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  return { title: p ? `${p.name} — ${COACH.brand}` : "Course" };
}

const BONUSES = [
  ["Done-For-You Funnel Templates", 49700],
  ["Sales Call Script & Objection Handler", 29700],
  ["Private Community (lifetime)", 59700],
] as const;

export default async function SalesPage({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p || p.kind !== "course") notFound();
  const lessons = p.modules?.reduce((s, m) => s + m.lessons, 0) ?? 0;
  const checkout = `/checkout/${p.slug}`;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <Image src={p.image!} alt="" fill priority className="object-cover opacity-20" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
        <div className="container-x relative grid gap-10 py-16 lg:grid-cols-[1.4fr_1fr] lg:py-24">
          <div>
            {p.badge && <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900">{p.badge}</span>}
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">{p.name}</h1>
            <p className="mt-4 text-xl text-slate-300">{p.tagline}</p>
            <p className="mt-4 max-w-xl text-slate-400">{p.description}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
              <span>📚 {p.modules?.length} modules</span>
              <span>🎬 {lessons} lessons</span>
              <span>♾️ Lifetime access</span>
              <span><Stars /> 4.9 (870 reviews)</span>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-7 text-slate-900 shadow-2xl">
            <p className="text-sm font-semibold text-rose-600">🔥 Enrollment bonus ends in</p>
            <Countdown minutes={60 * 24} storageKey={`sales-${p.sku}`} className="mt-3" />
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold">{money(p.price)}</span>
              {p.compareAt && <span className="text-lg text-slate-400 line-through">{money(p.compareAt)}</span>}
            </div>
            {p.plan && <p className="mt-1 text-sm text-slate-500">or {p.plan.installments} payments of {money(p.plan.amount)}</p>}
            <Link href={checkout} className="btn-cta mt-6 w-full">Enroll Now →</Link>
            <ul className="mt-6 space-y-2 text-sm text-slate-700">
              {p.bullets?.map((b) => <li key={b}>✓ {b}</li>)}
            </ul>
            <p className="mt-5 text-center text-xs text-slate-500">🛡️ 30-day money-back guarantee</p>
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="container-x grid gap-8 py-20 md:grid-cols-2">
        <div className="rounded-3xl border border-rose-100 bg-rose-50/60 p-8">
          <h3 className="text-xl font-bold text-rose-900">Without a system…</h3>
          <ul className="mt-4 space-y-3 text-rose-900/80">
            {["You post daily but nobody buys", "Your calendar is empty one month, overflowing the next", "You undercharge and overdeliver", "You're stuck trading time for money"].map((t) => <li key={t}>✗ {t}</li>)}
          </ul>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-8">
          <h3 className="text-xl font-bold text-emerald-900">After {p.name}…</h3>
          <ul className="mt-4 space-y-3 text-emerald-900/80">
            {["Leads come in automatically every day", "You have a predictable, premium offer", "Sales calls feel natural and close", "You scale with group programs & automation"].map((t) => <li key={t}>✓ {t}</li>)}
          </ul>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="bg-slate-50 py-20">
        <div className="container-x max-w-4xl">
          <div className="text-center">
            <p className="eyebrow">Curriculum</p>
            <h2 className="h2 mt-3">What you&apos;ll learn</h2>
          </div>
          <div className="mt-10 space-y-4">
            {p.modules?.map((m, i) => (
              <div key={m.title} className="card flex gap-5 p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-100 font-black text-indigo-700">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold">{m.title}</h3>
                    <span className="text-xs font-medium text-slate-500">{m.lessons} lessons</span>
                  </div>
                  <p className="mt-1 text-slate-600">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BONUSES / VALUE STACK */}
      <section className="container-x max-w-4xl py-20">
        <div className="text-center">
          <p className="eyebrow">Enroll today and also get</p>
          <h2 className="h2 mt-3">Exclusive fast-action bonuses</h2>
        </div>
        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200">
          {[[p.name, p.compareAt ?? p.price] as const, ...BONUSES].map(([name, val], i) => (
            <div key={name} className={`flex items-center justify-between gap-4 px-6 py-4 ${i % 2 ? "bg-white" : "bg-slate-50"}`}>
              <span className="font-medium">{i === 0 ? "📦" : "🎁"} {name}</span>
              <span className="font-semibold text-slate-500">{money(val)} value</span>
            </div>
          ))}
          <div className="flex flex-col items-center justify-between gap-4 bg-slate-900 px-6 py-6 text-white sm:flex-row">
            <div>
              <p className="text-sm text-slate-400">
                Total value: <span className="line-through">{money((p.compareAt ?? p.price) + BONUSES.reduce((s, b) => s + b[1], 0))}</span>
              </p>
              <p className="text-2xl font-extrabold">Today only {money(p.price)}</p>
            </div>
            <Link href={checkout} className="btn-cta">Yes, I&apos;m In →</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-slate-50 py-20">
        <div className="container-x">
          <h2 className="h2 text-center">Students love it</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <figure key={t.name} className="card p-6">
                <Stars />
                <blockquote className="mt-3 text-slate-700">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm"><b>{t.name}</b> · <span className="text-slate-500">{t.role}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="container-x max-w-4xl py-20">
        <div className="flex flex-col items-center gap-8 rounded-3xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-8 text-center md:flex-row md:text-left">
          <div className="grid h-28 w-28 shrink-0 place-items-center rounded-full bg-emerald-500 text-center text-sm font-black leading-tight text-white shadow-lg">
            30-DAY<br />GUARANTEE
          </div>
          <div>
            <h3 className="text-2xl font-bold">The &ldquo;Do The Work&rdquo; Guarantee</h3>
            <p className="mt-2 text-slate-600">
              Go through the first 3 modules and implement. If you don&apos;t feel it&apos;s the best investment you&apos;ve made in your
              business, email us within 30 days for a full refund. No hard feelings.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x max-w-3xl pb-20">
        <h2 className="h2 mb-8 text-center">Frequently asked questions</h2>
        <Faq items={FAQS} />
        <div className="mt-12 text-center">
          <Link href={checkout} className="btn-cta px-10">Enroll in {p.name} →</Link>
          <p className="mt-3 text-sm text-slate-500">Instant access · Secure checkout · 30-day guarantee</p>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
        <div>
          <p className="text-xs text-slate-500">{p.name}</p>
          <p className="font-extrabold">{money(p.price)}</p>
        </div>
        <Link href={checkout} className="btn-cta px-5 py-3 text-base">Enroll Now</Link>
      </div>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { COACH, COURSES, FAQS, TESTIMONIALS } from "@/lib/catalog";
import { CourseCard } from "@/components/course-card";
import { ExitIntent, Faq, OptInForm } from "@/components/client";
import { Stars } from "@/components/site";

const STEPS = [
  { n: "01", title: "Free Blueprint", desc: "Get clarity with the 5-step client attraction framework.", href: "/free-guide", cta: "Download free" },
  { n: "02", title: "Live Masterclass", desc: "Watch me break down a complete high-ticket funnel live.", href: "/webinar", cta: "Save a seat" },
  { n: "03", title: "Signature Course", desc: "Implement the full system step-by-step with templates.", href: "/courses", cta: "Browse courses" },
  { n: "04", title: "VIP Coaching", desc: "Get personal strategy and accountability to scale faster.", href: "/book-call", cta: "Book a call" },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> 12,400+ coaches trained
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Turn your expertise into a{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                fully-booked coaching business
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600">
              I&apos;m {COACH.name}. I help coaches sign high-ticket clients consistently with simple content, automated funnels and
              proven sales systems — without paid ads or burnout.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/free-guide" className="btn-primary px-7 py-4 text-base">Get the Free Blueprint →</Link>
              <Link href="/courses" className="btn-secondary px-7 py-4 text-base">Explore Courses</Link>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {["J", "D", "P", "M", "E"].map((l, i) => (
                  <span key={l} className="grid h-10 w-10 place-items-center rounded-full border-2 border-white text-sm font-bold text-white" style={{ background: `hsl(${240 + i * 18} 70% 55%)` }}>{l}</span>
                ))}
              </div>
              <div className="text-sm">
                <Stars /> <b>4.9/5</b>
                <p className="text-slate-500">from 2,100+ student reviews</p>
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 rotate-3 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-violet-500" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
              <Image src="/images/coach.jpg" alt={COACH.name} fill priority sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
            </div>
            <div className="absolute -left-4 bottom-10 rounded-2xl bg-white p-4 shadow-xl sm:-left-10">
              <p className="text-xs text-slate-500">Student revenue generated</p>
              <p className="text-2xl font-extrabold text-slate-900">$48.6M+</p>
            </div>
            <div className="absolute -right-2 top-8 rounded-2xl bg-white p-4 shadow-xl sm:-right-8">
              <p className="text-xs text-slate-500">Avg. client price</p>
              <p className="text-2xl font-extrabold text-emerald-600">$3,200</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-200 bg-white">
        <div className="container-x grid grid-cols-2 gap-6 py-10 text-center md:grid-cols-4">
          {[["12,400+", "Students"], ["94%", "Completion rate"], ["$48M+", "Student revenue"], ["4.9★", "Average rating"]].map(([v, l]) => (
            <div key={l}>
              <p className="text-3xl font-extrabold text-slate-900">{v}</p>
              <p className="text-sm text-slate-500">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PATH */}
      <section className="container-x py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Your growth path</p>
          <h2 className="h2 mt-3">Wherever you are, there&apos;s a next step</h2>
          <p className="mt-4 text-slate-600">Start free, learn the system, then scale with personal support.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <Link key={s.n} href={s.href} className="card group p-6 transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg">
              <span className="text-sm font-black text-indigo-600">{s.n}</span>
              <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              <p className="mt-4 text-sm font-semibold text-indigo-600 group-hover:underline">{s.cta} →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* COURSES */}
      <section className="bg-slate-50 py-20">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Programs</p>
              <h2 className="h2 mt-3">Courses that get results</h2>
            </div>
            <Link href="/courses" className="font-semibold text-indigo-600 hover:underline">View all courses →</Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {COURSES.map((p) => <CourseCard key={p.sku} p={p} />)}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl shadow-xl">
          <Image src="/images/coach.jpg" alt={COACH.name} fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover object-top" />
        </div>
        <div>
          <p className="eyebrow">Meet your coach</p>
          <h2 className="h2 mt-3">Hi, I&apos;m {COACH.name} 👋</h2>
          <p className="mt-5 text-slate-600">
            Eight years ago I was a burnt-out corporate consultant with a dream of coaching full-time. My first year I made $4,000.
            Then I discovered how to package my expertise into a premium offer and automate the way clients found me.
          </p>
          <p className="mt-4 text-slate-600">
            Today I run a 7-figure education company and I&apos;ve helped over 12,000 coaches do the same — with systems that
            work while you sleep.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Featured in Forbes & Entrepreneur", "7-figure coaching business", "12,400+ students in 60 countries", "Certified ICF coach"].map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-xs text-emerald-700">✓</span>{t}
              </li>
            ))}
          </ul>
          <Link href="/book-call" className="btn-primary mt-8">Book a free strategy call</Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="results" className="bg-slate-950 py-20 text-white">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">Student results</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Real coaches. Real results.</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <Stars />
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">{t.result}</span>
                </div>
                <blockquote className="mt-4 text-slate-200">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 font-bold">{t.name[0]}</span>
                  <span><b className="block text-sm">{t.name}</b><span className="text-xs text-slate-400">{t.role}</span></span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD MAGNET */}
      <section className="container-x py-20">
        <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white shadow-2xl sm:p-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-200">Free download</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">The 5-Step Client Attraction Blueprint</h2>
            <p className="mt-4 text-indigo-100">The exact framework I use to attract high-ticket clients on autopilot. 27 pages, zero fluff.</p>
            <ul className="mt-6 space-y-2 text-indigo-50">
              {["Find your profitable niche in 20 minutes", "The 3-email sequence that books calls", "My DM script with a 38% reply rate"].map((b) => <li key={b}>✓ {b}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
            <OptInForm source="home-section" dark />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x max-w-3xl pb-24">
        <div className="text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="h2 mt-3">Questions? Answers.</h2>
        </div>
        <div className="mt-10"><Faq items={FAQS} /></div>
      </section>

      <ExitIntent />
    </>
  );
}

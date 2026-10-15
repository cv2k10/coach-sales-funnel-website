import Link from "next/link";
import { COACH } from "@/lib/catalog";
import { MobileNav } from "./client";

const LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/webinar", label: "Free Masterclass" },
  { href: "/book-call", label: "Strategy Call" },
  { href: "/#results", label: "Results" },
  { href: "/members", label: "Member Login" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-black text-white shadow-md">
        E
      </span>
      <span className={`text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>
        {COACH.brand}
      </span>
    </Link>
  );
}

export function AnnouncementBar() {
  return (
    <div className="bg-slate-950 px-4 py-2 text-center text-sm text-white">
      🎓 <b>Free live masterclass:</b> How to sign high-ticket clients without paid ads.{" "}
      <Link href="/webinar" className="font-semibold text-amber-300 underline underline-offset-2">
        Save my seat →
      </Link>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg">
      <div className="container-x relative flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/free-guide" className="btn-primary hidden px-4 py-2 text-sm md:inline-flex">
            Get Free Blueprint
          </Link>
          <MobileNav links={LINKS} />
        </div>
      </div>
    </header>
  );
}

export function FunnelHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container-x flex h-14 items-center justify-between">
        <Logo />
        <span className="hidden text-xs font-medium text-slate-500 sm:block">🔒 Secure · 256-bit SSL encrypted</span>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm">
            Helping coaches, consultants and course creators build profitable, automated online businesses since 2016.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Programs</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/courses/coach-accelerator" className="hover:text-white">Online Coach Accelerator</Link></li>
            <li><Link href="/courses/content-to-clients" className="hover:text-white">Content to Clients</Link></li>
            <li><Link href="/courses/launch-lab" className="hover:text-white">Launch Lab</Link></li>
            <li><Link href="/book-call" className="hover:text-white">1:1 & VIP Coaching</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Free resources</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/free-guide" className="hover:text-white">Client Attraction Blueprint</Link></li>
            <li><Link href="/webinar" className="hover:text-white">Live Masterclass</Link></li>
            <li><Link href="/members" className="hover:text-white">Member Area</Link></li>
            <li><Link href="/admin" className="hover:text-white">Coach Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} {COACH.brand}. All rights reserved.</p>
          <p>Results vary. Testimonials reflect individual experiences. · {COACH.email}</p>
        </div>
      </div>
    </footer>
  );
}

export function Stars() {
  return <span className="text-amber-400">★★★★★</span>;
}

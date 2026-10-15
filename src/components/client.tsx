"use client";

import { useActionState, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { optInAction, type FormState } from "@/app/actions";

/* ---------- Page view tracking ---------- */
export function TrackView({ type = "page_view" }: { type?: string }) {
  const path = usePathname();
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type, path }),
      keepalive: true,
    }).catch(() => {});
  }, [path, type]);
  return null;
}

/* ---------- Countdown (evergreen, per-visitor deadline) ---------- */
export function Countdown({
  minutes = 15,
  storageKey = "offer",
  className = "",
  compact = false,
}: {
  minutes?: number;
  storageKey?: string;
  className?: string;
  compact?: boolean;
}) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const key = `deadline:${storageKey}`;
    let deadline = Number(localStorage.getItem(key));
    if (!deadline || deadline < Date.now()) {
      deadline = Date.now() + minutes * 60_000;
      localStorage.setItem(key, String(deadline));
    }
    const tick = () => setLeft(Math.max(0, deadline - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [minutes, storageKey]);
  const s = Math.floor((left ?? minutes * 60_000) / 1000);
  const parts = [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, "0"));
  if (compact) return <span className={`font-mono tabular-nums ${className}`}>{parts.join(":")}</span>;
  return (
    <div className={`flex gap-2 ${className}`}>
      {["Hours", "Minutes", "Seconds"].map((l, i) => (
        <div key={l} className="min-w-16 rounded-xl bg-slate-900 px-3 py-2 text-center text-white shadow">
          <div className="font-mono text-2xl font-bold tabular-nums">{parts[i]}</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400">{l}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Opt-in form ---------- */
export function OptInForm({
  source = "lead-magnet",
  cta = "Send Me The Free Blueprint",
  dark = false,
  showName = true,
}: {
  source?: string;
  cta?: string;
  dark?: boolean;
  showName?: boolean;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(optInAction, undefined);
  const input = `w-full rounded-xl border px-4 py-3.5 text-base outline-none transition focus:ring-4 ${
    dark
      ? "border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:ring-white/20"
      : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-100"
  }`;
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="source" value={source} />
      {showName && <input name="name" placeholder="First name" className={input} autoComplete="given-name" />}
      <input name="email" type="email" required placeholder="Your best email" className={input} autoComplete="email" />
      {state?.error && <p className="text-sm text-rose-500">{state.error}</p>}
      <button disabled={pending} className="btn-primary w-full py-4 text-base">
        {pending ? "Sending…" : cta} →
      </button>
      <p className={`text-center text-xs ${dark ? "text-white/60" : "text-slate-500"}`}>
        🔒 100% free. No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}

/* ---------- Exit-intent popup ---------- */
export function ExitIntent() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("exit-shown")) return;
    const show = () => {
      if (sessionStorage.getItem("exit-shown")) return;
      sessionStorage.setItem("exit-shown", "1");
      setOpen(true);
    };
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    const timer = setTimeout(show, 45_000); // mobile fallback: show after 45s
    document.addEventListener("mouseout", onLeave);
    return () => {
      document.removeEventListener("mouseout", onLeave);
      clearTimeout(timer);
    };
  }, []);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fade">
      <div className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          ✕
        </button>
        <div className="hidden items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-100 p-6 md:flex">
          <Image src="/images/guide.png" alt="Free guide" width={320} height={320} className="rounded-xl" />
        </div>
        <div className="p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Wait! Before you go…</p>
          <h3 className="mt-2 text-2xl font-extrabold text-slate-900">Grab the free Client Attraction Blueprint</h3>
          <p className="mt-2 text-sm text-slate-600">The 5-step framework I used to land my first 10 high-ticket clients — free.</p>
          <div className="mt-5">
            <OptInForm source="exit-intent" cta="Get Instant Access" showName={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Social proof notifications ---------- */
const PROOF = [
  ["Sarah", "Austin, TX", "enrolled in Online Coach Accelerator"],
  ["James", "London, UK", "downloaded the free Blueprint"],
  ["Aisha", "Toronto, CA", "registered for the masterclass"],
  ["Carlos", "Miami, FL", "joined Content to Clients"],
  ["Hannah", "Sydney, AU", "booked a strategy call"],
  ["Liam", "Dublin, IE", "enrolled in Launch Lab"],
];
export function SocialProof() {
  const [i, setI] = useState(-1);
  useEffect(() => {
    let idx = 0;
    const first = setTimeout(() => setI(0), 8000);
    const iv = setInterval(() => {
      idx = (idx + 1) % PROOF.length;
      setI(-1);
      setTimeout(() => setI(idx), 600);
    }, 14000);
    return () => {
      clearTimeout(first);
      clearInterval(iv);
    };
  }, []);
  if (i < 0) return null;
  const [n, loc, what] = PROOF[i];
  return (
    <div className="fixed bottom-4 left-4 z-50 flex max-w-xs items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 pr-5 shadow-xl animate-slide-up">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 font-bold text-white">
        {n[0]}
      </div>
      <div className="text-sm leading-tight">
        <p className="font-semibold text-slate-900">
          {n} <span className="font-normal text-slate-500">from {loc}</span>
        </p>
        <p className="text-slate-600">{what}</p>
        <p className="mt-0.5 text-[11px] text-emerald-600">✓ Verified · just now</p>
      </div>
    </div>
  );
}

/* ---------- Mobile nav ---------- */
export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700"
      >
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-slate-200 bg-white px-4 pb-5 pt-2 shadow-lg">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-50">
              {l.label}
            </Link>
          ))}
          <Link href="/free-guide" className="btn-primary mt-2 w-full">
            Free Blueprint
          </Link>
        </div>
      )}
    </div>
  );
}

/* ---------- FAQ accordion ---------- */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {items.map((f, i) => (
        <div key={f.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-slate-900"
          >
            {f.q}
            <span className={`text-indigo-600 transition ${open === i ? "rotate-45" : ""}`}>＋</span>
          </button>
          {open === i && <p className="px-6 pb-5 text-slate-600">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}

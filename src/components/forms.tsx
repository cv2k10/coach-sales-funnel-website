"use client";

import { useActionState, useMemo, useState } from "react";
import { bookCallAction, webinarAction, type FormState } from "@/app/actions";

function nextDays(n: number, skipWeekend = false) {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    if (skipWeekend && (d.getDay() === 0 || d.getDay() === 6)) continue;
    out.push(new Date(d));
  }
  return out;
}
const fmtDay = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

export function WebinarForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(webinarAction, undefined);
  const sessions = useMemo(
    () => nextDays(3).flatMap((d, i) => (i === 0 ? [`${fmtDay(d)} · 11:00 AM ET`, `${fmtDay(d)} · 7:00 PM ET`] : [`${fmtDay(d)} · 7:00 PM ET`])),
    [],
  );
  const [session, setSession] = useState("");
  return (
    <form action={action} className="space-y-4">
      <div>
        <p className="label">Choose your session</p>
        <div className="grid gap-2">
          {sessions.map((s) => (
            <label key={s} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${session === s ? "border-indigo-500 bg-indigo-50 text-indigo-900" : "border-slate-200 hover:border-slate-300"}`}>
              <input type="radio" name="session" value={s} checked={session === s} onChange={() => setSession(s)} className="accent-indigo-600" />
              📅 {s}
            </label>
          ))}
        </div>
      </div>
      <input name="name" placeholder="First name" className="input" required />
      <input name="email" type="email" placeholder="Best email" className="input" required />
      {state?.error && <p className="text-sm text-rose-600">{state.error}</p>}
      <button disabled={pending} className="btn-cta w-full">{pending ? "Reserving…" : "Reserve My Free Seat →"}</button>
      <p className="text-center text-xs text-slate-500">Limited to 500 live attendees per session.</p>
    </form>
  );
}

const TIMES = ["10:00 AM", "11:30 AM", "1:00 PM", "3:00 PM", "4:30 PM"];

export function BookCallForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(bookCallAction, undefined);
  const days = useMemo(() => nextDays(5, true), []);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState("");
  const slot = time ? `${fmtDay(days[day])} at ${time} ET` : "";
  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="slot" value={slot} />
      <div>
        <p className="label">1. Pick a day</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {days.map((d, i) => (
            <button type="button" key={i} onClick={() => { setDay(i); setTime(""); }} className={`rounded-xl border px-2 py-3 text-center text-sm transition ${day === i ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 hover:border-indigo-300"}`}>
              <span className="block text-xs opacity-80">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
              <b>{d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</b>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="label">2. Pick a time (Eastern)</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {TIMES.map((t, i) => {
            const taken = (day + i) % 4 === 0;
            return (
              <button type="button" key={t} disabled={taken} onClick={() => setTime(t)} className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through ${time === t ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 hover:border-indigo-300"}`}>
                {t}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <p className="label">3. Tell me about you</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="name" placeholder="Full name" className="input" required />
          <input name="email" type="email" placeholder="Email" className="input" required />
          <input name="phone" placeholder="Phone (optional)" className="input" />
          <select name="revenue" className="input" defaultValue="">
            <option value="" disabled>Current monthly revenue</option>
            <option>Just starting ($0)</option>
            <option>$1 – $3k</option>
            <option>$3k – $10k</option>
            <option>$10k+</option>
          </select>
        </div>
        <textarea name="goal" rows={3} placeholder="What's your #1 goal for the next 90 days?" className="input mt-3" />
      </div>
      {state?.error && <p className="text-sm text-rose-600">{state.error}</p>}
      <button disabled={pending || !slot} className="btn-cta w-full">
        {pending ? "Booking…" : slot ? `Confirm call · ${slot}` : "Select a time to continue"}
      </button>
    </form>
  );
}

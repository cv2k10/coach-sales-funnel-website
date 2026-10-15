import Link from "next/link";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { countEvents, countPurchasesOfKind, pct } from "@/lib/stats";
import { COURSES } from "@/lib/catalog";

type Step = { label: string; value: number };

function FunnelCard({ title, desc, href, steps }: { title: string; desc: string; href: string; steps: Step[] }) {
  const top = Math.max(1, steps[0]?.value ?? 1);
  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm text-slate-500">{desc}</p>
        </div>
        <Link href={href} target="_blank" className="text-sm font-semibold text-indigo-600 hover:underline">Open funnel ↗</Link>
      </div>
      <div className="mt-6 space-y-3">
        {steps.map((s, i) => (
          <div key={s.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">{s.label}</span>
              <span className="text-slate-500">
                <b className="text-slate-900">{s.value}</b>
                {i > 0 && <span className="ml-2 rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">{pct(s.value, steps[i - 1].value)}</span>}
              </span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500" style={{ width: `${Math.max(2, (s.value / top) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function FunnelsPage() {
  const courseSkus = COURSES.map((c) => c.sku);
  const [squeeze, optins, oto, tripwire, sales, checkouts, coursePurchases, bumps, upsells, downsells, webViews, webRegs, callViews, callsBooked] =
    await Promise.all([
      countEvents("page_view", { path: "/free-guide" }),
      countEvents("optin"),
      countEvents("page_view", { path: "/free-guide/thank-you" }),
      countPurchasesOfKind(["mini"]),
      countEvents("page_view", { pathLike: "/courses/%" }),
      countEvents("checkout_started"),
      countPurchasesOfKind(courseSkus),
      countEvents("bump_accepted"),
      countEvents("upsell_accepted"),
      countEvents("downsell_accepted"),
      countEvents("page_view", { path: "/webinar" }),
      countEvents("webinar_registered"),
      countEvents("page_view", { path: "/book-call" }),
      countEvents("call_booked"),
    ]);
  const [won] = await db.select({ n: sql<number>`count(*)::int` }).from(bookings).where(eq(bookings.status, "won"));
  const allPurchases = await countEvents("purchase");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Funnels</h1>
        <p className="text-sm text-slate-500">Step-by-step conversion for every funnel. Percentages show conversion from the previous step.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <FunnelCard title="Lead Magnet → Tripwire" desc="Squeeze page, opt-in, $7 one-time offer" href="/free-guide" steps={[
          { label: "Squeeze page views", value: squeeze },
          { label: "Opt-ins (leads)", value: optins },
          { label: "Tripwire offer views", value: oto },
          { label: "Tripwire purchases", value: tripwire },
        ]} />
        <FunnelCard title="Course Sales Funnel" desc="Sales page → checkout → bump → upsell → downsell" href="/courses/coach-accelerator" steps={[
          { label: "Sales page views", value: sales },
          { label: "Checkouts started", value: checkouts },
          { label: "Course purchases", value: coursePurchases },
          { label: "Order bumps (of all orders)", value: bumps },
          { label: "Upsells accepted", value: upsells },
        ]} />
        <FunnelCard title="Webinar Funnel" desc="Masterclass registration with reminders & replay" href="/webinar" steps={[
          { label: "Registration page views", value: webViews },
          { label: "Registrations", value: webRegs },
        ]} />
        <FunnelCard title="High-Ticket Application" desc="Strategy call booking → closed client" href="/book-call" steps={[
          { label: "Booking page views", value: callViews },
          { label: "Calls booked", value: callsBooked },
          { label: "Clients won", value: won.n },
        ]} />
      </div>
      <div className="card grid grid-cols-2 gap-4 p-6 text-center sm:grid-cols-4">
        {[["Order bump take rate", pct(bumps, allPurchases)], ["Upsell take rate", pct(upsells, allPurchases)], ["Downsell take rate", pct(downsells, Math.max(0, allPurchases - upsells))], ["Checkout completion", pct(allPurchases, checkouts)]].map(([l, v]) => (
          <div key={l}><p className="text-2xl font-extrabold">{v}</p><p className="text-xs text-slate-500">{l}</p></div>
        ))}
      </div>
    </div>
  );
}

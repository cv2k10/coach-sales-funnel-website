import Image from "next/image";
import { OptInForm } from "@/components/client";
import { Stars } from "@/components/site";

export const metadata = { title: "Free: 5-Step Client Attraction Blueprint" };

export default function SqueezePage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="container-x grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
        <div className="order-2 lg:order-1">
          <p className="eyebrow">Free instant download</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            The 5-Step Blueprint to Attract <span className="text-indigo-600">High-Ticket Clients</span> on Autopilot
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Discover the simple framework 12,000+ coaches use to fill their calendar — without cold DMs, paid ads or posting 5x a day.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "The 'Million-Dollar Niche' worksheet",
              "The 3-email sequence that books sales calls",
              "My exact DM script (38% reply rate)",
              "A 30-day client attraction action plan",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3 text-slate-700">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-600 text-xs text-white">✓</span>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 max-w-md rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <OptInForm source="squeeze-page" />
          </div>
          <p className="mt-5 text-sm text-slate-500"><Stars /> Downloaded by <b>27,831</b> coaches</p>
        </div>
        <div className="order-1 flex justify-center lg:order-2">
          <Image src="/images/guide.png" alt="Client Attraction Blueprint" width={520} height={520} priority className="w-full max-w-sm drop-shadow-2xl lg:max-w-lg" />
        </div>
      </div>
    </section>
  );
}

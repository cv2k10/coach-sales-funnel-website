import { BookCallForm } from "@/components/forms";

export const metadata = { title: "Book a Strategy Call — Elevate Academy" };

export default function BookCallPage() {
  return (
    <section className="bg-gradient-to-b from-indigo-50 to-white">
      <div className="container-x grid gap-10 py-16 lg:grid-cols-[1fr_1.3fr] lg:py-20">
        <div>
          <p className="eyebrow">Free 30-minute session</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Book your Growth Strategy Call</h1>
          <p className="mt-4 text-lg text-slate-600">
            On this call, a senior coach on my team will map out a custom plan to help you reach your next revenue milestone.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              ["🎯", "Clarity", "Identify the #1 bottleneck holding your business back."],
              ["🗺️", "Roadmap", "Leave with a step-by-step 90-day action plan."],
              ["🤝", "Fit", "See if VIP coaching is right for you — zero pressure."],
            ].map(([i, t, d]) => (
              <li key={t} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-xl shadow-sm">{i}</span>
                <div><b>{t}</b><p className="text-sm text-slate-600">{d}</p></div>
              </li>
            ))}
          </ul>
          <p className="mt-8 rounded-2xl bg-white p-5 text-sm italic text-slate-600 shadow-sm">
            &ldquo;That one call changed everything. I raised my prices 3x and signed 4 clients the next month.&rdquo;
            <span className="mt-2 block not-italic font-semibold text-slate-900">— Marcus T., Business Coach</span>
          </p>
        </div>
        <div className="card p-6 sm:p-8">
          <BookCallForm />
        </div>
      </div>
    </section>
  );
}

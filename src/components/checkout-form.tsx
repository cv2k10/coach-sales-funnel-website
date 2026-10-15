"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { checkCoupon, completeCheckout, startCheckout } from "@/app/actions";
import { money, type Product } from "@/lib/catalog";

export function CheckoutForm({ product, bump }: { product: Product; bump: Product }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [addBump, setAddBump] = useState(false);
  const [plan, setPlan] = useState<"full" | "installments">("full");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; percentOff: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const discount = coupon ? Math.round(product.price * (coupon.percentOff / 100)) : 0;
  const total = product.price - discount + (addBump ? bump.price : 0);
  const dueToday = plan === "installments" && product.plan ? product.plan.amount + (addBump ? bump.price : 0) : total;

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter your name and a valid email.");
    start(async () => {
      const r = await startCheckout({ sku: product.sku, email, name });
      if ("error" in r) return setError("Something went wrong. Please try again.");
      setStep(2);
    });
  };

  const applyCoupon = () =>
    start(async () => {
      if (!couponInput.trim()) return;
      const r = await checkCoupon(couponInput);
      if (r.ok) {
        setCoupon({ code: r.code, percentOff: r.percentOff });
        setCouponMsg(`✓ ${r.code} applied — ${r.percentOff}% off`);
      } else {
        setCoupon(null);
        setCouponMsg(r.error);
      }
    });

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    start(async () => {
      const r = await completeCheckout({ sku: product.sku, email, name, bump: addBump, coupon: coupon?.code, plan });
      if ("error" in r) return setError(r.error ?? "Payment failed");
      const isUpsellFlow = product.kind === "course" || product.kind === "tripwire";
      router.push(isUpsellFlow ? `/offer/upsell?order=${r.orderId}` : `/thank-you?order=${r.orderId}`);
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="card p-6 sm:p-8">
        {/* Steps */}
        <div className="mb-6 grid grid-cols-2 gap-2 text-sm font-semibold">
          {["Your info", "Payment"].map((s, i) => (
            <div key={s} className={`rounded-xl px-4 py-3 text-center ${step === i + 1 ? "bg-indigo-600 text-white" : step > i + 1 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
              {step > i + 1 ? "✓" : i + 1}. {s}
            </div>
          ))}
        </div>

        {step === 1 ? (
          <form onSubmit={next} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Jane Doe" autoComplete="name" />
            </div>
            <div>
              <label className="label">Email address</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" placeholder="jane@example.com" autoComplete="email" />
              <p className="mt-1 text-xs text-slate-500">Your login details will be sent here.</p>
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button disabled={pending} className="btn-cta w-full">{pending ? "Saving…" : "Continue to payment →"}</button>
          </form>
        ) : (
          <form onSubmit={pay} className="space-y-5">
            <p className="text-sm text-slate-600">
              Enrolling as <b>{name}</b> ({email}){" "}
              <button type="button" onClick={() => setStep(1)} className="text-indigo-600 underline">edit</button>
            </p>

            {product.plan && (
              <div className="grid gap-2 sm:grid-cols-2">
                {([["full", `Pay in full · ${money(product.price)}`, "Best value"], ["installments", `${product.plan.installments} × ${money(product.plan.amount)}`, "Monthly"]] as const).map(([v, l, s]) => (
                  <label key={v} className={`cursor-pointer rounded-xl border-2 p-4 text-sm transition ${plan === v ? "border-indigo-600 bg-indigo-50" : "border-slate-200"}`}>
                    <input type="radio" name="plan" className="sr-only" checked={plan === v} onChange={() => setPlan(v)} />
                    <b className="block">{l}</b>
                    <span className="text-xs text-slate-500">{s}</span>
                  </label>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <label className="label">Card details <span className="font-normal text-slate-400">(demo — use any numbers)</span></label>
              <input className="input" placeholder="4242 4242 4242 4242" inputMode="numeric" defaultValue="4242 4242 4242 4242" />
              <div className="grid grid-cols-2 gap-3">
                <input className="input" placeholder="MM / YY" defaultValue="12 / 30" />
                <input className="input" placeholder="CVC" defaultValue="123" />
              </div>
            </div>

            {/* Order bump */}
            <label className={`block cursor-pointer rounded-2xl border-2 border-dashed p-4 transition ${addBump ? "border-emerald-500 bg-emerald-50" : "border-amber-400 bg-amber-50"}`}>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={addBump} onChange={(e) => setAddBump(e.target.checked)} className="h-5 w-5 accent-emerald-600" />
                <span className="text-sm font-extrabold text-rose-600 animate-pulse">➜</span>
                <b className="text-sm">Yes! Add the {bump.name} for just {money(bump.price)}</b>
              </div>
              <p className="mt-2 pl-8 text-sm text-slate-700">
                <b className="text-rose-600">One-time offer:</b> {bump.tagline} Normally {money(bump.compareAt!)}.
              </p>
            </label>

            <div className="flex gap-2">
              <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="input" placeholder="Coupon code" />
              <button type="button" onClick={applyCoupon} className="btn-secondary shrink-0 px-4">Apply</button>
            </div>
            {couponMsg && <p className={`text-sm ${coupon ? "text-emerald-600" : "text-rose-600"}`}>{couponMsg}</p>}

            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button disabled={pending} className="btn-cta w-full">
              {pending ? "Processing…" : `Complete purchase · ${money(dueToday)}`}
            </button>
            <p className="text-center text-xs text-slate-500">🔒 Secure checkout · 30-day money-back guarantee</p>
          </form>
        )}
      </div>

      {/* Summary */}
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="card p-6">
          <h2 className="font-bold">Order summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3"><span>{product.name}</span><span className="font-semibold">{money(product.price)}</span></div>
            {coupon && <div className="flex justify-between text-emerald-600"><span>Coupon {coupon.code}</span><span>−{money(discount)}</span></div>}
            {addBump && <div className="flex justify-between gap-3"><span>{bump.name}</span><span className="font-semibold">{money(bump.price)}</span></div>}
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold"><span>Total</span><span>{money(total)}</span></div>
            {plan === "installments" && product.plan && <p className="text-xs text-slate-500">Due today: {money(dueToday)}, then {product.plan.installments - 1} monthly payments of {money(product.plan.amount)}</p>}
          </div>
        </div>
        <div className="card p-6 text-sm">
          <p className="font-bold">What you get</p>
          <ul className="mt-3 space-y-2 text-slate-600">{(product.bullets ?? []).map((b) => <li key={b}>✓ {b}</li>)}</ul>
        </div>
        <div className="card flex gap-3 p-5 text-sm">
          <span className="text-2xl">🛡️</span>
          <p className="text-slate-600"><b className="text-slate-900">30-day guarantee.</b> Try it risk-free. Full refund if it&apos;s not for you.</p>
        </div>
      </aside>
    </div>
  );
}

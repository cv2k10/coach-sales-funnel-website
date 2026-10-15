import Link from "next/link";

export const metadata = { title: "Call booked — Elevate Academy" };

export default async function CallConfirmed({ searchParams }: { searchParams: Promise<{ slot?: string }> }) {
  const { slot } = await searchParams;
  return (
    <section className="container-x max-w-2xl py-20 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">📅</div>
      <h1 className="mt-5 text-4xl font-extrabold">Your call is booked!</h1>
      <p className="mt-3 text-lg text-slate-600">
        We&apos;ll see you <b>{slot}</b>. A confirmation email with the Zoom link is on its way.
      </p>
      <div className="card mt-10 p-6 text-left">
        <h2 className="font-bold">Before the call, please:</h2>
        <ul className="mt-3 space-y-2 text-slate-600">
          <li>✓ Watch the 2-minute prep video in your inbox</li>
          <li>✓ Write down your revenue goal for the next 90 days</li>
          <li>✓ Join from a quiet place with a stable connection</li>
        </ul>
      </div>
      <Link href="/courses" className="btn-secondary mt-8">Browse courses meanwhile</Link>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Download: Client Attraction Blueprint" };

const STEPS = [
  ["Pick a painful, profitable problem", "Niche around a problem people already spend money to solve. Write down 3 and test each with 5 conversations."],
  ["Craft a signature promise", "\"I help [who] achieve [result] in [timeframe] without [pain].\" Make it specific and measurable."],
  ["Publish authority content", "Post 3x a week: 1 story, 1 teaching post, 1 client result. Every post ends with an invitation."],
  ["Capture & nurture leads", "Offer a free resource, then send a 5-email welcome sequence that builds trust and invites a call."],
  ["Convert on a call", "Use a 5-step call: rapport → current state → desired state → gap → invitation. Then follow up within 24h."],
];

export default function Download() {
  return (
    <section className="container-x max-w-3xl py-12">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <Image src="/images/guide.png" alt="" width={140} height={140} className="rounded-xl" />
        <div>
          <p className="eyebrow">Your free guide</p>
          <h1 className="mt-2 text-3xl font-extrabold">The 5-Step Client Attraction Blueprint</h1>
          <p className="mt-2 text-slate-600">A copy has also been emailed to you. Here&apos;s the quick-start version:</p>
        </div>
      </div>
      <ol className="mt-10 space-y-4">
        {STEPS.map(([t, d], i) => (
          <li key={t} className="card flex gap-4 p-6">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-600 font-bold text-white">{i + 1}</span>
            <div><h2 className="font-bold">{t}</h2><p className="mt-1 text-slate-600">{d}</p></div>
          </li>
        ))}
      </ol>
      <div className="mt-10 rounded-3xl bg-slate-900 p-8 text-center text-white">
        <h2 className="text-2xl font-extrabold">Want to see this in action?</h2>
        <p className="mt-2 text-slate-300">Join my free live masterclass where I build a complete funnel on screen.</p>
        <Link href="/webinar" className="btn-cta mt-5">Save my free seat →</Link>
      </div>
    </section>
  );
}

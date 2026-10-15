import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { contacts, emailQueue, sequences } from "@/db/schema";
import { cancelEmail, fastForward, runQueue } from "../../actions";

const S: Record<string, string> = {
  sent: "bg-emerald-100 text-emerald-800",
  scheduled: "bg-sky-100 text-sky-800",
  cancelled: "bg-slate-100 text-slate-500",
};

export default async function EmailsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const rows = await db
    .select({ e: emailQueue, email: contacts.email, seq: sequences.name })
    .from(emailQueue)
    .leftJoin(contacts, eq(contacts.id, emailQueue.contactId))
    .leftJoin(sequences, eq(sequences.id, emailQueue.sequenceId))
    .where(status ? eq(emailQueue.status, status) : undefined)
    .orderBy(desc(emailQueue.sendAt))
    .limit(200);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Email Queue</h1>
          <p className="text-sm text-slate-500">Scheduled & delivered automation emails. Due emails are sent automatically.</p>
        </div>
        <div className="flex gap-2">
          <form action={runQueue}><button className="btn-secondary px-4 py-2 text-sm">▶ Process due emails</button></form>
          <form action={fastForward}><button className="btn-primary px-4 py-2 text-sm">⏩ Send all now (demo)</button></form>
        </div>
      </div>
      <div className="flex gap-2 text-sm">
        {[["", "All"], ["scheduled", "Scheduled"], ["sent", "Sent"], ["cancelled", "Cancelled"]].map(([v, l]) => (
          <a key={v} href={v ? `?status=${v}` : "?"} className={`rounded-full px-3 py-1.5 font-medium ${status === v || (!status && !v) ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>{l}</a>
        ))}
      </div>
      <div className="space-y-3">
        {rows.length === 0 && <div className="card p-10 text-center text-slate-500">No emails here yet.</div>}
        {rows.map(({ e, email, seq }) => (
          <details key={e.id} className="card group">
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-4">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${S[e.status]}`}>{e.status}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{e.subject}</p>
                <p className="truncate text-xs text-slate-500">To {email} · {seq}</p>
              </div>
              <time className="text-xs text-slate-500">
                {e.status === "sent" && e.sentAt ? "Sent " + e.sentAt.toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }) : "Send at " + e.sendAt.toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })}
              </time>
            </summary>
            <div className="border-t border-slate-100 p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">{e.body}</pre>
              {e.status === "scheduled" && (
                <form action={cancelEmail} className="mt-3"><input type="hidden" name="id" value={e.id} /><button className="text-xs text-rose-600 hover:underline">Cancel this email</button></form>
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

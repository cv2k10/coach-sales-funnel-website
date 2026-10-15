import { asc, sql } from "drizzle-orm";
import { db } from "@/db";
import { emailQueue, sequenceSteps, sequences } from "@/db/schema";
import { TRIGGERS } from "@/lib/automation";
import { deleteStep, saveStep, toggleSequence } from "../../actions";

const delayLabel = (h: number) => (h === 0 ? "Immediately" : h < 24 ? `After ${h}h` : `Day ${Math.round((h / 24) * 10) / 10}`);

export default async function AutomationsPage() {
  const seqs = await db.select().from(sequences).orderBy(asc(sequences.id));
  const steps = await db.select().from(sequenceSteps).orderBy(asc(sequenceSteps.position), asc(sequenceSteps.id));
  const stats = await db
    .select({ id: emailQueue.sequenceId, sent: sql<number>`count(*) filter (where ${emailQueue.status} = 'sent')::int`, scheduled: sql<number>`count(*) filter (where ${emailQueue.status} = 'scheduled')::int` })
    .from(emailQueue)
    .groupBy(emailQueue.sequenceId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Automations</h1>
        <p className="text-sm text-slate-500">
          Event-triggered email sequences. Use <code className="rounded bg-slate-100 px-1">{"{{name}}"}</code>, <code className="rounded bg-slate-100 px-1">{"{{site}}"}</code>, <code className="rounded bg-slate-100 px-1">{"{{product}}"}</code> or <code className="rounded bg-slate-100 px-1">{"{{slot}}"}</code> as merge tags.
        </p>
      </div>
      {seqs.map((s) => {
        const st = stats.find((x) => x.id === s.id);
        const mine = steps.filter((x) => x.sequenceId === s.id);
        return (
          <details key={s.id} className="card group overflow-hidden" open={s.trigger === "lead_magnet_optin"}>
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${s.active ? "bg-emerald-500" : "bg-slate-300"}`} />
                <div>
                  <h2 className="font-bold">{s.name}</h2>
                  <p className="text-xs text-slate-500">⚡ Trigger: <b>{TRIGGERS[s.trigger] ?? s.trigger}</b> · {mine.length} emails</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span><b className="text-slate-900">{st?.sent ?? 0}</b> sent</span>
                <span><b className="text-slate-900">{st?.scheduled ?? 0}</b> scheduled</span>
                <span className="text-indigo-600 group-open:rotate-180">▾</span>
              </div>
            </summary>
            <div className="border-t border-slate-100 bg-slate-50/60 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-600">{s.description}</p>
                <form action={toggleSequence}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${s.active ? "bg-slate-200 text-slate-700" : "bg-emerald-600 text-white"}`}>
                    {s.active ? "Pause automation" : "Activate automation"}
                  </button>
                </form>
              </div>
              <ol className="relative space-y-4 border-l-2 border-indigo-200 pl-6">
                {mine.map((step) => (
                  <li key={step.id} className="relative">
                    <span className="absolute -left-[33px] top-4 grid h-4 w-4 place-items-center rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
                    <form action={saveStep} className="card space-y-3 p-4">
                      <input type="hidden" name="id" value={step.id} />
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">{delayLabel(step.delayHours)}</span>
                        <label className="ml-auto flex items-center gap-1 text-xs text-slate-500">Delay (hours)
                          <input name="delayHours" type="number" min={0} defaultValue={step.delayHours} className="w-20 rounded-lg border border-slate-200 px-2 py-1" />
                        </label>
                      </div>
                      <input name="subject" defaultValue={step.subject} className="input py-2 font-semibold" />
                      <textarea name="body" defaultValue={step.body} rows={4} className="input py-2 text-sm" />
                      <div className="flex justify-end gap-2">
                        <button formAction={deleteStep} className="rounded-lg px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50">Delete</button>
                        <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">Save</button>
                      </div>
                    </form>
                  </li>
                ))}
                <li className="relative">
                  <span className="absolute -left-[33px] top-4 grid h-4 w-4 place-items-center rounded-full bg-white ring-2 ring-indigo-300" />
                  <details className="card p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-indigo-600">+ Add email to sequence</summary>
                    <form action={saveStep} className="mt-3 space-y-3">
                      <input type="hidden" name="sequenceId" value={s.id} />
                      <input name="delayHours" type="number" min={0} defaultValue={24} className="input py-2" placeholder="Delay in hours" />
                      <input name="subject" required placeholder="Subject line" className="input py-2" />
                      <textarea name="body" required rows={3} placeholder="Hi {{name}}, …" className="input py-2 text-sm" />
                      <button className="btn-primary px-4 py-2 text-sm">Add email</button>
                    </form>
                  </details>
                </li>
              </ol>
            </div>
          </details>
        );
      })}
    </div>
  );
}

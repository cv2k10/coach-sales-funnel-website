import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, contacts } from "@/db/schema";
import { setBookingStatus } from "../../actions";

const S: Record<string, string> = {
  booked: "bg-sky-100 text-sky-800",
  completed: "bg-slate-100 text-slate-700",
  won: "bg-emerald-100 text-emerald-800",
  no_show: "bg-rose-100 text-rose-800",
};

export default async function BookingsPage() {
  const rows = await db
    .select({ b: bookings, c: contacts })
    .from(bookings)
    .leftJoin(contacts, eq(contacts.id, bookings.contactId))
    .orderBy(desc(bookings.createdAt));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Call Bookings</h1>
        <p className="text-sm text-slate-500">Strategy call applications from your high-ticket funnel.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.length === 0 && <div className="card p-10 text-center text-slate-500 md:col-span-2 xl:col-span-3">No calls booked yet.</div>}
        {rows.map(({ b, c }) => (
          <div key={b.id} className="card p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <b>{c?.name}</b>
                <p className="text-sm text-slate-500">{c?.email}{c?.phone ? ` · ${c.phone}` : ""}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${S[b.status] ?? S.booked}`}>{b.status.replace("_", " ")}</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-indigo-700">📅 {b.slot}</p>
            {b.revenue && <p className="mt-1 text-sm text-slate-600">Revenue: {b.revenue}</p>}
            {b.goal && <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm italic text-slate-600">&ldquo;{b.goal}&rdquo;</p>}
            <form action={setBookingStatus} className="mt-4 flex flex-wrap gap-1.5">
              <input type="hidden" name="id" value={b.id} />
              {["completed", "won", "no_show"].map((s) => (
                <button key={s} name="status" value={s} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium capitalize hover:bg-slate-50">{s.replace("_", " ")}</button>
              ))}
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

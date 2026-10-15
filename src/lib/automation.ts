import "server-only";
import { db } from "@/db";
import { contacts, coupons, emailQueue, events, sequenceSteps, sequences } from "@/db/schema";
import { and, eq, lte, sql } from "drizzle-orm";

export const TRIGGERS: Record<string, string> = {
  lead_magnet_optin: "Free guide downloaded",
  webinar_registered: "Webinar registration",
  checkout_abandoned: "Checkout started (abandoned cart)",
  purchase: "Any purchase completed",
  tripwire_purchase: "Tripwire ($7) purchased",
  upsell_declined: "Upsell & downsell declined",
  call_booked: "Strategy call booked",
};

const SEED: { trigger: string; name: string; description: string; steps: [number, string, string][] }[] = [
  {
    trigger: "lead_magnet_optin",
    name: "Lead Magnet Nurture",
    description: "Delivers the free guide then nurtures the lead toward the Accelerator over 7 days.",
    steps: [
      [0, "Your Client Attraction Blueprint is here 🎁", "Hi {{name}},\n\nThanks for grabbing the 5-Step Client Attraction Blueprint! Download it here: {{site}}/free-guide/download\n\nTomorrow I'll share the #1 mistake that keeps coaches stuck.\n\n— Maya"],
      [24, "The #1 mistake keeping coaches broke", "Hi {{name}},\n\nMost coaches try to help everyone. The fix? Radical niche clarity. Here's how I found mine…\n\n— Maya"],
      [72, "How Jessica booked her calendar in 9 weeks", "Hi {{name}},\n\nJessica went from 2 clients to fully booked. Here's her exact story…\n\n— Maya"],
      [120, "Doors are open: Online Coach Accelerator", "Hi {{name}},\n\nThe Accelerator is open — and for the next 48h you get the Template Vault free. Join here: {{site}}/courses/coach-accelerator\n\n— Maya"],
      [168, "Last call ⏰", "Hi {{name}},\n\nFinal reminder — the bonus disappears at midnight.\n\n— Maya"],
    ],
  },
  {
    trigger: "webinar_registered",
    name: "Webinar Reminders",
    description: "Confirmation, reminders and post-webinar replay + offer.",
    steps: [
      [0, "You're registered! 🎉 Masterclass details inside", "Hi {{name}},\n\nYou're in for the free masterclass 'How to Sign High-Ticket Clients Without Paid Ads'. Add it to your calendar!\n\n— Maya"],
      [23, "Starting in 1 hour", "Hi {{name}}, we go live in 60 minutes. Grab a notebook!"],
      [48, "Replay available (24h only)", "Hi {{name}},\n\nMissed it? Watch the replay before it's gone, plus the special offer: {{site}}/courses/coach-accelerator"],
    ],
  },
  {
    trigger: "checkout_abandoned",
    name: "Abandoned Cart Recovery",
    description: "Recovers checkouts that were started but not completed. Auto-cancels on purchase.",
    steps: [
      [1, "Did something go wrong?", "Hi {{name}},\n\nI noticed you didn't finish enrolling. Your spot is saved: {{site}}/checkout/{{product}}\n\n— Maya"],
      [24, "Here's 10% off to help you decide", "Hi {{name}},\n\nUse code COMEBACK10 for 10% off — valid for 48 hours: {{site}}/checkout/{{product}}"],
      [72, "Final reminder: your discount expires today", "Hi {{name}}, COMEBACK10 expires tonight."],
    ],
  },
  {
    trigger: "purchase",
    name: "Customer Onboarding",
    description: "Welcomes new customers, delivers access, and drives course completion.",
    steps: [
      [0, "Welcome aboard! Your login details 🚀", "Hi {{name}},\n\nYour purchase is confirmed. Access your courses anytime: {{site}}/members\n\n— Maya"],
      [48, "Quick win: complete Module 1 today", "Hi {{name}}, students who finish Module 1 in the first 3 days are 4x more likely to get results."],
      [168, "How's it going? (reply to this email)", "Hi {{name}}, one week in! Hit reply and tell me your biggest win so far."],
    ],
  },
  {
    trigger: "tripwire_purchase",
    name: "Tripwire Ascension",
    description: "Ascends $7 buyers to the flagship program.",
    steps: [
      [72, "Ready for the full system?", "Hi {{name}},\n\nLoved the mini-course? As a customer you can apply your $7 toward the Accelerator: {{site}}/courses/coach-accelerator"],
    ],
  },
  {
    trigger: "upsell_declined",
    name: "Upsell Follow-up",
    description: "Re-offers coaching to buyers who declined the upsell.",
    steps: [
      [96, "Want personal help implementing?", "Hi {{name}},\n\nIf you'd like hands-on support, book a free strategy call: {{site}}/book-call"],
    ],
  },
  {
    trigger: "call_booked",
    name: "Strategy Call Reminders",
    description: "Confirms the call and reduces no-shows.",
    steps: [
      [0, "Your strategy call is confirmed ✅", "Hi {{name}},\n\nYour call is booked for {{slot}}. Please come with your goals ready!"],
      [20, "Prep for our call (2 min video)", "Hi {{name}}, watch this short prep video so we can make the most of our time."],
    ],
  },
];

let seeded = false;
export async function ensureSeed() {
  if (seeded) return;
  const existing = await db.select({ c: sql<number>`count(*)::int` }).from(sequences);
  if ((existing[0]?.c ?? 0) === 0) {
    for (const s of SEED) {
      const [row] = await db
        .insert(sequences)
        .values({ name: s.name, trigger: s.trigger, description: s.description })
        .onConflictDoNothing()
        .returning();
      if (!row) continue;
      await db.insert(sequenceSteps).values(
        s.steps.map(([delayHours, subject, body], i) => ({
          sequenceId: row.id,
          position: i,
          delayHours,
          subject,
          body,
        })),
      );
    }
  }
  await db
    .insert(coupons)
    .values([
      { code: "COMEBACK10", percentOff: 10 },
      { code: "LAUNCH20", percentOff: 20 },
    ])
    .onConflictDoNothing();
  seeded = true;
}

export async function upsertContact(input: {
  email: string;
  name?: string;
  phone?: string;
  source?: string;
  tags?: string[];
}) {
  const email = input.email.trim().toLowerCase();
  const [found] = await db.select().from(contacts).where(eq(contacts.email, email));
  if (found) {
    const tags = Array.from(new Set([...(found.tags ?? []), ...(input.tags ?? [])]));
    const [updated] = await db
      .update(contacts)
      .set({
        tags,
        name: input.name?.trim() || found.name,
        phone: input.phone?.trim() || found.phone,
      })
      .where(eq(contacts.id, found.id))
      .returning();
    return updated;
  }
  const [created] = await db
    .insert(contacts)
    .values({
      email,
      name: input.name?.trim() ?? "",
      phone: input.phone?.trim() || null,
      source: input.source ?? "website",
      tags: input.tags ?? [],
    })
    .returning();
  return created;
}

export async function addTags(contactId: number, tags: string[], stage?: string) {
  const [c] = await db.select().from(contacts).where(eq(contacts.id, contactId));
  if (!c) return;
  const merged = Array.from(new Set([...(c.tags ?? []), ...tags]));
  const rank: Record<string, number> = { lead: 0, customer: 1, vip: 2 };
  const newStage = stage && rank[stage] > rank[c.stage] ? stage : c.stage;
  await db.update(contacts).set({ tags: merged, stage: newStage }).where(eq(contacts.id, contactId));
}

export async function track(type: string, opts: { contactId?: number | null; path?: string; meta?: Record<string, unknown> } = {}) {
  await db.insert(events).values({
    type,
    contactId: opts.contactId ?? null,
    path: opts.path ?? null,
    meta: opts.meta ?? {},
  });
}

/** Fire an automation trigger: schedules every step of the matching active sequence. */
export async function fireTrigger(
  trigger: string,
  contactId: number,
  vars: Record<string, string> = {},
  orderId?: number,
) {
  await ensureSeed();
  const [seq] = await db.select().from(sequences).where(eq(sequences.trigger, trigger));
  if (!seq || !seq.active) return;
  const [contact] = await db.select().from(contacts).where(eq(contacts.id, contactId));
  if (!contact) return;
  const steps = await db
    .select()
    .from(sequenceSteps)
    .where(eq(sequenceSteps.sequenceId, seq.id))
    .orderBy(sequenceSteps.position);
  if (!steps.length) return;
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const all: Record<string, string> = { name: contact.name || "there", site, ...vars };
  const fill = (t: string) => t.replace(/\{\{(\w+)\}\}/g, (_, k) => all[k] ?? "");
  const now = Date.now();
  await db.insert(emailQueue).values(
    steps.map((s) => ({
      contactId,
      sequenceId: seq.id,
      stepId: s.id,
      orderId: orderId ?? null,
      subject: fill(s.subject),
      body: fill(s.body),
      sendAt: new Date(now + s.delayHours * 3600_000),
    })),
  );
  await track("automation_triggered", { contactId, meta: { trigger, sequence: seq.name } });
  await processQueue();
}

export async function cancelOrderEmails(orderId: number) {
  await db
    .update(emailQueue)
    .set({ status: "cancelled" })
    .where(and(eq(emailQueue.orderId, orderId), eq(emailQueue.status, "scheduled")));
}

/**
 * Sends every scheduled email whose time has come.
 * Plug an email provider (Resend, SendGrid, SMTP...) in `deliver` to send for real.
 */
export async function processQueue() {
  const due = await db
    .select()
    .from(emailQueue)
    .where(and(eq(emailQueue.status, "scheduled"), lte(emailQueue.sendAt, new Date())));
  for (const e of due) {
    await db.update(emailQueue).set({ status: "sent", sentAt: new Date() }).where(eq(emailQueue.id, e.id));
  }
  return due.length;
}

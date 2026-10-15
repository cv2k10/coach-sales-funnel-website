import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default(""),
  phone: text("phone"),
  source: text("source").notNull().default("website"),
  stage: text("stage").notNull().default("lead"), // lead | customer | vip
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type OrderItem = {
  sku: string;
  name: string;
  price: number; // cents
  kind: "main" | "bump" | "upsell" | "downsell";
};

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull(),
  productSku: text("product_sku").notNull(),
  status: text("status").notNull().default("pending"), // pending | paid | refunded
  items: jsonb("items").$type<OrderItem[]>().notNull().default([]),
  amount: integer("amount").notNull().default(0),
  couponCode: text("coupon_code"),
  paymentPlan: text("payment_plan").notNull().default("full"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  paidAt: timestamp("paid_at"),
});

export const sequences = pgTable("sequences", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  trigger: text("trigger").notNull().unique(),
  description: text("description").notNull().default(""),
  active: boolean("active").notNull().default(true),
});

export const sequenceSteps = pgTable("sequence_steps", {
  id: serial("id").primaryKey(),
  sequenceId: integer("sequence_id").notNull(),
  position: integer("position").notNull().default(0),
  delayHours: integer("delay_hours").notNull().default(0),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
});

export const emailQueue = pgTable("email_queue", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull(),
  sequenceId: integer("sequence_id").notNull(),
  stepId: integer("step_id").notNull(),
  orderId: integer("order_id"),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  sendAt: timestamp("send_at").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled | sent | cancelled
  sentAt: timestamp("sent_at"),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id"),
  type: text("type").notNull(),
  path: text("path"),
  meta: jsonb("meta").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const coupons = pgTable("coupons", {
  code: text("code").primaryKey(),
  percentOff: integer("percent_off").notNull(),
  active: boolean("active").notNull().default(true),
  uses: integer("uses").notNull().default(0),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull(),
  slot: text("slot").notNull(),
  revenue: text("revenue").notNull().default(""),
  goal: text("goal").notNull().default(""),
  status: text("status").notNull().default("booked"), // booked | completed | no_show | won
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

import { bigint, bigserial, boolean, date, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("app_role", ["admin", "user", "future"]);
export const batchStatusEnum = pgEnum("batch_status", ["draft", "published"]);
export const cardStatusEnum = pgEnum("card_status", ["pending", "approved", "rejected"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  subject: text("subject").notNull().unique(),
  email: text("email"),
  displayName: text("display_name"),
  role: roleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const batches = pgTable("card_batches", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  status: batchStatusEnum("status").notNull().default("draft"),
  generatedAt: timestamp("generated_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const cards = pgTable("cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  batchId: uuid("batch_id").notNull().references(() => batches.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  zh: text("zh").notNull(),
  en: text("en").notNull(),
  content: jsonb("content").$type<CardContent>(),
  imageUrl: text("image_url"),
  imagePrompt: text("image_prompt"),
  status: cardStatusEnum("status").notNull().default("pending"),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("cards_batch_position_uq").on(t.batchId, t.position), index("cards_approved_idx").on(t.status)]);

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedBy: uuid("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const dailyUsage = pgTable("daily_usage", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  day: date("day").notNull(),
  actorKey: text("actor_key").notNull(),
  authenticated: boolean("authenticated").notNull(),
  generations: integer("generations").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("daily_usage_actor_day_uq").on(t.day, t.actorKey)]);

export const budgetUsage = pgTable("budget_usage", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  kind: text("kind").notNull(),
  units: bigint("units", { mode: "number" }).notNull(),
  actorKey: text("actor_key").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const collectionItems = pgTable("collection_items", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  cardId: uuid("card_id").notNull().references(() => cards.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("collection_user_card_uq").on(t.userId, t.cardId)]);

export type AppRole = "admin" | "user" | "future";
export type CardContent = {
  name: { "zh-TW": string; en: string };
  epithet: { "zh-TW": string; en: string };
  keywords: { "zh-TW": string[]; en: string[] };
  blessing: { "zh-TW": string; en: string };
  story: { "zh-TW": string; en: string };
  palette: "vermilion" | "jade" | "gold" | "indigo";
};

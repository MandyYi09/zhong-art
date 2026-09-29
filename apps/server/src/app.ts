import crypto from "node:crypto";
import cookieParser from "cookie-parser";
import cors from "cors";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import OpenAI from "openai";
import { z } from "zod";
import { createAuth, requireAdmin, requireAuth } from "./auth.js";
import type { Config } from "./config.js";
import type { Database } from "./db/index.js";
import { generatePersonalCard } from "./ai.js";
import { batches, cards, collectionItems, settings, users } from "./db/schema.js";
import { consumeBudget, consumeGeneration, LimitError } from "./usage.js";
import { cardInputSchema, generateBatchSchema, validateBody } from "./validation.js";

const idSchema = z.string().uuid();
const batchCreateSchema = z.object({ title: z.string().trim().min(1).max(200) });
const reviewSchema = cardInputSchema.partial().extend({ status: z.enum(["approved", "rejected"]) });
const settingSchema = z.object({ value: z.unknown() });
const imageSchema = z.object({ prompt: z.string().trim().min(1).max(2000).optional() });
const createSchema = z.object({ feeling: z.string().trim().min(1).max(180), wish: z.string().trim().min(1).max(120), style: z.enum(["classic", "lively", "quiet"]), locale: z.enum(["zh-TW", "en"]).default("zh-TW") });

function publicCard(row: typeof cards.$inferSelect) {
  const content = row.content ?? { name: { "zh-TW": row.zh, en: row.en }, epithet: { "zh-TW": row.zh, en: row.en }, keywords: { "zh-TW": [], en: [] }, blessing: { "zh-TW": row.zh, en: row.en }, story: { "zh-TW": row.zh, en: row.en }, palette: "vermilion" as const };
  return { id: row.id, number: row.position + 1, ...content, image: row.imageUrl ?? undefined, status: row.status };
}

export function createApp(db: Database, config: Config, authMiddleware: RequestHandler = createAuth(config)) {
  const app = express();
  if (config.TRUST_PROXY) app.set("trust proxy", 1);
  app.use(cors({ origin: config.WEB_ORIGIN.split(",").map((s) => s.trim()), credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(authMiddleware);

  app.use(async (req, res, next) => {
    try {
      if (req.auth) {
        const role = req.auth.roles.includes("admin") ? "admin" : req.auth.roles.includes("future") ? "future" : "user";
        const [user] = await db.insert(users).values({ subject: req.auth.subject, email: req.auth.email, displayName: req.auth.displayName, role })
          .onConflictDoUpdate({ target: users.subject, set: { email: req.auth.email, displayName: req.auth.displayName, role, updatedAt: new Date() } }).returning();
        req.auth.userId = user!.id;
        req.actorKey = `user:${req.auth.subject}`;
      } else {
        let visitor = req.cookies.za_visitor as string | undefined;
        if (!visitor || !/^[a-f0-9]{32}$/.test(visitor)) {
          visitor = crypto.randomBytes(16).toString("hex");
          res.cookie("za_visitor", visitor, { httpOnly: true, sameSite: "lax", secure: config.NODE_ENV === "production", maxAge: 31536000000 });
        }
        req.actorKey = `anon:${visitor}`;
      }
      next();
    } catch (error) { next(error); }
  });

  app.get("/health", async (_req, res, next) => { try { await db.execute(sql`select 1`); res.json({ status: "ok", aiProvider: config.AI_PROVIDER === "openai" && config.OPENAI_API_KEY ? "openai" : "demo" }); } catch (e) { next(e); } });
  app.get("/api/me", requireAuth, (req, res) => res.json(req.auth));

  app.post("/api/batches", requireAdmin, validateBody(batchCreateSchema), async (req, res, next) => {
    try { const [row] = await db.insert(batches).values({ title: req.body.title, createdBy: req.auth!.userId! }).returning(); res.status(201).json(row); } catch (e) { next(e); }
  });
  app.get("/api/batches", requireAdmin, async (_req, res, next) => { try { res.json(await db.select().from(batches).orderBy(asc(batches.createdAt))); } catch (e) { next(e); } });
  app.get("/api/batches/:id/cards", requireAdmin, async (req, res, next) => {
    try { const id = idSchema.parse(req.params.id); res.json(await db.select().from(cards).where(eq(cards.batchId, id)).orderBy(asc(cards.position))); } catch (e) { next(e); }
  });
  app.post("/api/batches/:id/generate", requireAdmin, validateBody(generateBatchSchema), async (req, res, next) => {
    try {
      const id = idSchema.parse(req.params.id);
      const result = await db.transaction(async (tx) => {
        const updated = await tx.update(batches).set({ generatedAt: new Date() }).where(and(eq(batches.id, id), sql`${batches.generatedAt} is null`)).returning();
        if (!updated.length) return null;
        return tx.insert(cards).values(req.body.cards.map((c: z.infer<typeof cardInputSchema>, position: number) => ({ ...c, batchId: id, position }))).returning();
      });
      if (!result) return res.status(409).json({ error: "batch_already_generated_or_missing" });
      res.status(201).json(result);
    } catch (e) { next(e); }
  });
  app.patch("/api/cards/:id/review", requireAdmin, validateBody(reviewSchema), async (req, res, next) => {
    try { const id = idSchema.parse(req.params.id); const [row] = await db.update(cards).set({ ...req.body, reviewedBy: req.auth!.userId, reviewedAt: new Date(), updatedAt: new Date() }).where(eq(cards.id, id)).returning(); if (!row) return res.status(404).json({ error: "not_found" }); res.json(row); } catch (e) { next(e); }
  });
  app.post("/api/batches/:id/publish", requireAdmin, async (req, res, next) => {
    try {
      const id = idSchema.parse(req.params.id);
      const result = await db.transaction(async (tx) => {
        const counts = await tx.execute(sql`select count(*)::int total, count(*) filter (where status = 'approved')::int approved from cards where batch_id = ${id}`);
        const count = counts.rows[0] as { total: number; approved: number } | undefined;
        if (!count || count.total !== 50 || count.approved !== 50) return null;
        return tx.update(batches).set({ status: "published", publishedAt: new Date() }).where(and(eq(batches.id, id), eq(batches.status, "draft"))).returning();
      });
      if (!result?.length) return res.status(409).json({ error: "batch_requires_50_approved_cards_or_is_published" });
      res.json(result[0]);
    } catch (e) { next(e); }
  });

  app.post("/api/cards/draw", async (req, res, next) => {
    try {
      const result = await db.execute(sql`select c.* from cards c join card_batches b on b.id = c.batch_id where c.status = 'approved' and b.status = 'published' order by random() limit 1`);
      if (!result.rows.length) return res.status(404).json({ error: "no_approved_cards" });
      res.json({ card: publicCard(result.rows[0] as typeof cards.$inferSelect), source: "curated", aiCostUnits: 0 });
    } catch (e) { next(e); }
  });

  app.get("/api/cards", async (_req, res, next) => { try {
    const rows = await db.select({ card: cards }).from(cards).innerJoin(batches, eq(cards.batchId, batches.id)).where(and(eq(cards.status, "approved"), eq(batches.status, "published"))).orderBy(asc(cards.position));
    res.json(rows.map(({ card }) => publicCard(card)));
  } catch (e) { next(e); } });
  app.get("/api/cards/:id", async (req, res, next) => { try {
    const id = idSchema.parse(req.params.id); const [row] = await db.select({ card: cards }).from(cards).innerJoin(batches, eq(cards.batchId, batches.id)).where(and(eq(cards.id, id), eq(cards.status, "approved"), eq(batches.status, "published")));
    if (!row) return res.status(404).json({ error: "not_found" }); res.json(publicCard(row.card));
  } catch (e) { next(e); } });
  app.get("/api/collection", requireAuth, async (req, res, next) => { try {
    const rows = await db.select({ card: cards }).from(collectionItems).innerJoin(cards, eq(collectionItems.cardId, cards.id)).innerJoin(batches, eq(cards.batchId, batches.id)).where(and(eq(collectionItems.userId, req.auth!.userId!), eq(cards.status, "approved"), eq(batches.status, "published"))).orderBy(desc(collectionItems.createdAt));
    res.json(rows.map(({ card }) => publicCard(card)));
  } catch (e) { next(e); } });
  app.put("/api/collection/:cardId", requireAuth, async (req, res, next) => { try {
    const cardId = idSchema.parse(req.params.cardId); const [eligible] = await db.select({ id: cards.id }).from(cards).innerJoin(batches, eq(cards.batchId, batches.id)).where(and(eq(cards.id, cardId), eq(cards.status, "approved"), eq(batches.status, "published")));
    if (!eligible) return res.status(404).json({ error: "not_found" });
    await db.insert(collectionItems).values({ userId: req.auth!.userId!, cardId }).onConflictDoNothing(); res.status(204).end();
  } catch (e) { next(e); } });
  app.post("/api/create", validateBody(createSchema), async (req, res, next) => { try {
    const usage = await consumeGeneration(db, req.actorKey!, !!req.auth);
    const result = await generatePersonalCard(config, req.body);
    res.status(201).json({ ...result, usage });
  } catch (e) { next(e); } });

  app.get("/api/settings", requireAdmin, async (_req, res, next) => { try {
    const rows = await db.select().from(settings); const usage = await db.execute(sql`select coalesce(sum(units), 0)::bigint used from budget_usage where created_at >= date_trunc('month', now())`);
    res.json({ values: Object.fromEntries(rows.map((row) => [row.key, row.value])), usedUnits: Number(usage.rows[0]?.used ?? 0), updatedAt: rows.reduce((latest, row) => row.updatedAt > latest ? row.updatedAt : latest, new Date(0)).toISOString() });
  } catch (e) { next(e); } });
  app.put("/api/settings/:key", requireAdmin, validateBody(settingSchema), async (req, res, next) => {
    try { const key = z.string().regex(/^[a-z][a-z0-9_]{0,63}$/).parse(req.params.key); const [row] = await db.insert(settings).values({ key, value: req.body.value, updatedBy: req.auth!.userId }).onConflictDoUpdate({ target: settings.key, set: { value: req.body.value, updatedBy: req.auth!.userId, updatedAt: new Date() } }).returning(); res.json(row); } catch (e) { next(e); }
  });
  app.get("/api/users", requireAdmin, async (_req, res, next) => { try { res.json(await db.select().from(users).orderBy(asc(users.createdAt))); } catch (e) { next(e); } });

  app.post("/api/cards/:id/image", requireAdmin, validateBody(imageSchema), async (req, res, next) => {
    try {
      if (!config.OPENAI_API_KEY) return res.status(503).json({ error: "image_generation_not_configured" });
      const id = idSchema.parse(req.params.id);
      const [card] = await db.select().from(cards).where(eq(cards.id, id));
      if (!card) return res.status(404).json({ error: "not_found" });
      const prompt = req.body.prompt ?? card.imagePrompt;
      if (!prompt) return res.status(400).json({ error: "image_prompt_required" });
      await consumeBudget(db, req.actorKey!, "image", 1);
      const result = await new OpenAI({ apiKey: config.OPENAI_API_KEY }).images.generate({ model: config.OPENAI_IMAGE_MODEL, prompt, size: "1024x1024" });
      const image = result.data?.[0];
      if (image?.url) await db.update(cards).set({ imageUrl: image.url, imagePrompt: prompt, updatedAt: new Date() }).where(eq(cards.id, id));
      res.json({ image, persisted: !!image?.url });
    } catch (e) { next(e); }
  });

  const errors: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof LimitError) return res.status(429).json({ error: error.code });
    if (error instanceof z.ZodError) return res.status(400).json({ error: "validation_error", issues: error.issues });
    console.error(error);
    res.status(500).json({ error: "internal_server_error" });
  };
  app.use(errors);
  return app;
}

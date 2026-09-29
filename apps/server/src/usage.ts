import { sql } from "drizzle-orm";
import type { Database } from "./db/index.js";

export class LimitError extends Error {
  constructor(public code: "daily_limit_reached" | "global_budget_exhausted") { super(code); }
}

export async function consumeGeneration(db: Database, actorKey: string, authenticated: boolean) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('zhong-art-global-budget'))`);
    const cutoffResult = await tx.execute(sql`select value from settings where key = 'budget_cutoff_enabled'`);
    const cutoffEnabled = cutoffResult.rows[0]?.value !== false;
    const settingResult = await tx.execute(sql`select value from settings where key = 'global_budget_units'`);
    const rawBudget = settingResult.rows[0]?.value;
    const budget = typeof rawBudget === "number" ? rawBudget : null;
    if (cutoffEnabled && budget !== null) {
      const usedResult = await tx.execute(sql`select coalesce(sum(units), 0)::bigint as used from budget_usage where created_at >= date_trunc('month', now())`);
      if (Number(usedResult.rows[0]?.used ?? 0) >= budget) throw new LimitError("global_budget_exhausted");
    }
    const limitKey = authenticated ? "authenticated_daily_quota" : "anonymous_daily_quota";
    const limitResult = await tx.execute(sql`select value from settings where key = ${limitKey}`);
    const configuredLimit = limitResult.rows[0]?.value;
    const dailyLimit = typeof configuredLimit === "number" ? configuredLimit : authenticated ? 3 : 1;
    const usageResult = await tx.execute(sql`
      insert into daily_usage (day, actor_key, authenticated, generations)
      values ((now() at time zone 'utc')::date, ${actorKey}, ${authenticated}, 1)
      on conflict (day, actor_key) do update set generations = daily_usage.generations + 1, updated_at = now()
      where daily_usage.generations < ${dailyLimit}
      returning generations
    `);
    if (!usageResult.rows.length) throw new LimitError("daily_limit_reached");
    await tx.execute(sql`insert into budget_usage (kind, units, actor_key) values ('generation', 1, ${actorKey})`);
    return { used: Number(usageResult.rows[0]?.generations), limit: dailyLimit };
  });
}

export async function consumeBudget(db: Database, actorKey: string, kind: string, units: number) {
  await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('zhong-art-global-budget'))`);
    const result = await tx.execute(sql`select value from settings where key = 'global_budget_units'`);
    const raw = result.rows[0]?.value;
    if (typeof raw === "number") {
      const used = await tx.execute(sql`select coalesce(sum(units), 0)::bigint as used from budget_usage where created_at >= date_trunc('month', now())`);
      if (Number(used.rows[0]?.used ?? 0) + units > raw) throw new LimitError("global_budget_exhausted");
    }
    await tx.execute(sql`insert into budget_usage (kind, units, actor_key) values (${kind}, ${units}, ${actorKey})`);
  });
}

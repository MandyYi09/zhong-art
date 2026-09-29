import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { Config } from "../config.js";
import * as schema from "./schema.js";

export function createDb(config: Config) {
  const pool = new Pool({ connectionString: config.DATABASE_URL });
  return { db: drizzle(pool, { schema }), pool };
}

export type Database = ReturnType<typeof createDb>["db"];

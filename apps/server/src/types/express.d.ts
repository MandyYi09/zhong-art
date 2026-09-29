import type { AppRole } from "../db/schema.js";

declare global {
  namespace Express {
    interface Request {
      auth?: { subject: string; roles: AppRole[]; email?: string; displayName?: string; userId?: string };
      actorKey?: string;
    }
  }
}

export {};

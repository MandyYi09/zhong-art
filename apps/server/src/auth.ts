import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Config } from "./config.js";
import type { AppRole } from "./db/schema.js";

const allowedRoles = new Set<AppRole>(["admin", "user", "future"]);

export function createAuth(config: Config) {
  const issuer = config.OIDC_ISSUER.replace(/\/$/, "");
  let jwksPromise: Promise<ReturnType<typeof createRemoteJWKSet>> | undefined;
  const getJwks = () => jwksPromise ??= (async () => {
    if (config.OIDC_JWKS_URI) return createRemoteJWKSet(new URL(config.OIDC_JWKS_URI));
    const response = await fetch(`${issuer}/.well-known/openid-configuration`);
    if (!response.ok) throw new Error(`OIDC discovery failed (${response.status})`);
    const metadata = await response.json() as { issuer?: string; jwks_uri?: string };
    if (metadata.issuer !== issuer || !metadata.jwks_uri) throw new Error("OIDC discovery metadata is invalid");
    return createRemoteJWKSet(new URL(metadata.jwks_uri));
  })();

  return async function auth(req: Request, res: Response, next: NextFunction) {
    const header = req.header("authorization");
    if (!header) return next();
    if (!header.startsWith("Bearer ")) return res.status(401).json({ error: "invalid_authorization_header" });
    try {
      const { payload } = await jwtVerify(header.slice(7), await getJwks(), {
        issuer,
        requiredClaims: ["sub"],
        ...(config.OIDC_AUDIENCE ? { audience: config.OIDC_AUDIENCE } : {}),
      });
      const rawRoles = (payload.realm_access as { roles?: unknown } | undefined)?.roles;
      const roles = (Array.isArray(rawRoles) ? rawRoles : []).filter((r): r is AppRole => typeof r === "string" && allowedRoles.has(r as AppRole));
      if (!roles.length) return res.status(403).json({ error: "realm_role_required" });
      req.auth = {
        subject: payload.sub!,
        roles,
        ...(typeof payload.email === "string" ? { email: payload.email } : {}),
        ...(typeof payload.name === "string" ? { displayName: payload.name } : {}),
      };
      next();
    } catch {
      res.status(401).json({ error: "invalid_token" });
    }
  };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) return res.status(401).json({ error: "authentication_required" });
  if (!req.auth.roles.some((r) => r === "admin" || r === "user" || r === "future")) {
    return res.status(403).json({ error: "realm_role_required" });
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) return res.status(401).json({ error: "authentication_required" });
  if (!req.auth.roles.includes("admin")) return res.status(403).json({ error: "admin_required" });
  next();
}

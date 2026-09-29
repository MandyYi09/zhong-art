import { z } from "zod";

const bool = z.enum(["true", "false"]).default("false").transform((v) => v === "true");

export const configSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z.string().min(1),
  WEB_ORIGIN: z.string().default("http://localhost:3000"),
  OIDC_ISSUER: z.string().url().default("http://localhost:8080/realms/zhong-art"),
  OIDC_AUDIENCE: z.string().min(1).optional(),
  OIDC_JWKS_URI: z.string().url().optional(),
  TRUST_PROXY: bool,
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_IMAGE_MODEL: z.string().default("gpt-image-1"),
  AI_PROVIDER: z.enum(["demo", "openai"]).default("demo"),
  OPENAI_TEXT_MODEL: z.string().default("gpt-4.1-mini"),
});

export type Config = z.infer<typeof configSchema>;
export const loadConfig = (env: NodeJS.ProcessEnv = process.env): Config => configSchema.parse(env);

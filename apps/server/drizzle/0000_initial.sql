CREATE TYPE "app_role" AS ENUM ('admin', 'user', 'future');
CREATE TYPE "batch_status" AS ENUM ('draft', 'published');
CREATE TYPE "card_status" AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "subject" text NOT NULL UNIQUE,
  "email" text, "display_name" text, "role" app_role NOT NULL DEFAULT 'user',
  "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE "card_batches" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "title" text NOT NULL,
  "created_by" uuid NOT NULL REFERENCES "users"("id"), "status" batch_status NOT NULL DEFAULT 'draft',
  "generated_at" timestamptz, "published_at" timestamptz, "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE "cards" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "batch_id" uuid NOT NULL REFERENCES "card_batches"("id") ON DELETE CASCADE,
  "position" integer NOT NULL, "zh" text NOT NULL, "en" text NOT NULL, "content" jsonb, "image_url" text, "image_prompt" text,
  "status" card_status NOT NULL DEFAULT 'pending', "reviewed_by" uuid REFERENCES "users"("id"), "reviewed_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "cards_batch_position_uq" ON "cards" ("batch_id", "position");
CREATE INDEX "cards_approved_idx" ON "cards" ("status");
CREATE TABLE "settings" (
  "key" text PRIMARY KEY, "value" jsonb NOT NULL, "updated_by" uuid REFERENCES "users"("id"),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE "daily_usage" (
  "id" bigserial PRIMARY KEY, "day" date NOT NULL, "actor_key" text NOT NULL, "authenticated" boolean NOT NULL,
  "generations" integer NOT NULL DEFAULT 0, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "daily_usage_actor_day_uq" ON "daily_usage" ("day", "actor_key");
CREATE TABLE "collection_items" (
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "card_id" uuid NOT NULL REFERENCES "cards"("id") ON DELETE CASCADE,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "collection_user_card_uq" ON "collection_items" ("user_id", "card_id");
CREATE TABLE "budget_usage" (
  "id" bigserial PRIMARY KEY, "kind" text NOT NULL, "units" bigint NOT NULL, "actor_key" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

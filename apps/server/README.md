# Zhong Art server

Express/PostgreSQL API for bilingual card curation and drawing.

## Local development

```sh
cp .env.example .env
docker compose up -d
npm install
npm run db:migrate
npm run dev
```

The Compose file only exposes a local PostgreSQL database. No external deployment configuration is included.

OIDC access tokens are verified against the issuer and its discovered JWKS. Tokens must contain at least one of `admin`, `user`, or `future` in `realm_access.roles`; curation, settings, image generation, and user listing require `admin`.

## Workflow and limits

Create a batch with `POST /api/batches`, then submit exactly 50 bilingual entries once to `POST /api/batches/:id/generate`. Review each at `PATCH /api/cards/:id/review`; publishing succeeds only when all 50 are approved. `POST /api/cards/draw` randomly selects from approved cards in published batches.

Anonymous visitors receive an HTTP-only durable visitor cookie and may draw once per UTC day. Authenticated subjects may draw three times. Both limits use atomic PostgreSQL upserts. Set the `global_budget_units` setting to a JSON number to stop draws and image generation once aggregate usage reaches that value. Each draw or image costs one unit. Omitting that setting means no global cutoff.

AI image generation at `POST /api/cards/:id/image` is disabled unless `OPENAI_API_KEY` is configured. URL results are persisted; base64 results are returned to the caller but deliberately not stored in PostgreSQL.

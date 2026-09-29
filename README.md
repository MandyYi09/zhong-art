# Zhong Art integrated stack

## Local start

Prerequisites: Node 20+, npm, and Docker. The development stack starts and
configures its own Keycloak instance.

```sh
npm install
npm run infra:up
npm run db:migrate
npm run db:seed
npm run dev
```

Open the public app at `http://localhost:3000`, admin at `http://localhost:3001`,
API health at `http://localhost:4000/health`, and Keycloak at
`http://localhost:8080`. Postgres uses port `5433`.

Development logins are `user` / `user` for the public app and `admin` / `admin`
for both the admin app and Keycloak Admin Console. These weak credentials are
for local development only.

Copy/update the per-app `.env.example` files for another environment. `WEB_ORIGIN` is a comma-separated allowlist. The browser apps use public Keycloak clients and Authorization Code + PKCE S256, so no browser client secret exists. The API verifies the exact issuer, signature, expiry, and `zhong-server` audience and reads `realm_access.roles`.

`AI_PROVIDER=demo` is the safe default. It never contacts a paid provider and returns a response explicitly marked `developmentFallback: true`. To enable OpenAI intentionally, set `AI_PROVIDER=openai` and provide `OPENAI_API_KEY` in the server secret environment; `OPENAI_TEXT_MODEL` and `OPENAI_IMAGE_MODEL` are configurable. No credential is checked in.

Quota and budget settings are database-backed under `anonymous_daily_quota` (default 1), `authenticated_daily_quota` (default 3), `global_budget_units` (default 100), and `budget_cutoff_enabled` (default true). Usage resets per UTC day; global budget usage is counted for the current calendar month.

## Validation

```sh
npm run typecheck
npm test
npm run build
npm run keycloak:validate
npm run smoke:integration
```

The checked-in realm JSON is a local-development import with deliberately weak
development users. Never import it into production; build a separate reviewed
realm with exact HTTPS callbacks and externally managed credentials.

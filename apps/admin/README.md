# Zhong Art Admin

Separate bilingual administration surface built with TanStack Start.

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local`. Local development defaults to a mock admin session. Set `VITE_AUTH_MODE=oidc` to use Keycloak. The Keycloak client must allow the app origin and `${origin}/auth/callback` as redirect URIs and provide an `admin` realm role in the access token.

Authorization is intentionally enforced in two places: route/UI guards for user experience and the exported `requireRole`/`hasPermission` helpers for server/API boundaries. Any future live data adapter must call those helpers server-side before returning or mutating admin data.

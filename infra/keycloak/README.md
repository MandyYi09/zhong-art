# Zhong Art Keycloak realm

`realm.json` is imported by the root Compose stack into the local Keycloak at
`http://localhost:8080`. It includes deliberately weak local accounts and must
never be imported into production.

## Included clients

| Client ID | Type | Intended use |
| --- | --- | --- |
| `zhong-public` | Public OIDC client | Public browser app using Authorization Code + PKCE (S256) |
| `zhong-admin` | Public OIDC client | Admin browser app using Authorization Code + PKCE (S256) |
| `zhong-server` | Confidential OIDC client | API audience and optional client-credentials/service-account use |

Implicit flow and password/direct-access grants are disabled for every client.
The two browser clients use exact callback, origin, and post-logout values;
wildcards are intentionally absent. Checked-in localhost HTTP entries support
local development (OAuth's loopback exception). The reserved `.invalid` HTTPS
values are inert placeholders, not production configuration.

## Roles and groups

The realm roles are `user` and `admin`. Assign people through the `users` and
`administrators` groups instead of mapping roles individually. Administrators
receive both roles, so application code can treat `user` as baseline access.
This group-to-role pattern makes adding future roles and changing mappings
without editing each account straightforward.

These are application roles, not Keycloak management roles. They do not grant
access to the Keycloak Admin Console. Both applications must enforce their own
authorization checks; hiding admin UI is not an authorization boundary.

## Start locally

Run `npm run infra:up` from the repository root. The discovery document is at
`http://localhost:8080/realms/zhong-art/.well-known/openid-configuration`.

- Public app: `user` / `user`
- Admin app: `admin` / `admin`
- Keycloak Admin Console: `admin` / `admin`

Keycloak skips an import if that realm already exists. Remove an old local
Keycloak container before restarting if its imported configuration is stale.

## Application configuration

Use `.env.example` as the variable-name contract. Browser applications need the
local base URL, realm, and their own public client ID; a public client has no secret.
The server should validate at least token signature, issuer, expiry/not-before,
and the `zhong-server` audience. Read authorization from the realm roles claim
(`realm_access.roles`) and require `admin` for administrative server routes.

Do not derive redirect URIs from untrusted request headers. Configure fixed,
environment-specific HTTPS values in both Keycloak and each application for any
non-local deployment.

## Local validation

Run:

```sh
./infra/keycloak/validate.sh
```

The validator checks JSON syntax and the security-sensitive invariants this
repository depends on.

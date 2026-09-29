#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
realm_file="$script_dir/realm.json"

python3 - "$realm_file" <<'PY'
import json
import pathlib
import sys
from urllib.parse import urlparse

path = pathlib.Path(sys.argv[1])
realm = json.loads(path.read_text(encoding="utf-8"))
errors = []

def check(condition, message):
    if not condition:
        errors.append(message)

check(realm.get("realm") == "zhong-art", "realm must be zhong-art")
check(realm.get("enabled") is True, "realm must be enabled")
check(realm.get("sslRequired") == "external", "external requests must require TLS")
check(realm.get("attributes", {}).get("frontendUrl") == "http://localhost:8080",
      "realm frontend URL must target the local Keycloak instance")

role_names = {role.get("name") for role in realm.get("roles", {}).get("realm", [])}
check({"admin", "user"}.issubset(role_names), "admin and user realm roles are required")

clients = {client.get("clientId"): client for client in realm.get("clients", [])}
check(set(clients) == {"zhong-public", "zhong-admin", "zhong-server"},
      "exactly the public, admin, and server clients are required")

for client_id in ("zhong-public", "zhong-admin"):
    client = clients.get(client_id, {})
    check(client.get("publicClient") is True, f"{client_id} must be public")
    check(client.get("standardFlowEnabled") is True, f"{client_id} must allow code flow")
    check(client.get("implicitFlowEnabled") is False, f"{client_id} must disable implicit flow")
    check(client.get("directAccessGrantsEnabled") is False,
          f"{client_id} must disable password grants")
    check(client.get("attributes", {}).get("pkce.code.challenge.method") == "S256",
          f"{client_id} must require PKCE S256")
    for field in ("redirectUris", "webOrigins"):
        for uri in client.get(field, []):
            parsed = urlparse(uri)
            local_dev = parsed.scheme == "http" and parsed.hostname == "localhost"
            check((parsed.scheme == "https" or local_dev) and bool(parsed.netloc),
                  f"{client_id} {field} entry must be HTTPS or localhost HTTP: {uri}")
            check("*" not in uri, f"{client_id} {field} must not contain wildcards: {uri}")
    logout_uris = client.get("attributes", {}).get("post.logout.redirect.uris", "").split("##")
    for uri in filter(None, logout_uris):
        parsed = urlparse(uri)
        local_dev = parsed.scheme == "http" and parsed.hostname == "localhost"
        check((parsed.scheme == "https" or local_dev) and bool(parsed.netloc),
              f"{client_id} logout URI must be HTTPS or localhost HTTP: {uri}")
        check("*" not in uri, f"{client_id} logout URI must not contain wildcards: {uri}")

server = clients.get("zhong-server", {})
check(server.get("publicClient") is False, "zhong-server must be confidential")
check(server.get("serviceAccountsEnabled") is True, "zhong-server service account must be enabled")
check(server.get("standardFlowEnabled") is False, "zhong-server must disable browser login")
check(server.get("directAccessGrantsEnabled") is False, "zhong-server must disable password grants")
check(not server.get("redirectUris"), "zhong-server must not have redirect URIs")

def visit_keys(value):
    if isinstance(value, dict):
        for key, child in value.items():
            yield key.lower()
            yield from visit_keys(child)
    elif isinstance(value, list):
        for child in value:
            yield from visit_keys(child)

keys = set(visit_keys({key: value for key, value in realm.items() if key != "users"}))
for forbidden in ("password", "secret", "clientsecret", "client_secret", "smtpserver", "smtpuser"):
    check(forbidden not in keys, f"realm contains a forbidden non-development credential field: {forbidden}")

users = {user.get("username"): user for user in realm.get("users", [])}
check(set(users) == {"admin", "user"}, "local realm must contain the admin and user development accounts")
check(users.get("admin", {}).get("groups") == ["/administrators"], "local admin must belong to administrators")
check(users.get("user", {}).get("groups") == ["/users"], "local user must belong to users")

if errors:
    print("Keycloak realm validation failed:", file=sys.stderr)
    for error in errors:
        print(f"- {error}", file=sys.stderr)
    raise SystemExit(1)

print(f"Validated {path}: {len(clients)} clients, {len(role_names)} realm roles, 2 local development users")
PY

# Keycloak integration

The source-controlled local Keycloak realm and instructions live in
[`infra/keycloak`](../infra/keycloak/README.md). `docker compose up -d --wait`
starts Keycloak at `http://localhost:8080` and imports the development realm.

The import is for local development only and must not be used for a public
deployment.

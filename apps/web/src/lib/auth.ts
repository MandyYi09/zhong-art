import Keycloak from 'keycloak-js'

let client: Keycloak | null = null

export function getKeycloak() {
  if (!client) client = new Keycloak({ url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080', realm: import.meta.env.VITE_KEYCLOAK_REALM || 'zhong-art', clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'zhong-public' })
  return client
}

export function hasRealmRole(role: string) { return Boolean(client?.hasRealmRole(role)) }
let initialization: Promise<boolean> | null = null
export function initializeAuth() { return initialization ??= getKeycloak().init({ onLoad: 'check-sso', pkceMethod: 'S256', silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html` }) }

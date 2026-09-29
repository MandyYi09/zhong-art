import { AuthProvider as OidcProvider, useAuth as useOidcAuth } from 'react-oidc-context'
import { WebStorageStateStore, type User } from 'oidc-client-ts'
import { createContext, useContext, type ReactNode } from 'react'
import type { AdminSession, AppRole } from '@/contracts/admin'

type AuthState = { isLoading: boolean; isAuthenticated: boolean; session: AdminSession | null; accessToken?: string; signIn: () => void; signOut: () => void }
const AuthContext = createContext<AuthState | null>(null)

const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080'
const realm = import.meta.env.VITE_KEYCLOAK_REALM || 'zhong-art'
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'zhong-admin'

export const oidcConfig = {
  authority: `${keycloakUrl}/realms/${realm}`,
  client_id: clientId,
  redirect_uri: typeof window === 'undefined' ? '' : `${window.location.origin}/auth/callback`,
  post_logout_redirect_uri: typeof window === 'undefined' ? '' : `${window.location.origin}/`,
  response_type: 'code', scope: 'openid profile email', automaticSilentRenew: true,
  userStore: typeof window === 'undefined' ? undefined : new WebStorageStateStore({ store: window.sessionStorage }),
  onSigninCallback: () => window.history.replaceState({}, document.title, '/'),
}

export function extractRealmRoles(user?: User | null): AppRole[] {
  const raw = (user?.profile as { realm_access?: { roles?: string[] } } | undefined)?.realm_access?.roles ?? []
  return raw.filter((role): role is AppRole => ['admin', 'editor', 'support', 'viewer'].includes(role))
}

function OidcBridge({ children }: { children: ReactNode }) {
  const auth = useOidcAuth()
  const roles = extractRealmRoles(auth.user)
  const session = auth.user ? { subject: auth.user.profile.sub, name: String(auth.user.profile.name ?? auth.user.profile.preferred_username ?? ''), email: String(auth.user.profile.email ?? ''), roles } : null
  return <AuthContext.Provider value={{ isLoading: auth.isLoading, isAuthenticated: auth.isAuthenticated, session, accessToken: auth.user?.access_token, signIn: () => void auth.signinRedirect(), signOut: () => void auth.signoutRedirect() }}>{children}</AuthContext.Provider>
}

const mockSession: AdminSession = { subject: 'local-admin', name: '林映彤', email: 'yingtong@zhong.art', roles: ['admin'] }
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  if (import.meta.env.VITE_AUTH_MODE === 'mock') return <AuthContext.Provider value={{ isLoading: false, isAuthenticated: true, session: mockSession, accessToken: import.meta.env.VITE_DEV_ACCESS_TOKEN, signIn: () => {}, signOut: () => {} }}>{children}</AuthContext.Provider>
  return <OidcProvider {...oidcConfig}><OidcBridge>{children}</OidcBridge></OidcProvider>
}
export function useAdminAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAdminAuth must be used within AdminAuthProvider'); return value }

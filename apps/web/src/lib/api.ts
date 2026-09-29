import { getKeycloak } from './auth'
import type { GuardianCard } from './types'

const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')
export class ApiError extends Error { constructor(public code: string, public status: number) { super(code) } }
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const keycloak = getKeycloak(); if (keycloak.authenticated) await keycloak.updateToken(30)
  const response = await fetch(`${baseUrl}${path}`, { ...init, credentials: 'include', headers: { 'content-type': 'application/json', ...(keycloak.token ? { authorization: `Bearer ${keycloak.token}` } : {}), ...init?.headers } })
  if (!response.ok) { const body = await response.json().catch(() => ({})) as { error?: string }; throw new ApiError(body.error || `http_${response.status}`, response.status) }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>
}
export const api = {
  cards: () => request<GuardianCard[]>('/api/cards'), card: (id: string) => request<GuardianCard>(`/api/cards/${encodeURIComponent(id)}`),
  draw: () => request<{ card: GuardianCard; source: 'curated'; aiCostUnits: 0 }>('/api/cards/draw', { method: 'POST' }),
  collection: () => request<GuardianCard[]>('/api/collection'), saveCard: (id: string) => request<void>(`/api/collection/${encodeURIComponent(id)}`, { method: 'PUT' }),
  create: (data: { feeling: string; wish: string; style: string; locale: 'zh-TW' | 'en' }) => request<{ title: string; message: string; style: string; provider: 'demo'|'openai'; developmentFallback: boolean; usage: { used: number; limit: number } }>('/api/create', { method: 'POST', body: JSON.stringify(data) }),
}

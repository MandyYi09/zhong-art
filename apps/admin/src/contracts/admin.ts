export type SupportedLocale = 'zh-TW' | 'en'
export type AppRole = 'admin' | 'editor' | 'support' | 'viewer'
export type Permission =
  | 'deck:read' | 'deck:write' | 'deck:publish'
  | 'users:read' | 'users:write' | 'settings:read' | 'settings:write'
export type CardStatus = 'draft' | 'review' | 'published'

export interface LocalizedText { 'zh-TW': string; en: string }
export interface CuratedCard {
  id: string
  order: number
  title: LocalizedText
  prompt: LocalizedText
  status: CardStatus
  updatedAt: string
  updatedBy: string
}
export interface AdminUser {
  id: string
  name: string
  email: string
  roles: AppRole[]
  status: 'active' | 'invited' | 'suspended'
  lastActiveAt?: string
}
export interface QuotaSettings {
  anonymousDaily: number
  authenticatedDaily: number
  globalMonthlyBudgetUsd: number
  budgetCutoffEnabled: boolean
  usedThisMonthUsd: number
  updatedAt: string
}
export interface AdminSession {
  subject: string
  name: string
  email: string
  roles: AppRole[]
}

export const rolePermissions: Record<AppRole, readonly Permission[]> = {
  admin: ['deck:read', 'deck:write', 'deck:publish', 'users:read', 'users:write', 'settings:read', 'settings:write'],
  editor: ['deck:read', 'deck:write'],
  support: ['deck:read', 'users:read'],
  viewer: ['deck:read', 'users:read', 'settings:read'],
}

export function hasPermission(roles: readonly AppRole[], permission: Permission) {
  return roles.some((role) => rolePermissions[role]?.includes(permission))
}

export function requireRole(roles: readonly string[], required: AppRole = 'admin') {
  if (!roles.includes(required)) throw new Error('Forbidden')
}

import { describe, expect, it } from 'vitest'
import type { User } from 'oidc-client-ts'
import { extractRealmRoles } from './auth'

describe('Keycloak realm roles', () => {
  it('extracts supported roles and ignores unrelated roles', () => {
    const user = { profile: { realm_access: { roles: ['offline_access', 'admin', 'editor'] } } } as unknown as User
    expect(extractRealmRoles(user)).toEqual(['admin', 'editor'])
  })
  it('handles missing realm access claims', () => expect(extractRealmRoles(null)).toEqual([]))
})

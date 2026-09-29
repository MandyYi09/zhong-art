import { describe, expect, it } from 'vitest'
import { hasPermission, requireRole } from './admin'

describe('role authorization contracts', () => {
  it('allows admins to publish and change settings', () => {
    expect(hasPermission(['admin'], 'deck:publish')).toBe(true)
    expect(hasPermission(['admin'], 'settings:write')).toBe(true)
  })
  it('keeps future roles least-privileged', () => {
    expect(hasPermission(['editor'], 'deck:write')).toBe(true)
    expect(hasPermission(['editor'], 'deck:publish')).toBe(false)
    expect(hasPermission(['viewer'], 'users:write')).toBe(false)
  })
  it('requires the admin realm role', () => {
    expect(() => requireRole(['admin'])).not.toThrow()
    expect(() => requireRole(['editor'])).toThrow('Forbidden')
  })
})

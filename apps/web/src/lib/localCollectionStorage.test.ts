import { beforeEach, expect, it, vi } from 'vitest'
import { readStoredValue } from './localCollectionStorage'

let values: Map<string, string>
beforeEach(() => {
  values = new Map()
  vi.stubGlobal('localStorage', {
    get length() { return values.size },
    key: (index: number) => [...values.keys()][index] ?? null,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value) },
    removeItem: (key: string) => { values.delete(key) },
  })
})

it('merges discovered cards and deletes only the migrated key', () => {
  values.set('previous-discovered-v1', '["5683","5685"]')
  values.set('shuilu-discovered-v1', '["5685","5691"]')
  values.set('unrelated-setting', 'keep')
  expect(JSON.parse(readStoredValue('shuilu-discovered-v1', 'collection')!)).toEqual(['5683', '5685', '5691'])
  expect(values.has('previous-discovered-v1')).toBe(false)
  expect(values.get('unrelated-setting')).toBe('keep')
})

it('preserves notes and separate details while merging viewing paths', () => {
  values.set('previous-viewing-path-v1', JSON.stringify([{ paintingId: '5683', clue: 'head', note: 'old note' }, { paintingId: '5683', clue: 'robe' }]))
  values.set('shuilu-viewing-path-v1', JSON.stringify([{ paintingId: '5683', clue: 'head' }]))
  expect(JSON.parse(readStoredValue('shuilu-viewing-path-v1', 'path')!)).toEqual([{ paintingId: '5683', clue: 'head', note: 'old note' }, { paintingId: '5683', clue: 'robe' }])
})

it('keeps both differing notes and does not append them again on reload', () => {
  values.set('previous-note-5683', 'Earlier observation')
  values.set('shuilu-note-5683', 'New observation')
  expect(readStoredValue('shuilu-note-5683', 'note')).toBe('Earlier observation\n\nNew observation')
  expect(readStoredValue('shuilu-note-5683', 'note')).toBe('Earlier observation\n\nNew observation')
})

it('leaves the old data intact if the new storage write fails', () => {
  values.set('previous-discovered-v1', '["5683"]')
  vi.spyOn(localStorage, 'setItem').mockImplementation(() => { throw new Error('Storage full') })
  readStoredValue('shuilu-discovered-v1', 'collection')
  expect(values.get('previous-discovered-v1')).toBe('["5683"]')
})

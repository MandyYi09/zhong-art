import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addToViewingPath, readViewingPath, removeFromViewingPath, updateViewingPathNote } from './viewingPath'

describe('personal viewing path', () => {
  beforeEach(() => {
    const values = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value) },
    })
  })

  it('keeps an ordered pair through reloads and avoids duplicate details', () => {
    addToViewingPath({ paintingId: '5691', clue: 'head' }, { paintingId: '5693', clue: 'head' })
    addToViewingPath({ paintingId: '5691', clue: 'head' })
    expect(readViewingPath().map(entry => entry.paintingId)).toEqual(['5691', '5693'])
  })

  it('attaches a note to one detail and removes only that detail', () => {
    addToViewingPath({ paintingId: '5691', clue: 'head' }, { paintingId: '5691', clue: 'robe' })
    updateViewingPathNote('5691', 'head', 'The red curls caught my eye.')
    expect(readViewingPath().find(entry => entry.clue === 'head')?.note).toBe('The red curls caught my eye.')
    expect(readViewingPath().find(entry => entry.clue === 'robe')?.note).toBeUndefined()
    removeFromViewingPath({ paintingId: '5691', clue: 'head' })
    expect(readViewingPath().map(entry => entry.clue)).toEqual(['robe'])
  })
})

import { describe, expect, it } from 'vitest'
import { getDailyPainting, getPainting, paintings } from './paintings'

const dayInShanghai = (start: number, offset: number) => new Date(start + offset * 86_400_000)

describe('daily painting', () => {
  it('keeps the same card throughout a Shanghai calendar day and changes it tomorrow', () => {
    const morning = getDailyPainting(new Date('2026-10-08T00:00:00+08:00'))
    const evening = getDailyPainting(new Date('2026-10-08T23:59:59+08:00'))
    const tomorrow = getDailyPainting(new Date('2026-10-09T00:00:00+08:00'))
    expect(morning.id).toBe('5692')
    expect(evening.id).toBe(morning.id)
    expect(tomorrow.id).not.toBe(morning.id)
  })

  it('shows every painting once in any 21 consecutive days, including month boundaries', () => {
    const start = Date.UTC(2026, 8, 20)
    for (let offset = 0; offset < 90; offset++) {
      const ids = Array.from({ length: paintings.length }, (_, day) => getDailyPainting(dayInShanghai(start, offset + day)).id)
      expect(new Set(ids).size).toBe(paintings.length)
    }
  })
})

describe('physical and website edition mapping', () => {
  it('uses K for all twenty existing cards and E only for the new secret', () => {
    expect(paintings).toHaveLength(21)
    expect(paintings.filter(card => card.edition === 'hidden').map(card => card.id)).toEqual(['9549'])
    expect(paintings.filter(card => card.edition === 'regular')).toHaveLength(20)
    for (const card of paintings) expect(card.back).toContain(card.id === '9549' ? 'back-e.webp' : 'back-k.webp')
    expect(getPainting('5695')?.edition).toBe('regular')
    expect(getPainting('5702')?.edition).toBe('regular')
  })
})

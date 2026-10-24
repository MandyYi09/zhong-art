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

  it('shows every painting once in one complete cycle of consecutive days, including month boundaries', () => {
    const start = Date.UTC(2026, 8, 20)
    for (let offset = 0; offset < 90; offset++) {
      const ids = Array.from({ length: paintings.length }, (_, day) => getDailyPainting(dayInShanghai(start, offset + day)).id)
      expect(new Set(ids).size).toBe(paintings.length)
    }
  })
})

describe('physical and website edition mapping', () => {
  it('uses K for all nineteen unique regular cards and E for both secret cards', () => {
    expect(paintings).toHaveLength(21)
    expect(paintings.filter(card => card.edition === 'hidden').map(card => card.id)).toEqual(['9549', '438'])
    expect(paintings.filter(card => card.edition === 'regular')).toHaveLength(19)
    for (const card of paintings) expect(card.back).toContain(card.edition === 'hidden' ? 'back-e.webp' : 'back-k.webp')
    expect(getPainting('5695')?.edition).toBe('regular')
    expect(getPainting('5702')?.edition).toBe('regular')
  })
})

describe('duplicate painting compatibility', () => {
  it('lists the Marshal Shi painting once and resolves its old link to the retained work', () => {
    expect(paintings.filter(card => card.identity.name.zh === '神雷石元帅').map(card => card.id)).toEqual(['5697 2'])
    expect(getPainting('5699')).toBe(getPainting('5697 2'))
  })
})

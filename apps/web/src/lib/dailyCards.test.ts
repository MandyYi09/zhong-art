import { describe, expect, it } from 'vitest'
import { getDailyCard } from './dailyCards'
import { getDailyPainting } from './paintings'

describe('regular and hidden daily editions', () => {
  it('keeps the same edition throughout the Shanghai day', () => {
    const first = getDailyCard(new Date('2026-10-16T00:00:00+08:00'))
    const last = getDailyCard(new Date('2026-10-16T23:59:59+08:00'))
    expect(last.sku).toBe(first.sku)
    expect(last.painting.id).toBe(first.painting.id)
  })

  it('retains the source painting sequence and reaches all twenty regular and two hidden editions', () => {
    const editions = new Set<string>()
    const sources = new Set<string>()
    for (let day = 0; day < 80; day++) {
      const date = new Date(Date.UTC(2026, 9, 1 + day))
      const card = getDailyCard(date)
      expect(card.painting.id).toBe(getDailyPainting(date).id)
      expect(card.back).toContain(card.edition === 'hidden' ? 'back-e.webp' : 'back-k.webp')
      if (card.edition === 'hidden') expect(['5691', '5696 2']).toContain(card.painting.id)
      editions.add(card.sku)
      sources.add(card.painting.id)
    }
    expect(editions.size).toBe(22)
    expect(sources.size).toBe(20)
  })
})

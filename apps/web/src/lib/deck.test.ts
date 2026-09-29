import { describe, expect, it } from 'vitest'
import { curatedDeck, getCard, getDailyCard, publishedDeck } from './deck'

describe('curated guardian deck', () => {
  it('saves exactly 50 unique cards for review', () => {
    expect(curatedDeck).toHaveLength(50)
    expect(new Set(curatedDeck.map(card => card.id)).size).toBe(50)
  })
  it('publishes only approved cards', () => {
    expect(publishedDeck.length).toBeGreaterThan(0)
    expect(publishedDeck.every(card => card.status === 'approved')).toBe(true)
  })
  it('never resolves unapproved details', () => {
    const pending = curatedDeck.find(card => card.status === 'in_review')!
    expect(getCard(pending.id)).toBeUndefined()
  })
  it('draws deterministically from the published deck for a given day', () => {
    const day = new Date('2026-09-13T00:00:00Z')
    expect(getDailyCard(day)).toEqual(getDailyCard(day))
    expect(getDailyCard(day).status).toBe('approved')
  })
})

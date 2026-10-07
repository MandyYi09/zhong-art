import { describe, expect, it } from 'vitest'
import { getDetailComparisons } from './detailComparisons'
import { paintingClues, type ClueKey } from './paintingClues'
import { paintingFiles } from './paintings'

describe('visual detail comparisons', () => {
  it('offers two distinct paintings for every one of the 60 annotated details', () => {
    for (const id of paintingFiles) {
      for (const clue of ['head', 'hands', 'robe'] as ClueKey[]) {
        const matches = getDetailComparisons(id, clue)
        expect(matches).toHaveLength(2)
        expect(new Set(matches.map(item => item.painting.id)).size).toBe(2)
        expect(matches.every(item => item.painting.id !== id)).toBe(true)
        expect(matches.every(item => paintingClues[item.painting.id][clue].observed.zh.length > 0)).toBe(true)
      }
    }
  })
})

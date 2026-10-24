import { describe, it, expect } from 'vitest'
import regions from './detail-regions.json'
import { paintingFiles } from './paintings'
describe('detail regions', () => {
  it('provides three valid image-local crops for every card', () => {
    for (const id of paintingFiles) for (const clue of ['head', 'hands', 'robe'] as const) {
      const [x,y,w,h] = regions[id][clue]
      expect(x).toBeGreaterThanOrEqual(0); expect(y).toBeGreaterThanOrEqual(0)
      expect(w).toBeGreaterThan(0); expect(h).toBeGreaterThan(0)
      expect(x+w).toBeLessThanOrEqual(1); expect(y+h).toBeLessThanOrEqual(1)
    }
  })
})

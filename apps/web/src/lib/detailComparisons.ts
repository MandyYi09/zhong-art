import { paintingClues, type ClueKey, type Motif } from './paintingClues'
import { paintings, type Painting, type PaintingId } from './paintings'

export type DetailComparison = { painting: Painting; relation: 'echo' | 'contrast' }

const visualNeighbours: Partial<Record<Motif, Motif[]>> = {
  goldCrown: ['officialCap', 'ornateCap'],
  hornedCrown: ['plume', 'ornateCap'],
  officialCap: ['goldCrown', 'ornateCap'],
  ornateCap: ['officialCap', 'goldCrown'],
  plume: ['hornedCrown', 'ornateCap'],
  chain: ['longWeapon', 'blade'],
  longWeapon: ['blade', 'axe'],
  blade: ['longWeapon', 'axe'],
  gesture: ['axe', 'tray'],
  axe: ['blade', 'longWeapon'],
  roundObjects: ['wheel', 'tray'],
  wheel: ['roundObjects', 'tray'],
  tray: ['roundObjects', 'gesture'],
  armour: ['ribbons', 'robe'],
  robe: ['ribbons', 'armour'],
  ribbons: ['armour', 'robe'],
}

export function getDetailComparisons(paintingId: PaintingId, clue: ClueKey): DetailComparison[] {
  const current = paintingClues[paintingId][clue].motif
  const index = paintings.findIndex(painting => painting.id === paintingId)
  const candidates = paintings.filter(painting => painting.id !== paintingId)
    .sort((a, b) => Math.abs(a.index - (index + 1)) - Math.abs(b.index - (index + 1)))
  const same = candidates.find(painting => paintingClues[painting.id][clue].motif === current)
  const neighbour = candidates.find(painting => visualNeighbours[current]?.includes(paintingClues[painting.id][clue].motif))
  const echo = same || neighbour || candidates[0]
  const contrast = candidates.find(painting => painting.id !== echo.id && paintingClues[painting.id][clue].motif !== current && !visualNeighbours[current]?.includes(paintingClues[painting.id][clue].motif))
    || candidates.find(painting => painting.id !== echo.id)
  if (!contrast) return [{ painting: echo, relation: 'echo' }]
  return [
    { painting: echo, relation: 'echo' },
    { painting: contrast, relation: 'contrast' },
  ]
}

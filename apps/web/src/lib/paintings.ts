import { paintingBlessings } from './paintingBlessings'
import { readStoredValue } from './localCollectionStorage'
export const paintingFiles = [
  '5683', '5685', '5686', '5687', '5688', '5689', '5690', '5691', '5692', '5693',
  '5694', '5695', '5696 2', '5697 2', '5698', '5699', '5702', '5703', '5704', '5705',
] as const

export type PaintingId = (typeof paintingFiles)[number]

export interface Painting {
  id: PaintingId
  index: number
  original: string
  thumbnail: string
  character: string
  blessing: { zh: string; en: string }
}

export const paintings: Painting[] = paintingFiles.map((id, index) => ({
  id,
  index: index + 1,
  original: publicAsset(`paintings/original/${encodeURIComponent(id)}.webp`),
  thumbnail: publicAsset(`paintings/thumb/${encodeURIComponent(id)}.webp`),
  character: publicAsset(`paintings/character-web/${encodeURIComponent(id)}.webp`),
  blessing: paintingBlessings[id],
}))

export function getPainting(id: string) { return paintings.find((painting) => painting.id === id) }

// A fixed shuffled cycle gives every run of 20 consecutive days all 20 paintings.
// Keep the card already shown on 2026-10-08 stable as this rule is introduced.
const dailyOrder = (() => {
  const order = paintings.map((_, index) => index)
  let seed = 4
  for (let index = order.length - 1; index > 0; index--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    const other = seed % (index + 1)
    ;[order[index], order[other]] = [order[other], order[index]]
  }
  return order
})()

export function getDailyPainting(date = new Date()) {
  const localDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
  const [year, month, day] = localDay.split('-').map(Number)
  const calendarDay = Math.floor(Date.UTC(year, month - 1, day) / 86_400_000)
  const cyclePosition = ((calendarDay % dailyOrder.length) + dailyOrder.length) % dailyOrder.length
  return paintings[dailyOrder[cyclePosition]]
}

const discoveredKey = 'shuilu-discovered-v1'
export function getDiscovered(): string[] {
  try { return JSON.parse(readStoredValue(discoveredKey, 'collection') || '[]') as string[] } catch { return [] }
}
export function discover(id: string) {
  localStorage.setItem(discoveredKey, JSON.stringify([...new Set([...getDiscovered(), id])]))
}
import { publicAsset } from './assets'

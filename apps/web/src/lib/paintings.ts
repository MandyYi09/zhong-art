import { paintingBlessings } from './paintingBlessings'
import cardEditions from './card-editions.json'
import identities from './painting-identities.json'
import { readStoredValue } from './localCollectionStorage'
const sourcePaintingFiles = [
  '5683', '5685', '5686', '5687', '5688', '5689', '5690', '5691', '5692', '5693',
  '5694', '5695', '5696 2', '5697 2', '5698', '5699', '5702', '5703', '5704', '5705', '9549',
] as const

export type PaintingId = (typeof sourcePaintingFiles)[number]

// 5699 is another photograph of the same painting as 5697 2.
// Keep the source assets and accept old links, but display/draw the work only once.
export const paintingFiles: PaintingId[] = sourcePaintingFiles.filter(id => id !== '5699')

export interface Painting {
  id: PaintingId
  index: number
  original: string
  thumbnail: string
  character: string
  identity: (typeof identities)[PaintingId]
  edition: 'regular' | 'hidden'
  back: string
  blessing: { zh: string; en: string }
}

export const paintings: Painting[] = paintingFiles.map((id, index) => ({
  id,
  index: index + 1,
  identity: identities[id],
  original: publicAsset(`paintings/original/${encodeURIComponent(id)}.webp`),
  thumbnail: publicAsset(`paintings/thumb/${encodeURIComponent(id)}.webp`),
  character: publicAsset(`paintings/character-web/${encodeURIComponent(id)}.webp`),
  edition: cardEditions.find(card => card.paintingId === id)!.edition as Painting['edition'],
  back: publicAsset(`cards/back-${cardEditions.find(card => card.paintingId === id)!.back.toLowerCase()}.webp`),
  blessing: paintingBlessings[id],
}))

export function getPainting(id: string) { return paintings.find((painting) => painting.id === (id === '5699' ? '5697 2' : id)) }

// Each unique painting appears once per shuffled cycle, including the hidden card.
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
  // Anchor the expanded cycle to the previously shown card on 2026-10-08.
  const anchorDay = Math.floor(Date.UTC(2026, 9, 8) / 86_400_000)
  const anchorPosition = dailyOrder.indexOf(paintings.findIndex(painting => painting.id === '5692'))
  const cyclePosition = (((calendarDay - anchorDay + anchorPosition) % dailyOrder.length) + dailyOrder.length) % dailyOrder.length
  return paintings[dailyOrder[cyclePosition]]
}

const discoveredKey = 'shuilu-discovered-v1'
export function getDiscovered(): string[] {
  try { return [...new Set((JSON.parse(readStoredValue(discoveredKey, 'collection') || '[]') as string[]).map(id => id === '5699' ? '5697 2' : id))] } catch { return [] }
}
export function discover(id: string) {
  localStorage.setItem(discoveredKey, JSON.stringify([...new Set([...getDiscovered(), id])]))
}
import { publicAsset } from './assets'

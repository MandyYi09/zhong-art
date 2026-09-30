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
}

export const paintings: Painting[] = paintingFiles.map((id, index) => ({
  id,
  index: index + 1,
  original: `/paintings/original/${encodeURIComponent(id)}.webp`,
  thumbnail: `/paintings/thumb/${encodeURIComponent(id)}.webp`,
}))

export function getPainting(id: string) { return paintings.find((painting) => painting.id === id) }

export function getDailyPainting(date = new Date()) {
  const localDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
  return paintings[Number(localDay.replaceAll('-', '')) % paintings.length]
}

const discoveredKey = 'yitang-discovered-v1'
export function getDiscovered(): string[] {
  try { return JSON.parse(localStorage.getItem(discoveredKey) || '[]') as string[] } catch { return [] }
}
export function discover(id: string) {
  localStorage.setItem(discoveredKey, JSON.stringify([...new Set([...getDiscovered(), id])]))
}

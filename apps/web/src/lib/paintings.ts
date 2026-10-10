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

const blessings: Record<PaintingId, { zh: string; en: string }> = {
  '5683': { zh: '愿你在喧闹里，仍能听见自己的方向。', en: 'May you hear your own direction, even through the noise.' },
  '5685': { zh: '愿你有勇气拨开纷扰，走稳自己的路。', en: 'May you part the noise and walk your path with courage.' },
  '5686': { zh: '愿你为自己留一点温柔，也留一点勇气。', en: 'May you save some tenderness and courage for yourself.' },
  '5687': { zh: '愿你站稳脚下，安心做好眼前的事。', en: 'May you stand steady and meet what is before you.' },
  '5688': { zh: '愿你把心中的热情，留给真正重要的事。', en: 'May your energy find what truly matters to you.' },
  '5689': { zh: '愿你在纷乱中，找到片刻清明。', en: 'May a clear moment find you amid the rush.' },
  '5690': { zh: '愿你有勇气，表达心中真实的想法。', en: 'May you find the courage to speak honestly.' },
  '5691': { zh: '愿那些担心，慢慢变成可以整理的线索。', en: 'May your worries slowly become something you can untangle.' },
  '5692': { zh: '愿你看见前路，也相信自己的脚步。', en: 'May you see the road ahead and trust your own steps.' },
  '5693': { zh: '愿你用一点坚定，开始今天。', en: 'May you begin today with a little resolve.' },
  '5694': { zh: '愿你遇到阻碍时，记得还有别的路。', en: 'May you remember there is more than one way forward.' },
  '5695': { zh: '愿一个小小的发现，带你走得更远。', en: 'May a small discovery lead you somewhere new.' },
  '5696 2': { zh: '愿你守住心里的光，也看见身边的光。', en: 'May you keep your inner light and notice it around you.' },
  '5697 2': { zh: '愿你放下着急，让答案慢慢浮现。', en: 'May you give the answer time to appear.' },
  '5698': { zh: '愿你认真照顾自己，也温柔看待别人。', en: 'May you care for yourself and meet others gently.' },
  '5699': { zh: '愿你在变化里，找到自己的节奏。', en: 'May you find your own rhythm through change.' },
  '5702': { zh: '愿今天的努力，都能被你自己看见。', en: 'May you notice the effort you make today.' },
  '5703': { zh: '愿你不必等到完美，也能勇敢前进。', en: 'May you move forward without waiting to be perfect.' },
  '5704': { zh: '愿你的热情，落在值得的地方。', en: 'May your passion find a place worthy of it.' },
  '5705': { zh: '愿你面对未知时，仍保有好奇与勇气。', en: 'May you meet the unknown with curiosity and courage.' },
}

export const paintings: Painting[] = paintingFiles.map((id, index) => ({
  id,
  index: index + 1,
  original: `/paintings/original/${encodeURIComponent(id)}.webp`,
  thumbnail: `/paintings/thumb/${encodeURIComponent(id)}.webp`,
  character: `/paintings/character-modern/${encodeURIComponent(id)}.webp`,
  blessing: blessings[id],
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

const discoveredKey = 'yitang-discovered-v1'
export function getDiscovered(): string[] {
  try { return JSON.parse(localStorage.getItem(discoveredKey) || '[]') as string[] } catch { return [] }
}
export function discover(id: string) {
  localStorage.setItem(discoveredKey, JSON.stringify([...new Set([...getDiscovered(), id])]))
}

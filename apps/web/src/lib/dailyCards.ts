import { publicAsset } from './assets'
import { getDailyPainting, type Painting } from './paintings'

export interface DailyCard {
  painting: Painting
  edition: 'regular' | 'hidden'
  sku: string
  back: string
  title?: string
  blessing: { zh: string; en: string }
}

const hiddenEditions: Record<string, { sku: string; title: string; blessing: { zh: string; en: string } }> = {
  '5691': { sku: 'SL-SP01', title: 'COURAGE IN MOTION', blessing: {
    zh: '愿你在变化中找到平静，在每一个新的开始里拥有勇气。',
    en: 'May you find calm within change and courage in every new beginning.',
  } },
  '5696 2': { sku: 'SL-SP02', title: 'LIGHT THE WAY', blessing: {
    zh: '愿你心中的光引领自己前行，也照亮他人的路。',
    en: 'May your inner light guide you forward and brighten the path for others.',
  } },
}

export function getDailyCard(date = new Date()): DailyCard {
  const painting = getDailyPainting(date)
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
  const [year, month, dateNumber] = day.split('-').map(Number)
  const calendarDay = Math.floor(Date.UTC(year, month - 1, dateNumber) / 86_400_000)
  // Preserve the existing daily painting cycle. Every other cycle offers the
  // two special editions of their own source paintings, without an extra draw.
  const special = Math.floor(calendarDay / 20) % 2 === 0 ? hiddenEditions[painting.id] : undefined
  return {
    painting,
    edition: special ? 'hidden' : 'regular',
    sku: special?.sku || `SL-${String(painting.index).padStart(2, '0')}`,
    back: publicAsset(`cards/back-${special ? 'e' : 'k'}.webp`),
    title: special?.title,
    blessing: special?.blessing || painting.blessing,
  }
}

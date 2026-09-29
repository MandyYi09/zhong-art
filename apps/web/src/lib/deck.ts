import type { GuardianCard, Locale } from './types'

const foundations = [
  ['玄壇元帥', 'Marshal of the Dark Altar', '守正開路', 'Clear the way with integrity', ['果敢', '守信', '財運'], ['Courage', 'Trust', 'Fortune']],
  ['關聖帝君', 'Lord Guan', '義氣長存', 'Steadfast in what is right', ['忠義', '勇氣', '定心'], ['Loyalty', 'Courage', 'Resolve']],
  ['天上聖母', 'Mazu', '渡海安瀾', 'Safe passage through change', ['守護', '平安', '歸途'], ['Protection', 'Peace', 'Homecoming']],
  ['文昌帝君', 'Wenchang Dijun', '文思澄明', 'Clarity for the work ahead', ['學業', '專注', '智慧'], ['Learning', 'Focus', 'Wisdom']],
  ['福德正神', 'Earth God', '腳踏實地', 'Good things grow from steady ground', ['安定', '豐足', '鄰里'], ['Grounding', 'Abundance', 'Community']],
  ['九天玄女', 'Mysterious Lady', '靜觀全局', 'See the whole before you move', ['洞察', '策略', '勇毅'], ['Insight', 'Strategy', 'Valor']],
  ['保生大帝', 'Baosheng Dadi', '身心調和', 'Make room for restoration', ['療癒', '節制', '安康'], ['Healing', 'Balance', 'Wellbeing']],
  ['鍾馗', 'Zhong Kui', '掃除陰霾', 'Meet fear with a steady heart', ['辟邪', '膽識', '正氣'], ['Warding', 'Bravery', 'Righteousness']],
  ['月下老人', 'Old Man Under the Moon', '善緣相遇', 'Treat every bond with care', ['緣分', '真誠', '相知'], ['Affinity', 'Sincerity', 'Kinship']],
  ['魁星', 'Kui Xing', '一筆定志', 'Let effort sharpen your aim', ['功名', '勤學', '志向'], ['Achievement', 'Study', 'Purpose']],
] as const

const blessings: Record<Locale, string[]> = {
  'zh-TW': ['願你今日心有所定，步步安穩。', '願你看清方向，也保有溫柔。', '願你的努力被看見，勇氣不被消磨。', '願你守住初心，迎來自己的好運。', '願你在變動之中，仍能找到安身之處。'],
  en: ['May you move steadily with a settled heart.', 'May clarity and kindness guide you today.', 'May your effort be seen and your courage remain.', 'May you keep your center and welcome good fortune.', 'May you find firm ground even while things change.'],
}

export const curatedDeck: GuardianCard[] = Array.from({ length: 50 }, (_, index) => {
  const base = foundations[index % foundations.length]
  const cycle = Math.floor(index / foundations.length)
  return {
    id: `guardian-${String(index + 1).padStart(2, '0')}`,
    number: index + 1,
    name: { 'zh-TW': cycle ? `${base[0]}・${['雲', '山', '水', '星'][cycle - 1]}` : base[0], en: cycle ? `${base[1]} · ${['Cloud', 'Mountain', 'Water', 'Star'][cycle - 1]}` : base[1] },
    epithet: { 'zh-TW': base[2], en: base[3] },
    keywords: { 'zh-TW': [...base[4]], en: [...base[5]] },
    blessing: { 'zh-TW': blessings['zh-TW'][index % 5], en: blessings.en[index % 5] },
    story: {
      'zh-TW': `此卡以水陸畫中的${base[0]}形象為文化線索，從服飾、持物與祥雲紋樣理解其象徵。卡片提供當代鼓勵，不取代宗教解釋或儀式。`,
      en: `This card uses the Water-and-Land painting of ${base[1]} as a cultural point of entry, reading meaning through dress, attributes, and cloud motifs. Its message is contemporary encouragement, not a substitute for religious interpretation or ritual.`,
    },
    status: index < 12 ? 'approved' : index < 46 ? 'in_review' : 'rejected',
    image: index === 0 ? '/references/5698.JPG' : index === 1 ? '/references/5702.JPG' : undefined,
    palette: (['vermilion', 'jade', 'gold', 'indigo'] as const)[index % 4],
  }
})

export const publishedDeck = curatedDeck.filter((card) => card.status === 'approved')

export function getDailyCard(date = new Date()) {
  const dateKey = Number(`${date.getUTCFullYear()}${date.getUTCMonth() + 1}${date.getUTCDate()}`)
  return publishedDeck[dateKey % publishedDeck.length]
}

export function getCard(id: string) { return publishedDeck.find((card) => card.id === id) }

import type { AdminUser, CuratedCard, LocalizedText, QuotaSettings } from '@/contracts/admin'

const themes: LocalizedText[] = [
  { 'zh-TW': '把此刻留給自己', en: 'Keep this moment for yourself' },
  { 'zh-TW': '允許答案慢慢浮現', en: 'Let the answer arrive slowly' },
  { 'zh-TW': '回到身體知道的事', en: 'Return to what the body knows' },
  { 'zh-TW': '為未知留一扇窗', en: 'Leave a window open for the unknown' },
  { 'zh-TW': '聽見微小的渴望', en: 'Listen for the quiet longing' },
]

export const initialCards: CuratedCard[] = Array.from({ length: 50 }, (_, index) => ({
  id: `card-${String(index + 1).padStart(2, '0')}`,
  order: index + 1,
  title: themes[index % themes.length],
  prompt: {
    'zh-TW': ['今天，有什麼值得你溫柔地看見？', '如果不用急著決定，你會注意到什麼？', '哪一件小事正在邀請你靠近？'][index % 3],
    en: ['What deserves your gentle attention today?', 'If no decision were urgent, what would you notice?', 'What small thing is inviting you closer?'][index % 3],
  },
  status: index < 42 ? 'published' : index < 47 ? 'review' : 'draft',
  updatedAt: new Date(Date.UTC(2026, 8, 12 - (index % 8), 3 + (index % 6), 20)).toISOString(),
  updatedBy: ['林映彤', 'Alex Chen', '吳安琪'][index % 3],
}))

export const initialUsers: AdminUser[] = [
  { id: 'u1', name: '林映彤', email: 'yingtong@zhong.art', roles: ['admin'], status: 'active', lastActiveAt: '2026-09-13T05:10:00Z' },
  { id: 'u2', name: 'Alex Chen', email: 'alex@zhong.art', roles: ['editor'], status: 'active', lastActiveAt: '2026-09-12T14:42:00Z' },
  { id: 'u3', name: '吳安琪', email: 'anqi@zhong.art', roles: ['support'], status: 'active', lastActiveAt: '2026-09-11T09:18:00Z' },
  { id: 'u4', name: 'Morgan Lee', email: 'morgan@example.com', roles: ['viewer'], status: 'invited' },
  { id: 'u5', name: '陳庭羽', email: 'tingyu@example.com', roles: ['viewer'], status: 'suspended', lastActiveAt: '2026-08-27T02:30:00Z' },
]

export const initialSettings: QuotaSettings = {
  anonymousDaily: 1,
  authenticatedDaily: 3,
  globalMonthlyBudgetUsd: 250,
  budgetCutoffEnabled: true,
  usedThisMonthUsd: 164.72,
  updatedAt: '2026-09-12T08:40:00Z',
}

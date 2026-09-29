export type Locale = 'zh-TW' | 'en'
export type Localized = Record<Locale, string>
export type ReviewStatus = 'approved' | 'in_review' | 'rejected'

export interface GuardianCard {
  id: string
  number: number
  name: Localized
  epithet: Localized
  keywords: Record<Locale, string[]>
  blessing: Localized
  story: Localized
  status: ReviewStatus
  image?: string
  palette: 'vermilion' | 'jade' | 'gold' | 'indigo'
}

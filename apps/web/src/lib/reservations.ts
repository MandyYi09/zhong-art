import config from './reservation-config.json'

export interface ReservationConfig {
  enabled: boolean
  recipientEmail: string
  formToken: string
  currency: string
  prices: { card: number | null; gift: number | null }
}
export const reservationConfig: ReservationConfig = config
export function reservationEndpoint(settings: ReservationConfig) {
  const target = settings.formToken.trim() || settings.recipientEmail.trim()
  if (!settings.enabled || !target) return null
  if (settings.formToken ? !/^[a-zA-Z0-9-]+$/.test(target) : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) return null
  return `https://formsubmit.co/${encodeURIComponent(target)}`
}
export function reservationPrice(edition: 'card' | 'gift', quantity: number, en: boolean, settings = reservationConfig) {
  const price = settings.prices[edition]
  if (price === null || !Number.isFinite(price) || price < 0) return en ? 'Price to be confirmed' : '价格待确认'
  return new Intl.NumberFormat(en ? 'en' : 'zh-CN', { style: 'currency', currency: settings.currency }).format(price * quantity)
}

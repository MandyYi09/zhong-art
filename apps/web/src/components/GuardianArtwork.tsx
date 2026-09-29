import type { GuardianCard } from '@/lib/types'

export function GuardianArtwork({ card, className = '' }: { card: GuardianCard; className?: string }) {
  if (card.image) return <img className={`guardian-art ${className}`} src={card.image} alt="" />
  return <div className={`guardian-art generated-art palette-${card.palette} ${className}`} aria-hidden="true">
    <span className="halo"/><span className="cloud cloud-one"/><span className="cloud cloud-two"/>
    <span className="figure"><i/><b>{card.name['zh-TW'].slice(0, 1)}</b></span>
  </div>
}

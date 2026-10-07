import type { ClueKey } from '@/lib/paintingClues'
import type { Painting } from '@/lib/paintings'

export function DetailCrop({ painting, clue, label, className = '' }: { painting: Painting; clue: ClueKey; label: string; className?: string }) {
  return <div className={`detail-crop detail-crop-${clue} ${className}`} role="img" aria-label={label} style={{ backgroundImage: `url("${painting.original}")` }}/>
}

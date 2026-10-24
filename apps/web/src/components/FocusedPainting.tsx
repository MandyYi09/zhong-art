import { useEffect, useState } from 'react'
import regions from '@/lib/detail-regions.json'
import { useId } from 'react'
import type { Painting } from '@/lib/paintings'
import type { ClueKey } from '@/lib/paintingClues'

type Region = [number, number, number, number]
export function FocusedPainting({ painting, clue, character, label }: { painting: Painting; clue: ClueKey | null; character: boolean; label: string }) {
  const clipId = useId()
  const src = character ? painting.character : painting.original
  const [loaded, setLoaded] = useState<{ src: string; width: number; height: number } | null>(null)
  useEffect(() => {
    let active = true
    const image = new Image()
    image.onload = () => { if (active) setLoaded({ src, width: image.naturalWidth, height: image.naturalHeight }) }
    image.src = src
    return () => { active = false }
  }, [src])
  if (!loaded || loaded.src !== src) return <img src={src} alt={label}/>
  const region: Region = !clue || character ? [0, 0, 1, 1] : regions[painting.id][clue] as Region
  const [x, y, w, h] = region
  return <svg className="focused-painting" viewBox={`${x * loaded.width} ${y * loaded.height} ${w * loaded.width} ${h * loaded.height}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={label}>
    <defs><clipPath id={clipId}><rect x={x * loaded.width} y={y * loaded.height} width={w * loaded.width} height={h * loaded.height}/></clipPath></defs>
    <image href={src} width={loaded.width} height={loaded.height} clipPath={`url(#${clipId})`}/>
  </svg>
}

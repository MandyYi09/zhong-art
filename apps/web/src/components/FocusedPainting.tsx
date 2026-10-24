import { useEffect, useState } from 'react'
import type { Painting } from '@/lib/paintings'
import type { ClueKey } from '@/lib/paintingClues'

type Region = [number, number, number, number]
const defaultRegions: Record<ClueKey, Region> = {
  head: [.15, .02, .7, .42],
  hands: [.05, .27, .9, .46],
  robe: [.15, .48, .7, .47],
}
const doumuRegions: Record<ClueKey, Region> = {
  head: [.31, .035, .35, .25],
  hands: [.06, .08, .86, .43],
  robe: [.22, .35, .55, .29],
}

export function FocusedPainting({ painting, clue, character, label }: { painting: Painting; clue: ClueKey | null; character: boolean; label: string }) {
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
  const region: Region = !clue || character ? [0, 0, 1, 1] : (painting.id === '438' ? doumuRegions : defaultRegions)[clue]
  const [x, y, w, h] = region
  return <svg className="focused-painting" viewBox={`${x * loaded.width} ${y * loaded.height} ${w * loaded.width} ${h * loaded.height}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={label}>
    <image href={src} width={loaded.width} height={loaded.height}/>
  </svg>
}

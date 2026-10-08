import type { Painting } from './paintings'
import type { ClueKey } from './paintingClues'

export type WallpaperSource = 'original' | 'character'
export type WallpaperLayout = 'portrait' | 'window' | 'echo'
export type WallpaperPalette = 'night' | 'ink' | 'jade'
export type WallpaperCloud = 'drift' | 'veil' | 'gather'

export interface WallpaperOptions {
  source: WallpaperSource
  layout: WallpaperLayout
  palette: WallpaperPalette
  cloud: WallpaperCloud
  scale: number
  positionX: number
  positionY: number
  arrangement: number
  blessing: string | null
  en: boolean
  focus: ClueKey | null
}

export const wallpaperWidth = 1440
export const wallpaperHeight = 3120

const imageCache = new Map<string, Promise<HTMLImageElement>>()

function loadImage(src: string) {
  if (!imageCache.has(src)) imageCache.set(src, new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => { imageCache.delete(src); reject(new Error(`Could not load ${src}`)) }
    image.src = src
  }))
  return imageCache.get(src)!
}

function roundedArch(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  const radius = width / 2
  ctx.beginPath()
  ctx.moveTo(x, y + height)
  ctx.lineTo(x, y + radius)
  ctx.arc(x + radius, y + radius, radius, Math.PI, 0)
  ctx.lineTo(x + width, y + height)
  ctx.closePath()
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, en: boolean) {
  const words = en ? text.split(/\s+/) : Array.from(text)
  const separator = en ? ' ' : ''
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line}${separator}${word}` : word
    if (line && ctx.measureText(next).width > maxWidth) { lines.push(line); line = word }
    else line = next
  }
  if (line) lines.push(line)
  return lines
}

function drawClouds(ctx: CanvasRenderingContext2D, options: WallpaperOptions) {
  const sets = {
    drift: [[80, 620, 340], [1400, 1770, 370], [420, 2920, 430]],
    veil: [[260, 1120, 500], [1260, 650, 380], [850, 2760, 570]],
    gather: [[220, 500, 390], [1190, 620, 480], [640, 2740, 590]],
  }
  const colours = options.palette === 'ink' ? ['#b6c0b4', '#aa9d90'] : options.palette === 'jade' ? ['#b6d6bc', '#d4c39e'] : ['#c4d8bd', '#d8b6ad']
  ctx.save()
  ctx.filter = 'blur(34px)'
  ctx.globalCompositeOperation = 'screen'
  sets[options.cloud].forEach(([x, y, radius], index) => {
    const shift = options.arrangement % 3 === 1 ? 130 : options.arrangement % 3 === 2 ? -110 : 0
    ctx.fillStyle = colours[index % 2]
    ctx.globalAlpha = options.cloud === 'veil' ? .13 : .19
    for (let part = 0; part < 5; part++) {
      ctx.beginPath()
      ctx.ellipse(x + shift + (part - 2) * radius * .34, y + Math.sin(part * 2) * radius * .16, radius * .44, radius * .28, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  })
  ctx.restore()
}

function drawImageAt(ctx: CanvasRenderingContext2D, image: HTMLImageElement, options: WallpaperOptions, xShift = 0, yShift = 0, extraScale = 1) {
  const maxWidth = options.layout === 'echo' ? 1090 : 1210
  const maxHeight = options.layout === 'echo' ? 1960 : 2240
  const fit = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight)
  const size = fit * options.scale / 100 * extraScale
  const width = image.naturalWidth * size
  const height = image.naturalHeight * size
  const variation = options.arrangement % 3 === 1 ? -65 : options.arrangement % 3 === 2 ? 65 : 0
  const x = (wallpaperWidth - width) / 2 + options.positionX * 2.5 + variation + xShift
  const y = (wallpaperHeight - height) / 2 - 30 + options.positionY * 3 + yShift
  ctx.drawImage(image, x, y, width, height)
}

function drawInset(ctx: CanvasRenderingContext2D, original: HTMLImageElement, focus: ClueKey) {
  const sourceSize = original.naturalWidth * (focus === 'head' ? .38 : .54)
  const sourceTop = focus === 'head' ? .27 : focus === 'hands' ? .42 : .55
  const sourceY = Math.min(original.naturalHeight - sourceSize, original.naturalHeight * sourceTop)
  const x = 1070, y = 2490, size = 250
  ctx.fillStyle = '#d9caa9'
  ctx.fillRect(x - 9, y - 9, size + 18, size + 18)
  ctx.drawImage(original, (original.naturalWidth - sourceSize) / 2, sourceY, sourceSize, sourceSize, x, y, size, size)
}

function drawWallpaper(ctx: CanvasRenderingContext2D, width: number, height: number, image: HTMLImageElement, original: HTMLImageElement, painting: Painting, options: WallpaperOptions) {
  ctx.save()
  ctx.scale(width / wallpaperWidth, height / wallpaperHeight)
  const colours = options.palette === 'night' ? ['#101d29', '#294d55'] : options.palette === 'ink' ? ['#181b1c', '#4b4b46'] : ['#173630', '#59877a']
  const background = ctx.createLinearGradient(0, 0, 0, wallpaperHeight)
  background.addColorStop(0, colours[0]); background.addColorStop(1, colours[1])
  ctx.fillStyle = background; ctx.fillRect(0, 0, wallpaperWidth, wallpaperHeight)

  ctx.strokeStyle = 'rgba(224, 211, 175, .13)'
  ctx.lineWidth = 2
  for (let line = 0; line < 8; line++) {
    const y = 210 + line * 395 + (options.arrangement % 2 ? 55 : 0)
    ctx.beginPath(); ctx.moveTo(line % 2 ? 760 : 80, y); ctx.lineTo(line % 2 ? 1390 : 590, y); ctx.stroke()
  }

  if (options.layout === 'window') {
    roundedArch(ctx, 130, 500, 1180, 2090)
    ctx.fillStyle = options.palette === 'ink' ? '#343c3a' : options.palette === 'jade' ? '#38675b' : '#294c52'
    ctx.fill()
    if (options.source === 'original') {
      ctx.save()
      roundedArch(ctx, 150, 520, 1140, 2050)
      ctx.clip()
      ctx.filter = options.palette === 'ink' ? 'saturate(.75)' : 'saturate(.9)'
      drawImageAt(ctx, image, options, 0, -30, 1.22)
      ctx.restore()
    }
    roundedArch(ctx, 130, 500, 1180, 2090)
    ctx.strokeStyle = 'rgba(229, 213, 176, .65)'; ctx.lineWidth = 5; ctx.stroke()
  }

  if (options.layout === 'echo') {
    ctx.save()
    ctx.globalAlpha = options.source === 'character' ? .25 : .16
    ctx.filter = 'grayscale(.35)'
    drawImageAt(ctx, image, options, 210, -170, 1.1)
    ctx.restore()
    ctx.fillStyle = 'rgba(222, 206, 166, .12)'
    ctx.fillRect(80, 400, 24, 2030)
    ctx.fillRect(112, 2280, 330, 24)
  }

  if (options.layout !== 'window' || options.source === 'character') {
    ctx.save()
    ctx.filter = options.palette === 'ink' ? 'saturate(.73) contrast(1.04)' : options.palette === 'jade' ? 'saturate(.88)' : 'none'
    drawImageAt(ctx, image, options, options.layout === 'echo' ? -100 : 0, options.layout === 'echo' ? 65 : 0, options.layout === 'window' && options.source === 'character' ? 1.1 : 1)
    ctx.restore()
  }

  drawClouds(ctx, options)
  const shade = ctx.createLinearGradient(0, 0, 0, wallpaperHeight)
  shade.addColorStop(0, 'rgba(8, 25, 29, .55)')
  shade.addColorStop(.14, 'rgba(8, 25, 29, .1)')
  shade.addColorStop(.66, 'rgba(8, 25, 29, 0)')
  shade.addColorStop(1, 'rgba(8, 25, 29, .78)')
  ctx.fillStyle = shade; ctx.fillRect(0, 0, wallpaperWidth, wallpaperHeight)

  ctx.fillStyle = 'rgba(238, 222, 183, .85)'
  ctx.font = '26px Arial, sans-serif'
  ctx.letterSpacing = '5px'
  ctx.fillText(`YITANG  /  ${String(painting.index).padStart(2, '0')}`, 108, 160)
  ctx.letterSpacing = '0px'

  if (options.focus) drawInset(ctx, original, options.focus)
  if (options.blessing) {
    ctx.font = options.en ? '62px Georgia, serif' : '66px "Noto Serif TC", "Songti SC", serif'
    const lines = wrapText(ctx, options.blessing, options.focus ? 790 : 1110, options.en)
    ctx.fillStyle = '#f2ead6'
    ctx.shadowColor = 'rgba(5, 23, 25, .9)'; ctx.shadowBlur = 22; ctx.shadowOffsetY = 4
    lines.forEach((line, index) => ctx.fillText(line, 108, 2800 - (lines.length - index - 1) * 88))
  }
  ctx.restore()
}

export async function renderWallpaper(canvas: HTMLCanvasElement, painting: Painting, options: WallpaperOptions) {
  const characterFallback = `/paintings/character/${encodeURIComponent(painting.id)}.webp`
  const image = options.source === 'character'
    ? await loadImage(painting.character).catch(() => loadImage(characterFallback))
    : await loadImage(painting.original)
  const original = options.focus ? await loadImage(painting.original) : image
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawWallpaper(ctx, canvas.width, canvas.height, image, original, painting, options)
}

import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Download, RefreshCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DetailCrop } from '@/components/DetailCrop'
import { clueReadings, paintingClues, type ClueKey } from '@/lib/paintingClues'
import { getDailyPainting, paintings, paintingFiles } from '@/lib/paintings'

export const Route = createFileRoute('/create')({
  validateSearch: (search: Record<string, unknown>) => ({
    from: typeof search.from === 'string' && paintingFiles.includes(search.from as (typeof paintingFiles)[number]) ? search.from : undefined,
    focus: search.focus === 'head' || search.focus === 'hands' || search.focus === 'robe' ? search.focus as ClueKey : undefined,
  }),
  component: CreatePage,
})

const palettes = [
  { id: 'night', zh: '夜青', en: 'Night blue' },
  { id: 'ink', zh: '墨灰', en: 'Ink grey' },
  { id: 'jade', zh: '青玉', en: 'Jade' },
] as const
const clouds = [
  { id: 'drift', zh: '浮云', en: 'Drifting' },
  { id: 'veil', zh: '云幕', en: 'Veil' },
  { id: 'gather', zh: '云聚', en: 'Gathering' },
] as const

function wrapBlessing(ctx: CanvasRenderingContext2D, blessing: string, maxWidth: number, en: boolean) {
  if (!en) {
    const comma = blessing.indexOf('，')
    if (comma > 0) {
      const clauses = [blessing.slice(0, comma + 1), blessing.slice(comma + 1)]
      if (clauses.every(clause => ctx.measureText(clause).width <= maxWidth)) return clauses
    }
  }
  const parts = en ? blessing.split(/\s+/) : Array.from(blessing)
  const separator = en ? ' ' : ''
  const lines: string[] = []
  let current = ''
  for (const part of parts) {
    const next = current ? `${current}${separator}${part}` : part
    if (current && ctx.measureText(next).width > maxWidth) { lines.push(current); current = part }
    else current = next
  }
  if (current) lines.push(current)
  return lines
}

const wallpaperWidth = 1440
const wallpaperHeight = 3120

function drawBlessing(ctx: CanvasRenderingContext2D, blessing: string, en: boolean, hasInset: boolean) {
  ctx.save()
  ctx.font = en ? '62px Georgia, serif' : '66px "Noto Serif TC", "Songti SC", serif'
  const lines = wrapBlessing(ctx, blessing, hasInset ? 760 : 1120, en)
  const lineHeight = en ? 84 : 90
  const lastBaseline = wallpaperHeight - 400
  ctx.fillStyle = '#f2ead6'
  ctx.shadowColor = 'rgba(5, 23, 25, .9)'
  ctx.shadowBlur = 22
  ctx.shadowOffsetY = 4
  lines.forEach((line, index) => ctx.fillText(line, 112, lastBaseline - (lines.length - index - 1) * lineHeight))
  ctx.restore()
}

function CreatePage() {
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  const { from, focus } = Route.useSearch()
  const [index, setIndex] = useState(() => { const found = paintings.findIndex(item => item.id === from); return found >= 0 ? found : 2 })
  const [palette, setPalette] = useState<(typeof palettes)[number]['id']>('night')
  const [cloud, setCloud] = useState<(typeof clouds)[number]['id']>('drift')
  const [arrangement, setArrangement] = useState(0)
  const [includeBlessing, setIncludeBlessing] = useState(false)
  const painting = paintings[index]
  const daily = getDailyPainting()
  const blessing = daily.blessing[en ? 'en' : 'zh']
  const focusedClue = from === painting.id && focus ? focus : null
  const focusedReading = focusedClue ? clueReadings[paintingClues[painting.id][focusedClue].motif] : null
  const artRef = useRef<HTMLDivElement>(null)
  const figureSelectorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (from) setIndex(Math.max(0, paintings.findIndex(item => item.id === from)))
  }, [from])

  useEffect(() => {
    const selector = figureSelectorRef.current
    const selected = selector?.querySelector<HTMLButtonElement>('button.selected')
    if (selector && selected) selector.scrollTo({ left: selected.getBoundingClientRect().left - selector.getBoundingClientRect().left + selector.scrollLeft - (selector.clientWidth - selected.clientWidth) / 2, behavior: 'smooth' })
  }, [index])

  const saveImage = async () => {
    if (!en) await document.fonts.load('66px "Noto Serif TC"', blessing).catch(() => [])
    const canvas = document.createElement('canvas')
    canvas.width = wallpaperWidth; canvas.height = wallpaperHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const colours = palette === 'night' ? ['#101d2a', '#294b5a'] : palette === 'ink' ? ['#171a1a', '#454945'] : ['#173731', '#5a8d77']
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, colours[0]); gradient.addColorStop(1, colours[1])
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height)
    const image = new Image(); image.src = painting.original
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('Image load failed')) })
    const scale = arrangement % 3 === 0 ? 1.08 : 1.2
    const ratio = Math.max(canvas.width / image.width, canvas.height / image.height) * scale
    const width = image.width * ratio; const height = image.height * ratio
    const offset = arrangement % 3 === 1 ? -canvas.width * .048 : arrangement % 3 === 2 ? canvas.width * .048 : 0
    ctx.save()
    ctx.filter = palette === 'ink' ? 'saturate(.65) contrast(1.05)' : palette === 'jade' ? 'saturate(.85) hue-rotate(-8deg)' : 'none'
    ctx.drawImage(image, (canvas.width - width) / 2 + offset, (canvas.height - height) / 2, width, height)
    ctx.restore()
    const cloudColors = cloud === 'veil' ? ['#e5d8bb', '#b6d2c1'] : cloud === 'gather' ? ['#d2b8ad', '#c4d6a4'] : ['#b6d7c4', '#ddd08a']
    const positions = arrangement % 2 ? [[420, 500, 270], [1260, 1520, 310], [360, 2860, 380]] : [[110, 470, 300], [1320, 1760, 320], [650, 2930, 390]]
    ctx.save()
    ctx.filter = 'blur(24px)'
    ctx.globalCompositeOperation = 'screen'
    positions.forEach(([x,y,r],n) => { ctx.fillStyle = cloudColors[n % 2]; ctx.globalAlpha = cloud === 'veil' ? .36 : .46; for(let k=0;k<5;k++){ctx.beginPath();ctx.ellipse(x + (k-2)*r*.34,y+Math.sin(k*2)*r*.16,r*.44,r*.27,0,0,Math.PI*2);ctx.fill()} })
    ctx.restore()
    const shade = ctx.createLinearGradient(0, 0, 0, canvas.height)
    shade.addColorStop(0, 'rgba(8, 30, 35, .68)')
    shade.addColorStop(.16, 'rgba(8, 30, 35, .5)')
    shade.addColorStop(.32, 'rgba(8, 30, 35, 0)')
    shade.addColorStop(.58, 'rgba(8, 30, 35, 0)')
    shade.addColorStop(1, 'rgba(8, 26, 29, .78)')
    ctx.fillStyle = shade; ctx.fillRect(0, 0, canvas.width, canvas.height)
    if (focusedClue) {
      const cropWidth = image.width * (focusedClue === 'head' ? .38 : .54)
      const cropTop = focusedClue === 'head' ? .27 : focusedClue === 'hands' ? .42 : .55
      const sourceY = Math.min(image.height - cropWidth, image.height * cropTop)
      ctx.fillStyle = '#17282b'; ctx.fillRect(968, 2532, 374, 374)
      ctx.drawImage(image, (image.width - cropWidth) / 2, sourceY, cropWidth, cropWidth, 980, 2544, 350, 350)
      ctx.strokeStyle = '#e7d8b2'; ctx.lineWidth = 2; ctx.strokeRect(968, 2532, 374, 374)
    }
    if (includeBlessing) drawBlessing(ctx, blessing, en, Boolean(focusedClue))
    const link = document.createElement('a'); link.href = canvas.toDataURL('image/png'); link.download = `yitang-${painting.id}${includeBlessing ? '-blessing' : ''}-wallpaper.png`; link.click()
  }

  return <section className="compose-page">
    <div className="compose-topline"><Link to="/" className="return-link"><ArrowLeft size={15}/>{en ? 'Back to the painting' : '回到画前'}</Link><span>COMPOSITION / STUDY</span></div>
    <div className="compose-heading"><span className="overline">{en ? 'RE-ARRANGE THE PAINTING' : '重新构图'}</span><h1>{en ? <>Let the old image<br/><em>find another rhythm.</em></> : <>让旧画，<br/><em>有另一种呼吸。</em></>}</h1><p>{en ? 'Choose a figure, a cloud rhythm, and a colour. The composition settles into place.' : '选择人物、云的节奏和底色，画面会自己落到合适的位置。'}</p></div>
    {focusedClue && focusedReading && <div className="composition-from-detail"><DetailCrop painting={painting} clue={focusedClue} label={en ? `Selected detail from image ${painting.index}` : `第 ${painting.index} 幅的已选细节`}/><div><span className="overline">{en ? 'BROUGHT FROM YOUR PATH' : '从你的观看路径带来'}</span><strong>{focusedReading.title[en ? 'en' : 'zh']}</strong><p>{en ? 'This detail now appears as a small inset in your composition and saved image.' : '这个细节会作为画中画，出现在构图预览与保存的图片里。'}</p></div></div>}
    <div className="compose-workspace">
      <div className="compose-controls">
        <div className="choice-block"><div className="choice-heading"><span>01</span><strong>{en ? 'Choose an image' : '选一张画'}</strong><small>{String(index + 1).padStart(2, '0')} / 20</small></div><div ref={figureSelectorRef} className="figure-selector" role="group" aria-label={en ? 'Choose an image' : '选择原画'}>{paintings.map((item, n) => <button key={item.id} type="button" className={index === n ? 'selected' : ''} onClick={() => setIndex(n)} aria-label={en ? `Image ${n + 1}` : `第 ${n + 1} 幅`} aria-pressed={index === n}><img src={item.thumbnail} alt="" loading="lazy"/></button>)}</div></div>
        <div className="choice-block"><div className="choice-heading"><span>02</span><strong>{en ? 'Cloud rhythm' : '云的节奏'}</strong></div><div className="choice-chips">{clouds.map(item => <button key={item.id} type="button" className={cloud === item.id ? 'selected' : ''} onClick={() => setCloud(item.id)}>{en ? item.en : item.zh}</button>)}</div></div>
        <div className="choice-block"><div className="choice-heading"><span>03</span><strong>{en ? 'Ground colour' : '底色'}</strong></div><div className="choice-chips colour-chips">{palettes.map(item => <button key={item.id} type="button" className={palette === item.id ? 'selected' : ''} onClick={() => setPalette(item.id)}><i className={`palette-dot ${item.id}`}/>{en ? item.en : item.zh}</button>)}</div></div>
        <div className="choice-block blessing-choice"><div className="choice-heading"><span>04</span><strong>{en ? 'Today’s blessing' : '今日祝福'}</strong></div><label className="blessing-option"><input type="checkbox" checked={includeBlessing} onChange={event => setIncludeBlessing(event.target.checked)}/><span><strong>{en ? 'Add the blessing to my image' : '把今日抽到的祝福语放在图片上'}</strong><small>{en ? `From today’s card · No. ${String(daily.index).padStart(2, '0')}` : `来自今日卡片 · 第 ${String(daily.index).padStart(2, '0')} 幅`}</small></span></label>{includeBlessing && <blockquote className="blessing-choice-preview">“{blessing}”</blockquote>}</div>
        <div className="compose-actions"><button type="button" className="paper-button" onClick={() => setArrangement(n => n + 1)}><RefreshCw size={16}/>{en ? 'Try another arrangement' : '再排一次'}</button><button type="button" className="subtle-button" onClick={() => void saveImage()}><Download size={16}/>{en ? 'Save phone wallpaper' : '保存手机壁纸'}</button></div>
        <p className="wallpaper-hint">{en ? '1440 × 3120 PNG · Set it as your lock screen from Photos.' : '1440 × 3120 PNG · 下载后可从相册设为锁屏壁纸。'}</p>
        <p className="composition-note">{en ? 'A visual study made from the source image. It does not represent a historical painting or a newly identified figure.' : '这是基于原图的视觉练习，不代表新的历史画作或人物考证。'}</p>
      </div>
      <div className="composition-display"><div ref={artRef} className={`composition-art palette-${palette} clouds-${cloud} arrangement-${arrangement % 3}${focusedClue ? ' has-focus' : ''}`}><img src={painting.original} alt={en ? `Phone wallpaper based on source image ${painting.id}` : `基于原图 ${painting.id} 的手机壁纸`}/><span className="compose-cloud cloud-a"/><span className="compose-cloud cloud-b"/><span className="compose-cloud cloud-c"/>{focusedClue && <DetailCrop painting={painting} clue={focusedClue} label={en ? `Inset detail: ${focusedReading?.title.en}` : `局部画中画：${focusedReading?.title.zh}`} className="composition-focus-inset"/>}{includeBlessing && <div className="composition-blessing"><p>{blessing}</p></div>}</div><span className="composition-caption">STUDY NO. {String(painting.index).padStart(2, '0')} · {painting.id}</span></div>
    </div>
  </section>
}

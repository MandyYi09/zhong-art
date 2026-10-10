import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Download, RefreshCw } from 'lucide-react'
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { DetailCrop } from '@/components/DetailCrop'
import { clueReadings, paintingClues, type ClueKey } from '@/lib/paintingClues'
import { getDailyPainting, paintings, paintingFiles } from '@/lib/paintings'
import { publicAsset } from '@/lib/assets'
import { renderWallpaper, wallpaperHeight, wallpaperWidth, type WallpaperCloud, type WallpaperLayout, type WallpaperOptions, type WallpaperPalette, type WallpaperSource } from '@/lib/wallpaper'

export const Route = createFileRoute('/create')({
  validateSearch: (search: Record<string, unknown>) => ({
    from: (typeof search.from === 'string' || typeof search.from === 'number') && paintingFiles.includes(String(search.from) as (typeof paintingFiles)[number]) ? String(search.from) : undefined,
    focus: search.focus === 'head' || search.focus === 'hands' || search.focus === 'robe' ? search.focus as ClueKey : undefined,
    ...(search.source === 'character' ? { source: 'character' as const } : {}),
  }),
  component: CreatePage,
})

const palettes: { id: WallpaperPalette; zh: string; en: string }[] = [
  { id: 'night', zh: '夜青', en: 'Night blue' },
  { id: 'ink', zh: '墨灰', en: 'Ink grey' },
  { id: 'jade', zh: '青玉', en: 'Jade' },
]
const clouds: { id: WallpaperCloud; zh: string; en: string }[] = [
  { id: 'drift', zh: '浮云', en: 'Drifting' },
  { id: 'veil', zh: '云幕', en: 'Veil' },
  { id: 'gather', zh: '云聚', en: 'Gathering' },
]
const layouts: { id: WallpaperLayout; zh: string; en: string; zhNote: string; enNote: string }[] = [
  { id: 'portrait', zh: '留白', en: 'Open', zhNote: '让人物独自站在画面里', enNote: 'Give the figure room to breathe' },
  { id: 'window', zh: '圆拱', en: 'Arch', zhNote: '让人物从一道窗口出现', enNote: 'Look through a painted window' },
  { id: 'echo', zh: '重影', en: 'Echo', zhNote: '错位叠放，留下运动的痕迹', enNote: 'Layer an offset visual echo' },
]
const clamp = (value: number) => Math.max(-100, Math.min(100, Math.round(value)))

function CreatePage() {
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  const { from, focus, source: entrySource } = Route.useSearch()
  const [index, setIndex] = useState(() => { const found = paintings.findIndex(item => item.id === from); return found >= 0 ? found : paintings.findIndex(item => item.id === getDailyPainting().id) })
  const [source, setSource] = useState<WallpaperSource>(entrySource ?? 'original')
  const [layout, setLayout] = useState<WallpaperLayout>('portrait')
  const [palette, setPalette] = useState<WallpaperPalette>('night')
  const [cloud, setCloud] = useState<WallpaperCloud>('drift')
  const [scale, setScale] = useState(100)
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [arrangement, setArrangement] = useState(0)
  const [includeBlessing, setIncludeBlessing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const painting = paintings[index]
  const daily = getDailyPainting()
  const blessing = daily.blessing[en ? 'en' : 'zh']
  const focusedClue = from === painting.id && focus ? focus : null
  const focusedReading = focusedClue ? clueReadings[paintingClues[painting.id][focusedClue].motif] : null
  const previewRef = useRef<HTMLCanvasElement>(null)
  const figureSelectorRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ x: number; y: number; positionX: number; positionY: number } | null>(null)

  useEffect(() => {
    if (from) setIndex(Math.max(0, paintings.findIndex(item => item.id === from)))
  }, [from])
  useEffect(() => { if (entrySource) setSource(entrySource) }, [entrySource])
  useEffect(() => {
    const selector = figureSelectorRef.current
    const selected = selector?.querySelector<HTMLButtonElement>('button.selected')
    if (selector && selected) selector.scrollTo({ left: selected.getBoundingClientRect().left - selector.getBoundingClientRect().left + selector.scrollLeft - (selector.clientWidth - selected.clientWidth) / 2, behavior: 'smooth' })
  }, [index])

  const options: WallpaperOptions = {
    source, layout, palette, cloud, scale, positionX, positionY, arrangement,
    blessing: includeBlessing ? blessing : null, en, focus: focusedClue,
  }

  useEffect(() => {
    let active = true
    const preview = previewRef.current
    if (!preview) return
    const frame = document.createElement('canvas')
    frame.width = 720; frame.height = 1560
    void (async () => {
      if (includeBlessing && !en) await document.fonts.load('66px "Noto Serif TC"', blessing).catch(() => [])
      await renderWallpaper(frame, painting, options)
      if (!active) return
      const ctx = preview.getContext('2d')
      ctx?.clearRect(0, 0, preview.width, preview.height)
      ctx?.drawImage(frame, 0, 0)
      setError('')
    })().catch(() => { if (active) setError(en ? 'The preview could not load. Try another image.' : '预览暂时无法加载，请试试另一张图。') })
    return () => { active = false }
  }, [painting, source, layout, palette, cloud, scale, positionX, positionY, arrangement, includeBlessing, blessing, en, focusedClue])

  const saveImage = async () => {
    if (isSaving) return
    setIsSaving(true); setError('')
    try {
      if (includeBlessing && !en) await document.fonts.load('66px "Noto Serif TC"', blessing).catch(() => [])
      const canvas = document.createElement('canvas')
      canvas.width = wallpaperWidth; canvas.height = wallpaperHeight
      await renderWallpaper(canvas, painting, options)
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(result => result ? resolve(result) : reject(new Error('Could not export wallpaper')), 'image/png'))
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `yitang-${painting.id}-${source}${includeBlessing ? '-blessing' : ''}-wallpaper.png`
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 30000)
    } catch {
      setError(en ? 'The wallpaper could not be saved. Please try again.' : '壁纸保存失败，请再试一次。')
    } finally { setIsSaving(false) }
  }

  const startDrag = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    dragRef.current = { x: event.clientX, y: event.clientY, positionX, positionY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const moveDrag = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current) return
    const width = event.currentTarget.getBoundingClientRect().width
    setPositionX(clamp(dragRef.current.positionX + (event.clientX - dragRef.current.x) * 1440 / width / 2.5))
    setPositionY(clamp(dragRef.current.positionY + (event.clientY - dragRef.current.y) * 1440 / width / 3))
  }

  return <section className="compose-page">
    <div className="compose-topline"><Link to="/" className="return-link"><ArrowLeft size={15}/>{en ? 'Back to the painting' : '回到画前'}</Link><span>COMPOSITION / STUDY</span></div>
    <div className="compose-heading"><span className="overline">{en ? 'RE-ARRANGE THE PAINTING' : '重新构图'}</span><h1>{en ? <>Let the old image<br/><em>find another rhythm.</em></> : <>让旧画，<br/><em>有另一种呼吸。</em></>}</h1><p>{en ? 'Choose a painting or its illustrated figure. Change the framing, move it, and make a wallpaper of your own.' : '选择原画或插画角色，改变取景、位置和层次，做一张自己的壁纸。'}</p></div>
    {focusedClue && focusedReading && <div className="composition-from-detail"><DetailCrop painting={painting} clue={focusedClue} label={en ? `Selected detail from image ${painting.index}` : `第 ${painting.index} 幅的已选细节`}/><div><span className="overline">{en ? 'BROUGHT FROM YOUR PATH' : '从你的观看路径带来'}</span><strong>{focusedReading.title[en ? 'en' : 'zh']}</strong><p>{en ? 'This source detail stays in your wallpaper, whichever image version you choose.' : '无论选择原画还是插画角色，这个原画细节都会留在你的壁纸里。'}</p></div></div>}
    <div className="compose-workspace">
      <div className="compose-controls">
        <div className="choice-block"><div className="choice-heading"><span>01</span><strong>{en ? 'Choose an image' : '选一张画'}</strong><small>{String(index + 1).padStart(2, '0')} / 20</small></div><div ref={figureSelectorRef} className="figure-selector" role="group" aria-label={en ? 'Choose an image' : '选择一张画'}>{paintings.map((item, n) => <button key={item.id} type="button" className={index === n ? 'selected' : ''} onClick={() => setIndex(n)} aria-label={en ? `Image ${n + 1}` : `第 ${n + 1} 幅`} aria-pressed={index === n}><img src={source === 'character' ? item.character : item.thumbnail} onError={event => { if (source === 'character') event.currentTarget.src = publicAsset(`paintings/character/${encodeURIComponent(item.id)}.webp`) }} alt="" loading="lazy"/></button>)}</div></div>
        <div className="choice-block"><div className="choice-heading"><span>02</span><strong>{en ? 'Which version?' : '用哪一种图像？'}</strong></div><div className="source-options" role="group" aria-label={en ? 'Choose image version' : '选择图像版本'}><button type="button" className={source === 'original' ? 'selected' : ''} aria-pressed={source === 'original'} onClick={() => setSource('original')}><img src={painting.thumbnail} alt=""/><span><strong>{en ? 'Original painting' : '原画'}</strong><small>{en ? 'Keep the painted textures' : '保留笔触与原有色彩'}</small></span></button><button type="button" className={source === 'character' ? 'selected' : ''} aria-pressed={source === 'character'} onClick={() => setSource('character')}><img src={painting.character} onError={event => { event.currentTarget.src = publicAsset(`paintings/character/${encodeURIComponent(painting.id)}.webp`) }} alt=""/><span><strong>{en ? 'Illustrated figure' : '插画角色'}</strong><small>{en ? 'A new form from the painting' : '让人物走出原画'}</small></span></button></div></div>
        <div className="choice-block"><div className="choice-heading"><span>03</span><strong>{en ? 'Build the composition' : '决定构图'}</strong></div><div className="layout-options" role="group" aria-label={en ? 'Choose composition' : '选择构图'}>{layouts.map(item => <button key={item.id} type="button" className={layout === item.id ? 'selected' : ''} aria-pressed={layout === item.id} onClick={() => setLayout(item.id)}><i className={`layout-mark layout-mark-${item.id}`} aria-hidden="true"/><strong>{en ? item.en : item.zh}</strong><small>{en ? item.enNote : item.zhNote}</small></button>)}</div></div>
        <div className="choice-block"><div className="choice-heading"><span>04</span><strong>{en ? 'Move the image' : '移动画面'}</strong></div><p className="placement-hint">{en ? 'Drag the preview to place the image. Fine-tune it below.' : '直接拖动右侧预览调整位置，也可以用下面的滑杆微调。'}</p><div className="placement-sliders"><label>{en ? 'Size' : '大小'}<input type="range" min="75" max="140" step="5" value={scale} onChange={event => setScale(Number(event.target.value))}/><output>{scale}%</output></label><label>{en ? 'Left · right' : '左右'}<input type="range" min="-100" max="100" step="5" value={positionX} onChange={event => setPositionX(Number(event.target.value))}/><output>{positionX > 0 ? '+' : ''}{positionX}</output></label><label>{en ? 'Up · down' : '上下'}<input type="range" min="-100" max="100" step="5" value={positionY} onChange={event => setPositionY(Number(event.target.value))}/><output>{positionY > 0 ? '+' : ''}{positionY}</output></label></div><button className="placement-reset" type="button" onClick={() => { setScale(100); setPositionX(0); setPositionY(0) }}>{en ? 'Reset image placement' : '重置图像位置'}</button></div>
        <div className="choice-block"><div className="choice-heading"><span>05</span><strong>{en ? 'Cloud rhythm' : '云的节奏'}</strong></div><div className="choice-chips">{clouds.map(item => <button key={item.id} type="button" className={cloud === item.id ? 'selected' : ''} aria-pressed={cloud === item.id} onClick={() => setCloud(item.id)}>{en ? item.en : item.zh}</button>)}</div></div>
        <div className="choice-block"><div className="choice-heading"><span>06</span><strong>{en ? 'Ground colour' : '底色'}</strong></div><div className="choice-chips colour-chips">{palettes.map(item => <button key={item.id} type="button" className={palette === item.id ? 'selected' : ''} aria-pressed={palette === item.id} onClick={() => setPalette(item.id)}><i className={`palette-dot ${item.id}`}/>{en ? item.en : item.zh}</button>)}</div></div>
        <div className="choice-block blessing-choice"><div className="choice-heading"><span>07</span><strong>{en ? 'Today’s blessing' : '今日祝福'}</strong></div><label className="blessing-option"><input type="checkbox" checked={includeBlessing} onChange={event => setIncludeBlessing(event.target.checked)}/><span><strong>{en ? 'Add the blessing to my wallpaper' : '把今日抽到的祝福语放在壁纸上'}</strong><small>{en ? `From today’s card · No. ${String(daily.index).padStart(2, '0')}` : `来自今日卡片 · 第 ${String(daily.index).padStart(2, '0')} 幅`}</small></span></label>{includeBlessing && <blockquote className="blessing-choice-preview">“{blessing}”</blockquote>}</div>
        <div className="compose-actions"><button type="button" className="paper-button" onClick={() => setArrangement(n => n + 1)}><RefreshCw size={16}/>{en ? 'Try another arrangement' : '再排一次'}</button><button type="button" className="subtle-button" disabled={isSaving} onClick={() => void saveImage()}><Download size={16}/>{isSaving ? (en ? 'Preparing wallpaper…' : '正在制作壁纸…') : (en ? 'Save phone wallpaper' : '保存手机壁纸')}</button></div>
        {error && <p className="compose-error" role="alert">{error}</p>}
        <p className="wallpaper-hint">{en ? 'The preview matches your 1440 × 3120 PNG. Set it as your lock screen from Photos.' : '预览与 1440 × 3120 PNG 壁纸一致；下载后可从相册设为锁屏。'}</p>
        <p className="composition-note">{en ? 'A visual study made from the source image. It does not represent a historical painting or a newly identified figure.' : '这是基于原图的视觉练习，不代表新的历史画作或人物考证。'}</p>
      </div>
      <div className="composition-display"><canvas ref={previewRef} width="720" height="1560" className="wallpaper-preview" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={() => { dragRef.current = null }} onPointerCancel={() => { dragRef.current = null }} aria-label={en ? 'Drag to reposition your wallpaper image' : '拖动以调整壁纸中的图像位置'}/><span className="composition-caption">{source === 'character' ? (en ? 'ILLUSTRATED FIGURE' : '插画角色') : (en ? 'ORIGINAL PAINTING' : '原画')} · NO. {String(painting.index).padStart(2, '0')} · {painting.id}</span></div>
    </div>
  </section>
}

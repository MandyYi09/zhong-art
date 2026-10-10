import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import guardians from '@/lib/cloud-court-guardians.json'
import celestialPreview from '@/assets/guardian-celestial-inline.webp?inline'
import jadePreview from '@/assets/guardian-jade-inline.webp?inline'
import flamePreview from '@/assets/guardian-flame-inline.webp?inline'

// Keep the mobile hero independent of separate image requests. These small
// previews render at the canvas's display size and are bundled with the JS.
const previews: Record<string, { src: string; width: number; height: number }> = {
  'guardian-celestial.jpg': { src: celestialPreview, width: 1124, height: 1912 },
  'guardian-jade.jpg': { src: jadePreview, width: 1128, height: 1870 },
  'guardian-flame.jpg': { src: flamePreview, width: 1094, height: 1918 },
}

const labels = {
  'zh-TW': { title: '雲庭 · 細看人物', inscription: '雲起時 · 萬象生', names: ['人物一', '人物二', '人物三'], elements: ['先看神態', '再看衣紋', '留意持物'], previous: '上一位人物', next: '下一位人物', pause: '暫停輪播', play: '播放輪播', hint: '從原畫出發，讓舊筆觸動起來。' },
  en: { title: 'THE CLOUD COURT', inscription: 'CLOUDS RISE · ALL THINGS AWAKEN', names: ['Figure I', 'Figure II', 'Figure III'], elements: ['Look at the face', 'Look at the robe', 'Look at the object'], previous: 'Previous figure', next: 'Next figure', pause: 'Pause carousel', play: 'Play carousel', hint: 'Old brushstrokes in motion.' },
}

function PaintedGuardian({ guardian, animate }: { guardian: typeof guardians[number]; animate: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [rendered, setRendered] = useState(false)
  const preview = previews[guardian.file]
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const image = new Image()
    let frame = 0
    let disposed = false
    let texture: HTMLCanvasElement | null = null
    const render = (now: number) => {
      if (!texture || disposed) return
      const time = animate && !motion.matches ? now / 1000 : 0
      context.clearRect(0, 0, canvas.width, canvas.height)
      const height = 505
      const width = height * texture.width / texture.height
      context.save()
      context.translate(210, 284 + Math.sin(time * .8 + guardian.phase) * 5)
      context.rotate(Math.sin(time * .55 + guardian.phase) * .012)
      for (let strip = 0; strip < 76; strip++) {
        const progress = strip / 76
        const sourceY = progress * texture.height
        const flex = Math.sin(progress * 7 - time * 1.45 + guardian.phase) * 2.7 * Math.pow(Math.abs(progress - .48) * 2, 1.5)
        context.drawImage(texture, 0, sourceY, texture.width, Math.min(texture.height / 76 + 2, texture.height - sourceY), -width / 2 + flex, -height / 2 + progress * height, width, height / 76 + 1)
      }
      context.restore()
      if (animate && !motion.matches && !document.hidden) frame = requestAnimationFrame(render)
    }
    image.onload = () => {
      if (disposed) return
      try {
        const [x, y, width, height] = guardian.bounds
        texture = document.createElement('canvas')
        texture.width = width
        texture.height = height
        const paint = texture.getContext('2d')
        if (!paint) return
        paint.translate(-x, -y)
        paint.save()
        paint.clip(new Path2D(guardian.outline))
        paint.drawImage(image, 0, 0, preview.width, preview.height)
        paint.restore()
        paint.globalCompositeOperation = 'destination-out'
        guardian.holes.forEach(hole => paint.fill(new Path2D(hole)))
        render(performance.now())
        setRendered(true)
      } catch {
        // Some embedded mobile browsers fail to create the clipped canvas.
        // The still image remains visible instead of leaving an empty stage.
        texture = null
        setRendered(false)
      }
    }
    const refresh = () => { cancelAnimationFrame(frame); render(performance.now()) }
    motion.addEventListener('change', refresh)
    document.addEventListener('visibilitychange', refresh)
    image.src = preview.src
    return () => { disposed = true; cancelAnimationFrame(frame); motion.removeEventListener('change', refresh); document.removeEventListener('visibilitychange', refresh) }
  }, [guardian, animate])
  return <>
    {!rendered && <img className="guardian-fallback" src={preview.src} alt="" aria-hidden="true" />}
    <canvas ref={ref} width={420} height={560} className="painted-guardian" aria-hidden="true" />
  </>
}

export function GuardianCarousel() {
  const { i18n } = useTranslation()
  const copy = labels[i18n.language === 'en' ? 'en' : 'zh-TW']
  const [active, setActive] = useState(1)
  const [playing, setPlaying] = useState(true)
  const [interacting, setInteracting] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const move = (direction: number) => setActive(index => (index + direction + guardians.length) % guardians.length)
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!playing || interacting || reducedMotion) return
    const timer = setInterval(() => { if (!document.hidden) setActive(index => (index + 1) % guardians.length) }, 7000)
    return () => clearInterval(timer)
  }, [playing, interacting, reducedMotion, active])

  return <section className="guardian-carousel" aria-roledescription="carousel" aria-label={copy.title}
    onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
    onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false) }}
    onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1) } }}>
    <div className="carousel-heading"><span className="carousel-dot" />{copy.title}<span className="carousel-edition">STUDY 001 — 003</span></div>
    <div className="guardian-stage"
      onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }}
      onTouchEnd={event => { if (touch.current) { const x = event.changedTouches[0].clientX - touch.current.x; const y = event.changedTouches[0].clientY - touch.current.y; if (Math.abs(x) > 40 && Math.abs(x) > Math.abs(y)) move(x < 0 ? 1 : -1) } touch.current = null }}>
      <div className="guardian-orbit orbit-outer"/><div className="guardian-orbit orbit-inner"/><span className={`stage-inscription${i18n.language === 'en' ? ' is-english' : ''}`}>{copy.inscription}</span>
      {guardians.map((guardian, index) => {
        const offset = (index - active + guardians.length) % guardians.length
        return <div key={guardian.file} role="group" className={`guardian-slide ${offset === 0 ? 'is-active' : offset === 1 ? 'is-next' : 'is-previous'}`} aria-hidden={index !== active} aria-roledescription="slide" aria-label={`${index + 1} / ${guardians.length}: ${copy.names[index]}`}>
          <PaintedGuardian guardian={guardian} animate={index === active && playing && !reducedMotion}/>
        </div>
      })}
      <span className="stage-cloud stage-cloud-left"/><span className="stage-cloud stage-cloud-right"/>
      <div className="guardian-caption" aria-live={playing && !interacting ? 'off' : 'polite'}><span>{copy.elements[active]}</span><h2>{copy.names[active]}</h2></div>
    </div>
    <div className="carousel-controls">
      <button className="carousel-arrow" onClick={() => move(-1)} aria-label={copy.previous}><ChevronLeft size={19}/></button>
      <div className="carousel-pagination">{guardians.map((guardian, index) => <button key={guardian.file} aria-label={copy.names[index]} aria-current={index === active ? 'true' : undefined} onClick={() => setActive(index)}><span/></button>)}</div>
      <button className="carousel-arrow" onClick={() => move(1)} aria-label={copy.next}><ChevronRight size={19}/></button>
      <span className="carousel-count">0{active + 1}<span> / 03</span></span>
      <button className="carousel-play" aria-label={playing ? copy.pause : copy.play} aria-pressed={!playing} onClick={() => setPlaying(value => !value)}>{playing ? <Pause size={14}/> : <Play size={14}/>}</button>
    </div>
    <p className="carousel-footnote">{copy.hint}</p>
  </section>
}

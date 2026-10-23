import { GarmentOrnament } from './GarmentOrnament'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { publicAsset } from '@/lib/assets'

const GuardianCarousel = lazy(() => import('./GuardianCarousel').then(module => ({ default: module.GuardianCarousel })))

export function GuardianGallery() {
  const { i18n } = useTranslation()
  const [mobile, setMobile] = useState<boolean | null>(null)
  const frame = useRef<HTMLIFrameElement>(null)
  const visible = useRef(true)
  const notifyVisibility = () => frame.current?.contentWindow?.postMessage({ type: 'scene-visibility', visible: visible.current }, window.location.origin)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; notifyVisibility() })
    if (frame.current) observer.observe(frame.current)
    return () => observer.disconnect()
  }, [mobile])
  useEffect(() => {
    const query = matchMedia('(max-width: 767px)')
    const update = () => setMobile(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return <div className={`guardian-gallery ${mobile ? 'gallery-mobile' : 'gallery-desktop'}`}>
    <div className="cloud-frame cloud-frame-top" aria-hidden="true"><CloudEdge/><GarmentOrnament/></div>
    <div className="cloud-frame cloud-frame-bottom" aria-hidden="true"><CloudEdge/><GarmentOrnament/></div>
    {mobile === true && <Suspense fallback={<div className="guardian-stage"/>}><GuardianCarousel/></Suspense>}
    {mobile === false && <iframe ref={frame} onLoad={notifyVisibility} className="cloud-court-scene" src={publicAsset('artwork/cloud-court/scene.html', { lang: i18n.language === 'en' ? 'en' : 'zh-TW', v: '20261023-cloud-frame' })} title={i18n.language === 'en' ? 'The Cloud Court: three animated figures among painted clouds' : '雲庭：三位畫中人物與流動的彩雲'} allow="fullscreen" />}
  </div>
}

function CloudEdge() {
  return <svg viewBox="0 0 420 120" fill="none" aria-hidden="true" focusable="false">
    <path d="M-25 105C-25 70 8 65 24 78 5 44 41 22 67 42 69 9 123 3 135 38 164 12 208 36 190 64 223 46 248 66 241 85 277 65 303 94 331 86 369 75 399 87 438 112" fill="#d4dfc5" stroke="#91a58a" strokeWidth="1.5"/>
    <path d="M23 80C44 100 84 80 62 61 48 50 36 68 51 72M70 43C92 18 131 47 110 62 95 73 80 57 96 51M137 41C157 25 184 46 170 59 157 70 145 54 158 51M192 74C213 60 237 82 221 91 209 97 200 85 211 82" stroke="#8ca38c" strokeWidth="1.5"/>
    <path d="M-5 101C58 121 103 83 148 84S220 115 276 99 340 113 403 107" stroke="#f4e8c7" strokeWidth="3"/>
  </svg>
}

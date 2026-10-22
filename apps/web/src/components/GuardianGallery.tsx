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
    {mobile === true && <Suspense fallback={<div className="guardian-stage"/>}><GuardianCarousel/></Suspense>}
    {mobile === false && <iframe ref={frame} onLoad={notifyVisibility} className="cloud-court-scene" src={publicAsset('artwork/cloud-court/scene.html', { lang: i18n.language === 'en' ? 'en' : 'zh-TW' })} title={i18n.language === 'en' ? 'The Cloud Court: three animated figures among painted clouds' : '雲庭：三位畫中人物與流動的彩雲'} allow="fullscreen" />}
  </div>
}

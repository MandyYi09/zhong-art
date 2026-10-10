import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GuardianCarousel } from './GuardianCarousel'
import { publicAsset } from '@/lib/assets'

export function GuardianGallery() {
  const { i18n } = useTranslation()
  const [mobile, setMobile] = useState<boolean | null>(null)
  useEffect(() => {
    const query = matchMedia('(max-width: 767px)')
    const update = () => setMobile(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return <div className={`guardian-gallery ${mobile ? 'gallery-mobile' : 'gallery-desktop'}`}>
    {mobile === true && <GuardianCarousel/>}
    {mobile === false && <iframe className="cloud-court-scene" src={`${publicAsset('artwork/cloud-court/scene.html')}?lang=${i18n.language === 'en' ? 'en' : 'zh-TW'}`} title={i18n.language === 'en' ? 'The Cloud Court: three animated figures among painted clouds' : '雲庭：三位畫中人物與流動的彩雲'} allow="fullscreen" />}
  </div>
}

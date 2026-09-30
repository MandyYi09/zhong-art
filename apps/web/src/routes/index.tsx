import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { GuardianGallery } from '@/components/GuardianGallery'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'

  return <section className="opening-scene">
    <div className="opening-copy">
      <p className="overline">YITANG · {en ? 'A WAY INTO THE PAINTING' : '从一张画，开始看'}</p>
      <h1>{en ? <>Look closer.<br/><em>Something will appear.</em></> : <>先别急着看懂。<br/><em>靠近一点。</em></>}</h1>
      <p className="opening-instruction">{en ? 'Move a figure. Part the clouds. Follow whatever catches your eye.' : '移动人物，拨开云层。从吸引你的地方开始。'}</p>
    </div>
    <div className="living-painting">
      <GuardianGallery/>
      <span className="living-corner living-corner-left" aria-hidden="true"/>
      <span className="living-corner living-corner-right" aria-hidden="true"/>
    </div>
  </section>
}

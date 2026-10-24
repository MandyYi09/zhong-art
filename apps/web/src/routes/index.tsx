import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { GuardianGallery } from '@/components/GuardianGallery'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'

  return <section className="opening-scene">
    <h1 className="visually-hidden">{en ? 'Explore Shuilu paintings' : '探索水陆画'}</h1>
    <div className="living-painting">
      <GuardianGallery/>
      <span className="living-corner living-corner-left" aria-hidden="true"/>
      <span className="living-corner living-corner-right" aria-hidden="true"/>
    </div>
    <div className="home-feature-actions"><Link className="paper-button" to="/draw">{en ? 'Draw a card' : '抽一张卡'} <ArrowRight size={16}/></Link><Link to="/collection">{en ? 'Browse paintings' : '浏览图集'} →</Link><Link to="/create" search={{ from: undefined, focus: undefined }}>{en ? 'Make a wallpaper' : '制作壁纸'} →</Link></div>
      <details className="painting-background"><summary>{en ? 'What are Shuilu paintings?' : '水陆画是什么？'}</summary><p>{en ? 'Shuilu paintings were displayed in temples during Buddhist Shuilu rituals. Their imagery includes Buddhist and Daoist deities, folk figures and people from many walks of life. This project begins with the visible details in a selection of figure images.' : '水陆画是寺庙举行水陆法会时使用的绘画，题材包括佛教、道教及民间神祇，也有人间各类人物。这个项目从一组人物图像出发，先带你认识画面中看得见的细节。'}</p><a href="https://www.ihchina.cn/project_details/14249/" target="_blank" rel="noreferrer">{en ? 'Background: China Intangible Cultural Heritage website ↗' : '背景资料：中国非物质文化遗产网 ↗'}</a></details>
  </section>
}

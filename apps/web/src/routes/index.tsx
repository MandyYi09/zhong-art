import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { GuardianGallery } from '@/components/GuardianGallery'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'

  return <section className="opening-scene">
    <div className="opening-copy">
      <p className="overline">{en ? 'A WAY INTO THE PAINTING' : '从一张画，开始看'}</p>
      <h1>{en ? <>Draw a card.<br/><em>Follow its clues.</em></> : <>先遇见一张卡，<br/><em>再发现画里的线索。</em></>}</h1>
      <div className="opening-intro">
        <div>
          <p className="opening-purpose">{en ? 'New to old paintings? Draw one of twenty illustrated characters, find its detail among fragments of the original paintings, then follow that clue back to its source. A small discovery opens a way to understand the image and connect it to today.' : '不了解古画，也可以从这里开始。先抽一张由水陆画转绘的角色卡，在原画局部中找出它的线索，再回到画里认识这个细节。从一个小发现，走近古画，也连接今天的生活。'}</p>
          <div className="opening-actions"><Link className="paper-button" to="/draw">{en ? 'Draw a card & begin exploring' : '抽一张卡，开启探索'} <ArrowRight size={16}/></Link><Link to="/collection">{en ? 'Explore the atlas →' : '自己逛逛画册 →'}</Link></div>
          <p className="opening-promise">{en ? 'Three small stages · no prior knowledge needed · discover by looking' : '三个小关卡 · 无需古画知识 · 跟着线索慢慢发现'}</p>
        </div>
        <ol className="opening-steps">
          <li><span>01</span><div><strong>{en ? 'Meet your character' : '抽卡 · 遇见角色'}</strong><p>{en ? 'Turn a card to meet today’s figure.' : '翻开卡片，遇见今天的画中人物。'}</p></div></li>
          <li><span>02</span><div><strong>{en ? 'Find its clue' : '寻迹 · 找到线索'}</strong><p>{en ? 'Match a detail to the original image.' : '在原画局部里，找出角色的细节。'}</p></div></li>
          <li><span>03</span><div><strong>{en ? 'Return to its source' : '入画 · 解开画意'}</strong><p>{en ? 'Discover what the detail can tell you.' : '带着发现回到原画，读懂一点画意。'}</p></div></li>
        </ol>
      </div>
      <details className="painting-background"><summary>{en ? 'What are Shuilu paintings?' : '水陆画是什么？'}</summary><p>{en ? 'Shuilu paintings were displayed in temples during Buddhist Shuilu rituals. Their imagery includes Buddhist and Daoist deities, folk figures and people from many walks of life. This project begins with the visible details in a selection of figure images.' : '水陆画是寺庙举行水陆法会时使用的绘画，题材包括佛教、道教及民间神祇，也有人间各类人物。这个项目从一组人物图像出发，先带你认识画面中看得见的细节。'}</p><a href="https://www.ihchina.cn/project_details/14249/" target="_blank" rel="noreferrer">{en ? 'Background: China Intangible Cultural Heritage website ↗' : '背景资料：中国非物质文化遗产网 ↗'}</a></details>
    </div>
    <p className="opening-instruction living-instruction">{en ? 'You can also begin by moving a figure and parting the clouds below.' : '也可以先在画中探索：移动人物，拨开云层。'}</p>
    <div className="living-painting">
      <GuardianGallery/>
      <span className="living-corner living-corner-left" aria-hidden="true"/>
      <span className="living-corner living-corner-right" aria-hidden="true"/>
    </div>
  </section>
}

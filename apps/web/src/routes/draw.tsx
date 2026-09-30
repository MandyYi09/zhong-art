import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getDailyPainting } from '@/lib/paintings'

export const Route = createFileRoute('/draw')({ component: DrawPage })

function DrawPage() {
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  const [revealed, setRevealed] = useState(false)
  const daily = getDailyPainting()

  return <section className="draw-page">
    <div className="draw-topline"><Link to="/" className="return-link"><ArrowLeft size={15}/>{en ? 'Back to the painting' : '回到画前'}</Link><span>DAILY DRAW / {String(daily.index).padStart(2, '0')}</span></div>
    <div className="draw-heading"><span className="overline">{en ? 'ONE IMAGE EACH DAY' : '每日抽卡'}</span><h1>{en ? <>Today, meet<br/><em>one painting.</em></> : <>今天，<br/><em>遇见一幅画。</em></>}</h1><p>{en ? 'Let chance bring you to an image. Then take time to notice what it holds.' : '由一次偶遇开始，再慢慢看清画中的细节。'}</p></div>
    <div className="draw-workspace">
      <div className={`daily-card ${revealed ? 'is-revealed' : ''}`}>
        {revealed ? <img src={daily.original} alt={en ? `Water-and-Land painting ${daily.id}` : `水陆画原画 ${daily.id}`}/> : <div className="daily-card-back" aria-hidden="true"><span>吉</span><small>YITANG · NO. {String(daily.index).padStart(2, '0')}</small></div>}
      </div>
      <div className="draw-side">
        <span className="overline">{revealed ? (en ? 'TODAY’S ENCOUNTER' : '今日相遇') : (en ? 'BEFORE YOU TURN THE CARD' : '翻开之前')}</span>
        <h2>{revealed ? (en ? 'Where does your eye go first?' : '你会先看哪里？') : (en ? 'A small invitation to look.' : '先从好奇开始。')}</h2>
        <p>{revealed ? (en ? 'Look at the original more closely. A headpiece, an object, or a line of the robe might open a new question.' : '翻到原画，看看头冠、持物或衣纹，哪一处让你想继续追问。') : (en ? 'The card is chosen from twenty original images and stays the same throughout the day.' : '今天的卡片从二十张原画中选出，今天再次来到这里，它仍是这一张。')}</p>
        {revealed ? <Link to="/card/$cardId" params={{ cardId: daily.id }} className="paper-button">{en ? 'Look closer' : '走近这张画'} <ArrowRight size={16}/></Link> : <button className="paper-button" type="button" onClick={() => setRevealed(true)}>{en ? 'Turn today’s card' : '翻开今日卡片'} <ArrowRight size={16}/></button>}
        <small>{en ? 'A new image appears tomorrow.' : '明天，再遇见新的一张。'}</small>
      </div>
    </div>
  </section>
}

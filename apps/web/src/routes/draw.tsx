import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getDailyPainting } from '@/lib/paintings'

export const Route = createFileRoute('/draw')({ component: DrawPage })

type CardPhase = 'sealed' | 'character' | 'original'

function DrawPage() {
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  const [phase, setPhase] = useState<CardPhase>('sealed')
  const daily = getDailyPainting()
  const blessing = en ? daily.blessing.en : daily.blessing.zh
  const nextPhase = () => setPhase(current => current === 'sealed' ? 'character' : current === 'character' ? 'original' : 'character')

  return <section className="draw-page">
    <div className="draw-topline"><Link to="/" className="return-link"><ArrowLeft size={15}/>{en ? 'Back to the painting' : '回到画前'}</Link><span>DAILY DRAW / {String(daily.index).padStart(2, '0')}</span></div>
    <div className="draw-heading"><span className="overline">{en ? 'ONE IMAGE EACH DAY' : '每日抽卡'}</span><h1>{en ? <>Today, meet<br/><em>one painting.</em></> : <>今天，<br/><em>遇见一幅画。</em></>}</h1><p>{en ? 'A character card, a small blessing, and the painting it came from.' : '先遇见角色与一句祝福，再回到它来自的原画。'}</p></div>
    <div className="draw-workspace">
      <button className={`daily-card daily-card-${phase}`} type="button" onClick={nextPhase} aria-label={phase === 'sealed' ? (en ? 'Turn today’s card' : '翻开今日卡片') : phase === 'character' ? (en ? 'View the original painting' : '查看对应原画') : (en ? 'Return to the character card' : '回到角色卡')}>
        {phase === 'sealed' && <div className="daily-card-back" aria-hidden="true"><span>吉</span><small>YITANG · NO. {String(daily.index).padStart(2, '0')}</small></div>}
        {phase === 'character' && <div className="daily-card-character">
          <span className="daily-character-index">YITANG · {String(daily.index).padStart(2, '0')} / 20</span>
          <span className="daily-character-halo" aria-hidden="true"/>
          <img src={daily.character} alt={en ? `Illustrated character adapted from painting ${daily.id}` : `根据原画 ${daily.id} 绘制的角色形象`}/>
          <span className="daily-card-message"><small>{en ? 'A WISH FOR TODAY' : '今日祝福'}</small><strong>{blessing}</strong></span>
          <span className="daily-card-hint">{en ? 'Tap the card to see the original' : '轻触卡片 · 翻看原画'} <ArrowRight size={14}/></span>
        </div>}
        {phase === 'original' && <div className="daily-card-original"><img src={daily.original} alt={en ? `Original Water-and-Land painting ${daily.id}` : `水陆画原画 ${daily.id}`}/><span>{en ? 'ORIGINAL PAINTING' : '原始图像'} · {daily.id}</span></div>}
      </button>
      <div className="draw-side">
        <span className="overline">{phase === 'sealed' ? (en ? 'BEFORE YOU TURN THE CARD' : '翻开之前') : phase === 'character' ? (en ? 'TODAY’S CHARACTER CARD' : '今日角色卡') : (en ? 'BACK TO THE SOURCE' : '回到原画')}</span>
        <h2>{phase === 'sealed' ? (en ? 'A small invitation to look.' : '先从好奇开始。') : phase === 'character' ? (en ? 'A wish for today.' : '给今天的一句话。') : (en ? 'Look where it began.' : '看看它原来的样子。')}</h2>
        {phase === 'character' && <blockquote className="draw-blessing">“{blessing}”</blockquote>}
        <p>{phase === 'sealed' ? (en ? 'One of twenty images will meet you today. The same card stays with you until tomorrow.' : '今天会遇见二十张画中的一张；在明天到来之前，它都会是你的今日卡片。') : phase === 'character' ? (en ? 'This illustration keeps the figure’s clothing and objects close to the painting. Tap the card to reveal its source.' : '这张角色卡保留了原画的人物衣饰与持物。轻触卡片，就能看到它来自哪一幅画。') : (en ? 'The illustration is only a doorway. Look closely at the original image and follow the details that catch your eye.' : '角色图只是入口。回到原画，再仔细看看让你停下来的那些细节。')}</p>
        {phase === 'original' ? <Link to="/card/$cardId" params={{ cardId: daily.id }} className="paper-button">{en ? 'Explore the original' : '细看这张原画'} <ArrowRight size={16}/></Link> : <button className="paper-button" type="button" onClick={nextPhase}>{phase === 'sealed' ? (en ? 'Turn today’s card' : '翻开今日卡片') : (en ? 'View the original' : '查看原画')} <ArrowRight size={16}/></button>}
        {phase === 'original' ? <button className="draw-reset" type="button" onClick={() => setPhase('character')}><RotateCcw size={14}/>{en ? 'Back to character card' : '回到角色卡'}</button> : <small>{phase === 'sealed' ? (en ? 'A new image appears tomorrow.' : '明天，再遇见新的一张。') : (en ? 'You can also tap the card itself.' : '也可以直接轻触卡片。')}</small>}
      </div>
    </div>
  </section>
}

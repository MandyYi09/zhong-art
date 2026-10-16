import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DetailCrop } from './DetailCrop'
import { getPainting, type Painting } from '@/lib/paintings'
import { paintingClues, type ClueKey } from '@/lib/paintingClues'
import { lookingLessons } from '@/lib/lookingLessons'

const steps = [
  { zh: '看见', en: 'Notice' },
  { zh: '对照', en: 'Compare' },
  { zh: '连接', en: 'Connect' },
  { zh: '带走', en: 'Keep' },
] as const

export function PaintingGuide({ painting, onFocusChange }: { painting: Painting; onFocusChange: (clue: ClueKey | null) => void }) {
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  const language = en ? 'en' : 'zh'
  const [step, setStep] = useState(0)
  const heading = useRef<HTMLHeadingElement>(null)
  const guidePanel = useRef<HTMLElement>(null)
  const firstRender = useRef(true)
  const comparison = getPainting('5685')!

  useEffect(() => {
    onFocusChange(step < 2 ? 'head' : null)
    if (firstRender.current) firstRender.current = false
    else {
      heading.current?.focus({ preventScroll: true })
      guidePanel.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
  }, [step, onFocusChange])

  return <section ref={guidePanel} className="painting-guide" aria-label={en ? 'Your first guided encounter' : '第一次看画引导'}>
    <span className="overline">{en ? 'YOUR FIRST ENCOUNTER · ABOUT 2 MINUTES' : '第一次看画 · 约 2 分钟'}</span>
    <ol className="guide-progress" aria-label={en ? 'Guide progress' : '引导进度'}>{steps.map((item, index) => <li key={item.en}><button type="button" aria-current={step === index ? 'step' : undefined} onClick={() => setStep(index)}><span>{String(index + 1).padStart(2, '0')}</span>{item[language]}</button></li>)}</ol>
    <div className="guide-content">
      <h1 ref={heading} tabIndex={-1}>{step === 0 ? (en ? <>Start with the crown.<br/><em>Then look behind it.</em></> : <>先看头冠，<br/><em>再看冠后的火焰。</em></>) : step === 1 ? (en ? <>Same detail.<br/><em>A different outline.</em></> : <>同样看头部，<br/><em>轮廓却不一样。</em></>) : step === 2 ? (en ? <>You already know<br/><em>a way to look.</em></> : <>其实，你已经<br/><em>有观看的经验。</em></>) : (en ? <>One detail.<br/><em>A new way of seeing.</em></> : <>看过一个细节，<br/><em>带走一种看法。</em></>)}</h1>
      {step === 0 && <>
        <p>{en ? 'Let us start at the head. You can simply read along; there is nothing to fill in.' : '先跟着看头部。只要看和读，就能完成这次体验。'}</p>
        <figure className="guide-single"><DetailCrop painting={painting} clue="head" label={en ? 'Gold brow crown and flames behind the head' : '额前金冠与头后火焰纹的局部'}/><figcaption>{en ? 'Image 01 · look at the brow, then behind the head' : '第 01 幅 · 先看额前，再看头后'}</figcaption></figure>
        <div className="guide-reading"><span>{en ? 'WHAT IS VISIBLE' : '画中所见'}</span><p>{paintingClues[painting.id].head.observed[language]}</p><span>{en ? 'WHY NOTICE IT' : '为什么值得看'}</span><p>{en ? 'The compact crown and spreading flames create different shapes. Together they enlarge the outline around the head and draw attention to the face. Notice how the figure’s presence comes from more than the crown alone.' : '紧凑的冠饰和向外展开的火焰，形成了两种不同的形状。它们一起扩大了头部的轮廓，让视线停在面容附近。人物的威势，也来自冠饰周围的造型。'}</p></div>
      </>}
      {step === 1 && <>
        <p>{en ? 'Look at another headpiece alongside it. Start with the shape, before trying to name the figure.' : '把另一幅画放在旁边。先比较形状，就能看出区别。'}</p>
        <div className="comparison-pair guide-pair">{[painting, comparison].map(item => <figure key={item.id}><DetailCrop painting={item} clue="head" label={en ? `Head detail from image ${item.index}` : `第 ${item.index} 幅的头部细节`}/><figcaption><strong>{en ? `Image ${String(item.index).padStart(2, '0')}` : `第 ${String(item.index).padStart(2, '0')} 幅`}</strong><span>{paintingClues[item.id].head.observed[language]}</span></figcaption></figure>)}</div>
        <div className="guide-reading"><span>{en ? 'A WAY TO READ THE DIFFERENCE' : '这样理解区别'}</span><p>{en ? 'In the first image, flames spread behind the crown. In the second, upward-curling ornaments stand out at the sides of the headpiece. Both draw attention to the head through different outlines. A headpiece’s shape can help you compare images before you know their names.' : '第一幅的火焰在冠后展开；第二幅更醒目的是冠饰两侧上卷的尖形。两者用不同的轮廓，让头部变得突出。即使暂时不知道人物名字，也可以先比较造型怎样吸引视线。'}</p></div>
      </>}
      {step === 2 && <>
        <p>{lookingLessons.head.today[language]}</p>
        <div className="guide-life"><span className="overline">{en ? 'TRY A FAMILIAR EXPERIENCE' : '想起一个熟悉的经验'}</span><h2>{en ? 'Think of a character you recognise by their outline.' : '想起一个你凭轮廓就能认出的角色。'}</h2><p>{en ? 'What makes it recognisable: headwear, hair, or the shape around the body? Bring that same attention back to the two painted figures.' : '让你记住它的是头饰、发型，还是身体周围的形状？带着这个经验，再回看刚才的两个人物。'}</p><small>{en ? 'This is a contemporary analogy for looking at form, rather than a historical identification.' : '这是帮助观察造型的当代类比；人物身份仍需结合历史资料确认。'}</small></div>
        <p className="guide-pause">{en ? 'You can think about it for a moment, or continue directly.' : '可以停一下想想，也可以直接继续。'}</p>
      </>}
      {step === 3 && <>
        <p>{en ? 'You have completed your first guided encounter. Here is what you can carry into the next painting.' : '你已经完成了第一次引导看画。再看下一幅时，可以带着这三个发现。'}</p>
        <ul className="guide-takeaways">
          <li><span>01</span><div><strong>{en ? 'Separate the layers' : '分清层次'}</strong><p>{en ? 'Headwear, hair and background motifs can be different parts of the image.' : '冠饰、发束和背景纹样，可能是画面中的不同部分。'}</p></div></li>
          <li><span>02</span><div><strong>{en ? 'Compare the outlines' : '比较轮廓'}</strong><p>{en ? 'An outward or upward shape can change how a figure catches your attention.' : '向外展开或向上伸出的形状，会改变人物吸引视线的方式。'}</p></div></li>
          <li><span>03</span><div><strong>{en ? 'Use familiar experience' : '借用生活经验'}</strong><p>{en ? 'The way you notice characters today can help you begin looking at an old painting.' : '今天辨认角色的经验，也能成为观察古画的起点。'}</p></div></li>
        </ul>
        <div className="guide-finish"><Link to="/card/$cardId" params={{ cardId: painting.id }} search={{ detail: 'head' }} className="paper-button">{en ? 'Explore this painting' : '自由探索这幅画'} <ArrowRight size={16}/></Link><Link to="/collection">{en ? 'Choose another painting →' : '去画册选另一幅 →'}</Link></div>
      </>}
    </div>
    <div className="guide-controls">{step > 0 && <button type="button" className="guide-back" onClick={() => setStep(step - 1)}><ArrowLeft size={14}/>{en ? 'Previous' : '上一步'}</button>}{step < 3 && <button type="button" className="paper-button" onClick={() => setStep(step + 1)}>{step === 0 ? (en ? 'Compare another image' : '看看另一幅怎么画') : step === 1 ? (en ? 'Connect it to today' : '和今天的经验连起来') : (en ? 'What did I learn?' : '看看我收获了什么')} <ArrowRight size={16}/></button>}</div>
    {step < 3 && <Link className="guide-skip" to="/card/$cardId" params={{ cardId: painting.id }} search={{ detail: 'head' }}>{en ? 'Explore at my own pace →' : '我想自己看看 →'}</Link>}
  </section>
}

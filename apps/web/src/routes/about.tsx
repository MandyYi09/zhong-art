import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  return <section className="about-page">
    <Link to="/" className="return-link"><ArrowLeft size={15}/>{en ? 'Back to the painting' : '回到画前'}</Link>
    <div className="about-letter">
      <span className="overline">{en ? 'A NOTE FROM MANDY' : '关于这个作品'}</span>
      <h1>{en ? <>I did not know<br/><em>where to look.</em></> : <>起初，我也不知道<br/><em>该往哪里看。</em></>}</h1>
      {en ? <>
        <p>I first encountered Water-and-Land paintings while helping Professor Li organise a collection. Their faces and colours caught me, but I did not understand what I was seeing.</p>
        <p>The more I looked, the more I realised that details I had treated as decoration might be clues. A headpiece, a held object, a gesture: each made me ask a better question.</p>
        <p>YITANG is an experiment in making that first encounter less intimidating. A daily card invites you in. The original image asks you to stay a little longer and look for yourself.</p>
      </> : <>
        <p>我第一次接触水陆画，是在帮李教授整理一批画的时候。那些鲜艳的颜色和强烈的神态吸引了我，但我不知道该怎么看。</p>
        <p>后来我慢慢发现，原本被我当成装饰的细节，可能都是理解人物的线索：头冠、持物、衣纹，甚至一个手势。每注意到一处，我就多了一个值得追问的问题。</p>
        <p>吉光是一次小小的尝试：让第一次看这些画的人愿意走近，再花一点时间，自己发现画中的线索。</p>
      </>}
      <div className="about-rule"/>
      <div className="about-process"><div><span>01</span><strong>{en ? 'Encounter' : '相遇'}</strong><small>{en ? 'What caught my eye?' : '什么让我停下来？'}</small></div><div><span>02</span><strong>{en ? 'Look' : '细看'}</strong><small>{en ? 'Which detail matters?' : '哪些细节值得追问？'}</small></div><div><span>03</span><strong>{en ? 'Connect' : '连接'}</strong><small>{en ? 'What else can I learn?' : '它通向怎样的背景？'}</small></div></div>
      <p className="about-footnote">{en ? 'This prototype uses twenty source photographs. Figure identities and historical explanations will be added only after they are checked against reliable materials.' : '这个原型使用二十张原始图像。人物身份和历史解释会在核对可靠资料后逐张补充。'}</p>
      <Link to="/collection" className="paper-button">{en ? 'Open the atlas' : '打开画册'} <ArrowRight size={16}/></Link>
    </div>
  </section>
}

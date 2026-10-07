import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Eye, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { clueReadings, paintingClues, type ClueKey } from '@/lib/paintingClues'
import { discover, getPainting, paintings } from '@/lib/paintings'

export const Route = createFileRoute('/card/$cardId')({ component: PaintingPage })

function PaintingPage() {
  const { cardId } = Route.useParams()
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  const painting = getPainting(cardId)
  const [revealed, setRevealed] = useState(false)
  const [clue, setClue] = useState<ClueKey | null>(null)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!painting) return
    discover(painting.id)
    setRevealed(false)
    setClue(null)
    setNote(localStorage.getItem(`yitang-note-${painting.id}`) || '')
    setSaved(false)
  }, [painting?.id])

  if (!painting) return <section className="painting-not-found"><p>{en ? 'This image is not in the atlas.' : '画册里没有这张图。'}</p><Link to="/collection">{en ? 'Open the atlas' : '打开画册'}</Link></section>
  const next = paintings[painting.index % paintings.length]
  const clueCopy: Record<ClueKey, { zh: string; en: string; questionZh: string; questionEn: string }> = {
    head: { zh: '看头冠', en: 'Headwear', questionZh: '它的轮廓和别张有什么不同？', questionEn: 'How does its silhouette differ from another?' },
    hands: { zh: '看手中', en: 'Held object', questionZh: '这个物件让你想到什么？', questionEn: 'What does this object make you wonder?' },
    robe: { zh: '看衣纹', en: 'Garment', questionZh: '颜色和线条把视线带向哪里？', questionEn: 'Where do the colours and lines lead your eye?' },
  }
  const selectedClue = clue ? paintingClues[painting.id][clue] : null
  const selectedReading = selectedClue ? clueReadings[selectedClue.motif] : null
  const saveNote = () => { localStorage.setItem(`yitang-note-${painting.id}`, note); setSaved(true) }

  return <section className="painting-page">
    <div className="painting-topline"><Link to="/collection" className="return-link"><ArrowLeft size={15}/>{en ? 'The atlas' : '回到画册'}</Link><span>IMAGE {String(painting.index).padStart(2, '0')} / 20</span></div>
    <div className="painting-layout">
      <div className={`painting-view ${revealed ? 'is-revealed' : 'is-card'}`}>
        <div className="painting-mat">
          <div className={`painting-window zoom-${clue || 'none'}`}><img src={painting.original} alt={en ? `Source photograph ${painting.id}` : `原始图像 ${painting.id}`}/></div>
          {!revealed && <div className="card-face-label"><span>YITANG</span><b>{String(painting.index).padStart(2, '0')}</b></div>}
        </div>
        {revealed && <div className="painting-image-credit">{en ? 'SOURCE IMAGE' : '原始图像'} · {painting.id}.JPG</div>}
      </div>
      <div className="painting-notes">
        <span className="overline">{revealed ? (en ? 'LOOK / DECODE' : '细看 / 寻线索') : (en ? 'AN ENCOUNTER' : '一次相遇')}</span>
        <h1>{revealed ? (en ? <>Where does<br/><em>your eye go?</em></> : <>你会先看<br/><em>哪里？</em></>) : (en ? <>Look first.<br/><em>Name later.</em></> : <>先看画，<br/><em>暂时不认名字。</em></>)}</h1>
        {!revealed ? <>
          <p>{en ? 'This image came from a larger painted world. Begin with what you can actually see.' : '这张图来自更大的绘画世界。先从眼前真正看得见的东西开始。'}</p>
          <button className="paper-button" type="button" onClick={() => setRevealed(true)}><Eye size={17}/>{en ? 'Turn to the source image' : '翻到原画，找线索'}</button>
          <span className="microcopy">{en ? 'The image’s identity and historical interpretation need source verification.' : '人物身份与历史解释会在资料核对后补入。'}</span>
        </> : <>
          <p>{en ? 'Choose one detail to see what is painted and how it might be read.' : '选一个细节，看看画了什么、可能意味着什么。'}</p>
          <div className="clue-list">{(['head', 'hands', 'robe'] as const).map(key => <button key={key} className={clue === key ? 'active' : ''} aria-pressed={clue === key} type="button" onClick={() => setClue(clue === key ? null : key)}><span>{clueCopy[key][en ? 'en' : 'zh']}</span><small>↗</small></button>)}</div>
          <div className={`clue-response${selectedClue ? ' has-detail' : ''}`} aria-live="polite">{selectedClue && selectedReading ? <>
            <span className="clue-response-eyebrow">{en ? 'LOOK CLOSER / VISUAL READING' : '细看 / 图像释读'}</span>
            <h3>{selectedReading.title[en ? 'en' : 'zh']}</h3>
            <p className="clue-observation"><strong>{en ? 'What is visible' : '画中所见'}</strong>{selectedClue.observed[en ? 'en' : 'zh']}</p>
            <p className="clue-meaning"><strong>{en ? 'How to read it' : '如何理解'}</strong>{selectedReading.meaning[en ? 'en' : 'zh']}</p>
            <p className="clue-question">{clueCopy[clue!][en ? 'questionEn' : 'questionZh']}</p>
            <small className="clue-source">{en ? 'The observation comes from this painting. The comparative reading draws on Li Yuanguo and colleagues’ study of Shuilu paintings; the figure’s precise identity and the formal names of its objects still need verification.' : '画中所见来自这张原画；比较释读参考李远国等《水陆画图像研究》。人物身份与器物的正式名称仍待逐幅核对。'}</small>
          </> : (en ? 'Select a detail above to read more.' : '点击上方细节，查看画中所见与图像含义。')}</div>
          <label className="observer-note">{en ? 'What did you notice?' : '你刚才注意到了什么？'}<textarea value={note} onChange={event => { setNote(event.target.value); setSaved(false) }} placeholder={en ? 'A colour, an object, a question…' : '一种颜色、一个物件，或一个疑问……'} rows={3}/></label>
          <button className="save-observation" type="button" onClick={saveNote}>{saved ? (en ? 'Saved on this device ✓' : '已记在这台设备上 ✓') : (en ? 'Keep this observation' : '记下这个观察')}</button>
          <button className="reset-view" type="button" onClick={() => { setClue(null); setRevealed(false) }}><RotateCcw size={14}/>{en ? 'Back to card' : '回到卡面'}</button>
        </>}
        <div className="painting-next"><span>{en ? 'ANOTHER ENCOUNTER' : '下一次相遇'}</span><Link to="/card/$cardId" params={{ cardId: next.id }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{en ? 'See the next image' : '再看下一张'} <ArrowRight size={16}/></Link></div>
      </div>
    </div>
  </section>
}

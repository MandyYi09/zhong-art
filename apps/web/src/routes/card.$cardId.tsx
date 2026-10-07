import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Eye, RotateCcw, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DetailCrop } from '@/components/DetailCrop'
import { getDetailComparisons } from '@/lib/detailComparisons'
import { clueReadings, paintingClues, type ClueKey } from '@/lib/paintingClues'
import { discover, getPainting, paintings, type PaintingId } from '@/lib/paintings'
import { addToViewingPath, readViewingPath, updateViewingPathNote, type PathEntry } from '@/lib/viewingPath'

export const Route = createFileRoute('/card/$cardId')({
  validateSearch: (search: Record<string, unknown>): { detail?: ClueKey } =>
    search.detail === 'head' || search.detail === 'hands' || search.detail === 'robe' ? { detail: search.detail } : {},
  component: PaintingPage,
})

function PaintingPage() {
  const { cardId } = Route.useParams()
  const { detail } = Route.useSearch()
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  const painting = getPainting(cardId)
  const [revealed, setRevealed] = useState(false)
  const [clue, setClue] = useState<ClueKey | null>(null)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [comparedId, setComparedId] = useState<PaintingId | null>(null)
  const [pathEntries, setPathEntries] = useState<PathEntry[]>([])

  useEffect(() => {
    if (!painting) return
    discover(painting.id)
    setRevealed(!!detail)
    setClue(detail || null)
    setComparedId(null)
    setNote(localStorage.getItem(`yitang-note-${painting.id}`) || '')
    setSaved(false)
    setPathEntries(readViewingPath())
  }, [painting?.id, detail])

  if (!painting) return <section className="painting-not-found"><p>{en ? 'This image is not in the atlas.' : '画册里没有这张图。'}</p><Link to="/collection">{en ? 'Open the atlas' : '打开画册'}</Link></section>
  const next = paintings[painting.index % paintings.length]
  const clueCopy: Record<ClueKey, { zh: string; en: string }> = {
    head: { zh: '看头冠', en: 'Headwear' },
    hands: { zh: '看手中', en: 'Held object' },
    robe: { zh: '看衣纹', en: 'Garment' },
  }
  const selectedClue = clue ? paintingClues[painting.id][clue] : null
  const selectedReading = selectedClue ? clueReadings[selectedClue.motif] : null
  const comparisons = clue ? getDetailComparisons(painting.id, clue) : []
  const compared = comparisons.find(item => item.painting.id === comparedId)
  const inPath = clue && pathEntries.some(entry => entry.paintingId === painting.id && entry.clue === clue)
  const addDetail = () => { if (clue) setPathEntries(addToViewingPath({ paintingId: painting.id, clue, note: note.trim() })) }
  const addPair = () => { if (clue && compared) setPathEntries(addToViewingPath({ paintingId: painting.id, clue, note: note.trim() }, { paintingId: compared.painting.id, clue })) }
  const saveNote = () => { localStorage.setItem(`yitang-note-${painting.id}`, note); if (clue) setPathEntries(updateViewingPathNote(painting.id, clue, note)); setSaved(true) }

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
          <div className="clue-list">{(['head', 'hands', 'robe'] as const).map(key => <button key={key} className={clue === key ? 'active' : ''} aria-pressed={clue === key} type="button" onClick={() => { setClue(clue === key ? null : key); setComparedId(null) }}><span>{clueCopy[key][en ? 'en' : 'zh']}</span><small>↗</small></button>)}</div>
          <div className={`clue-response${selectedClue ? ' has-detail' : ''}`} aria-live="polite">{selectedClue && selectedReading ? <>
            <span className="clue-response-eyebrow">{en ? 'LOOK CLOSER / VISUAL READING' : '细看 / 图像释读'}</span>
            <h3>{selectedReading.title[en ? 'en' : 'zh']}</h3>
            <p className="clue-observation"><strong>{en ? 'What is visible' : '画中所见'}</strong>{selectedClue.observed[en ? 'en' : 'zh']}</p>
            <p className="clue-meaning"><strong>{en ? 'How to read it' : '如何理解'}</strong>{selectedReading.meaning[en ? 'en' : 'zh']}</p>
          </> : (en ? 'Select a detail above to read more.' : '点击上方细节，查看画中所见与图像含义。')}</div>
          {clue && selectedReading && <>
            <div className="detail-keep-row"><button type="button" className="detail-keep" aria-pressed={!!inPath} onClick={addDetail}><Plus size={15}/>{inPath ? (en ? 'Kept in your path' : '已收进观看路径') : (en ? 'Keep this detail' : '留住这个细节')}</button><Link to="/path">{en ? 'Open my path →' : '打开我的路径 →'}</Link></div>
            <section className="comparison-section" aria-label={en ? 'Compare details' : '对照细节'}>
              <span className="overline">{en ? 'FOLLOW THE DETAIL' : '顺着细节继续看'}</span>
              <h2>{en ? 'How does it appear elsewhere?' : '别的画，怎么画这个细节？'}</h2>
              <div className="comparison-choices">{comparisons.map(item => {
                const detail = paintingClues[item.painting.id][clue]
                return <button key={item.painting.id} type="button" className={`comparison-choice${comparedId === item.painting.id ? ' is-selected' : ''}`} aria-pressed={comparedId === item.painting.id} onClick={() => setComparedId(comparedId === item.painting.id ? null : item.painting.id)}>
                  <DetailCrop painting={item.painting} clue={clue} label={en ? `Detail of image ${item.painting.index}` : `第 ${item.painting.index} 幅的局部`}/>
                  <span><small>{item.relation === 'echo' ? (en ? 'A VISUAL ECHO' : '相近的造型') : (en ? 'A DIFFERENT TREATMENT' : '不同的画法')}</small><strong>{en ? `Image ${String(item.painting.index).padStart(2, '0')}` : `第 ${String(item.painting.index).padStart(2, '0')} 幅`}</strong><em>{clueReadings[detail.motif].title[en ? 'en' : 'zh']}</em></span>
                </button>
              })}</div>
              {compared && <div className="comparison-open" aria-live="polite">
                <div className="comparison-pair">
                  {[painting, compared.painting].map(item => <figure key={item.id}><DetailCrop painting={item} clue={clue} label={en ? `Image ${item.index}, ${clueCopy[clue].en}` : `第 ${item.index} 幅，${clueCopy[clue].zh}`}/><figcaption><strong>{en ? `Image ${String(item.index).padStart(2, '0')}` : `第 ${String(item.index).padStart(2, '0')} 幅`}</strong><span>{paintingClues[item.id][clue].observed[en ? 'en' : 'zh']}</span></figcaption></figure>)}
                </div>
                <button className="comparison-keep" type="button" onClick={addPair}>{en ? 'Keep both details in my path' : '把这一对留在我的路径'} <ArrowRight size={15}/></button>
              </div>}
            </section>
          </>}
          <label className="observer-note">{en ? 'What did you notice?' : '你刚才注意到了什么？'}<textarea value={note} onChange={event => { setNote(event.target.value); setSaved(false) }} placeholder={en ? 'A colour, an object, a question…' : '一种颜色、一个物件，或一个疑问……'} rows={3}/></label>
          <button className="save-observation" type="button" onClick={saveNote}>{saved ? (en ? 'Saved on this device ✓' : '已记在这台设备上 ✓') : (en ? 'Keep this observation' : '记下这个观察')}</button>
          <button className="reset-view" type="button" onClick={() => { setClue(null); setRevealed(false) }}><RotateCcw size={14}/>{en ? 'Back to card' : '回到卡面'}</button>
        </>}
        <div className="painting-next"><span>{en ? 'ANOTHER ENCOUNTER' : '下一次相遇'}</span><Link to="/card/$cardId" params={{ cardId: next.id }} search={{ detail: undefined }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{en ? 'See the next image' : '再看下一张'} <ArrowRight size={16}/></Link></div>
      </div>
    </div>
  </section>
}

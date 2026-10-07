import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DetailCrop } from '@/components/DetailCrop'
import { clueReadings, paintingClues } from '@/lib/paintingClues'
import { getPainting } from '@/lib/paintings'
import { readViewingPath, removeFromViewingPath, type PathEntry } from '@/lib/viewingPath'

export const Route = createFileRoute('/path')({ component: ViewingPathPage })

function ViewingPathPage() {
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  const [entries, setEntries] = useState<PathEntry[]>([])

  useEffect(() => { setEntries(readViewingPath()) }, [])

  return <section className="viewing-path-page">
    <div className="path-topline"><Link to="/collection" className="return-link"><ArrowLeft size={15}/>{en ? 'Back to the atlas' : '回到画册'}</Link><span>{en ? 'YOUR WAY OF SEEING' : '你的观看方式'}</span></div>
    <header className="path-heading"><span className="overline">{en ? 'A PATH THROUGH THE PAINTINGS' : '从一处细节，走向另一处'}</span><h1>{en ? <>The details<br/><em>you followed.</em></> : <>你留下的<br/><em>观看路径。</em></>}</h1><p>{en ? 'Every detail you kept is one turn in your journey through these paintings. Return to an image, compare it with another, or carry it into a new composition.' : '每次留住一个细节，画与画之间就多了一条属于你的线索。你可以回到原画，也可以带着它进入重新构图。'}</p></header>
    {entries.length === 0 ? <div className="path-empty"><span>✧</span><h2>{en ? 'Your path begins with a detail.' : '从一个细节开始。'}</h2><p>{en ? 'Open any source painting, choose headwear, an object or a garment, then keep the detail that stays with you.' : '打开任意一张原画，看看头冠、持物或衣纹，把你想继续追看的细节留在这里。'}</p><Link to="/collection" className="paper-button">{en ? 'Explore the atlas' : '去原画画册看看'} <ArrowRight size={15}/></Link></div> : <>
      <div className="path-count"><span>{String(entries.length).padStart(2, '0')}</span>{en ? 'details kept · arranged in the order you found them' : '处细节 · 按你发现的顺序排列'}</div>
      <div className="path-trail">{entries.map((entry, index) => {
        const painting = getPainting(entry.paintingId)
        if (!painting) return null
        const detail = paintingClues[entry.paintingId][entry.clue]
        const reading = clueReadings[detail.motif]
        const note = entry.note
        return <article className="path-stop" key={`${entry.paintingId}-${entry.clue}`}>
          <div className="path-stop-number">{String(index + 1).padStart(2, '0')}<i/></div>
          <DetailCrop painting={painting} clue={entry.clue} label={en ? `Detail from image ${painting.index}` : `第 ${painting.index} 幅的细节`}/>
          <div className="path-stop-copy"><span className="overline">{en ? `IMAGE ${String(painting.index).padStart(2, '0')} · ${entry.clue.toUpperCase()}` : `第 ${String(painting.index).padStart(2, '0')} 幅 · ${entry.clue === 'head' ? '头冠' : entry.clue === 'hands' ? '持物' : '衣纹'}`}</span><h2>{reading.title[en ? 'en' : 'zh']}</h2><p>{detail.observed[en ? 'en' : 'zh']}</p>{note && <blockquote>“{note}”</blockquote>}<div className="path-stop-actions"><Link to="/card/$cardId" params={{ cardId: painting.id }} search={{ detail: entry.clue }}>{en ? 'View source' : '看原画'} ↗</Link><Link to="/create" search={{ from: painting.id, focus: entry.clue }}>{en ? 'Compose from here' : '带入重新构图'} →</Link></div></div>
          <button className="path-remove" type="button" onClick={() => setEntries(removeFromViewingPath(entry))} aria-label={en ? `Remove image ${painting.index} detail from path` : `从路径移除第 ${painting.index} 幅的细节`}><X size={14}/></button>
        </article>
      })}</div>
    </>}
  </section>
}

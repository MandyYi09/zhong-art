import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getDiscovered, paintings } from '@/lib/paintings'

export const Route = createFileRoute('/collection')({ component: CollectionPage })

function CollectionPage() {
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  const [seen, setSeen] = useState<string[]>([])
  const [onlySeen, setOnlySeen] = useState(false)
  useEffect(() => { setSeen(getDiscovered()) }, [])
  const visible = onlySeen ? paintings.filter(painting => seen.includes(painting.id)) : paintings

  return <section className="atlas-page">
    <div className="atlas-topline"><Link to="/" className="return-link"><ArrowLeft size={15}/>{en ? 'Back to the painting' : '回到画前'}</Link><span>ARCHIVE / 20</span></div>
    <div className="atlas-heading"><span className="overline">{en ? 'THE ATLAS' : '画册'}</span><h1>{en ? <>You do not need to<br/><em>know the names first.</em></> : <>先看见，<br/><em>再慢慢认识。</em></>}</h1><p>{en ? 'Choose what catches your eye. The portraits are arranged as they came to us, before interpretation.' : '凭直觉选一张。先看看人物，再试着找出让你停下来的细节。'}</p></div>
    <div className="atlas-controls"><span>{en ? `${seen.length} of 20 seen` : `已看过 ${seen.length} / 20 幅`}</span><button type="button" className={onlySeen ? 'filter-active' : ''} onClick={() => setOnlySeen(value => !value)}>{onlySeen ? (en ? 'Show all' : '查看全部') : (en ? 'Show my encounters' : '只看遇见过的')}</button></div>
    {visible.length ? <div className="atlas-wall">{visible.map((painting, index) => <Link key={painting.id} className={`atlas-sheet sheet-${index % 5}`} to="/card/$cardId" params={{ cardId: painting.id }}>
      <span className="sheet-image"><img src={painting.thumbnail} alt={en ? `Water-and-Land painting ${painting.id}` : `水陆画图像 ${painting.id}`} loading="lazy"/></span>
      <span className="sheet-caption"><span>NO. {String(painting.index).padStart(2, '0')} <small>/ {painting.id}</small></span><ArrowUpRight size={17}/></span>
      {seen.includes(painting.id) && <i className="seen-mark" aria-label={en ? 'Viewed' : '已看过'}>✓</i>}
    </Link>)}</div> : <div className="atlas-empty">{en ? 'Your encounters will appear here. The entire atlas is still open.' : '你遇见过的画会出现在这里。完整画册随时开放。'}</div>}
    <div className="atlas-colophon">{en ? 'Twenty source images. Every interpretation begins by looking.' : '二十幅原始图像。每一次理解，都从仔细看开始。'}</div>
  </section>
}

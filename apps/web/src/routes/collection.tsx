import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
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
    <header className="feature-heading"><h1>{en ? 'Painting atlas' : '原画图集'}</h1></header>
    <div className="atlas-controls"><span>{en ? `${paintings.filter(painting => seen.includes(painting.id)).length} of ${paintings.length} seen` : `已看过 ${paintings.filter(painting => seen.includes(painting.id)).length} / ${paintings.length} 幅`}</span><button type="button" className={onlySeen ? 'filter-active' : ''} onClick={() => setOnlySeen(value => !value)}>{onlySeen ? (en ? 'Show all' : '查看全部') : (en ? 'Show my encounters' : '只看遇见过的')}</button></div>
    {visible.length ? <div className="atlas-wall">{visible.map((painting, index) => <Link key={painting.id} className={`atlas-sheet sheet-${index % 5}`} to="/card/$cardId" params={{ cardId: painting.id }}>
      <span className="sheet-image"><img decoding="async" src={painting.thumbnail} alt={en ? `Shuilu painting ${painting.id}` : `水陆画图像 ${painting.id}`} loading="lazy"/></span>
      <span className="sheet-identity"><strong>{painting.identity.name[en ? 'en' : 'zh']}</strong><small>{painting.identity.date[en ? 'en' : 'zh']}</small><small>{en ? 'Source: ' : '出处：'}{painting.identity.source[en ? 'en' : 'zh']}</small></span>
      <span className="sheet-caption"><span>NO. {String(painting.index).padStart(2, '0')} <small>· {painting.edition === 'hidden' ? (en ? 'SECRET' : '隐藏款') : (en ? 'REGULAR' : '常规款')}</small></span><ArrowUpRight size={17}/></span>
      {seen.includes(painting.id) && <i className="seen-mark" aria-label={en ? 'Viewed' : '已看过'}>✓</i>}
    </Link>)}</div> : <div className="atlas-empty">{en ? 'Your encounters will appear here. The entire atlas is still open.' : '你遇见过的画会出现在这里。完整画册随时开放。'}</div>}
    <div className="atlas-colophon">{en ? `${paintings.length} unique paintings. Every interpretation begins by looking.` : `${paintings.length} 幅不同的画。每一次理解，都从仔细看开始。`}</div>
  </section>
}

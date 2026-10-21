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
    <div className="atlas-topline"><Link to="/" className="return-link"><ArrowLeft size={15}/>{en ? 'Back to the painting' : '回到画前'}</Link><span>ARCHIVE / {paintings.length}</span></div>
    <div className="atlas-heading"><span className="overline">{en ? 'THE SHUILU COLLECTION' : '水陆画典藏系列'}</span><h1>{en ? <>Collect the art.<br/><em>Carry the story.</em></> : <>方寸典藏，<br/><em>中华意韵。</em></>}</h1><p>{en ? 'Explore the complete collection. Discover each figure, trace its details to the source painting, and find the stories you want to keep close.' : '选一张吸引你的画。每幅都会先展开一处细节，带着解释和生活里的类比，让你从看见走向理解。'}</p><p className="edition-summary">{en ? '20 regular cards + 1 secret card. Only the playful blue-robed figure uses the E back.' : '20 张常规款 ＋ 1 张隐藏款。只有新增的蓝袍趣味角色使用 E 隐藏款卡背。'}</p><Link className="guide-invitation" to="/draw">{en ? 'Not sure where to start? Draw a card and follow its clues →' : '不知道从哪开始？先抽一张卡，跟着线索探索 →'}</Link></div>
    <div className="atlas-controls"><span>{en ? `${paintings.filter(painting => seen.includes(painting.id)).length} of ${paintings.length} seen` : `已看过 ${paintings.filter(painting => seen.includes(painting.id)).length} / ${paintings.length} 幅`}</span><button type="button" className={onlySeen ? 'filter-active' : ''} onClick={() => setOnlySeen(value => !value)}>{onlySeen ? (en ? 'Show all' : '查看全部') : (en ? 'Show my encounters' : '只看遇见过的')}</button></div>
    {visible.length ? <div className="atlas-wall">{visible.map((painting, index) => <Link key={painting.id} className={`atlas-sheet sheet-${index % 5}`} to="/card/$cardId" params={{ cardId: painting.id }}>
      <span className="sheet-image"><img src={painting.thumbnail} alt={en ? `Shuilu painting ${painting.id}` : `水陆画图像 ${painting.id}`} loading="lazy"/></span>
      <span className="sheet-identity"><strong>{painting.identity.name[en ? 'en' : 'zh']}</strong><small>{painting.identity.date[en ? 'en' : 'zh']}</small></span>
      <span className="sheet-caption"><span>NO. {String(painting.index).padStart(2, '0')} <small>· {painting.edition === 'hidden' ? (en ? 'SECRET' : '隐藏款') : (en ? 'REGULAR' : '常规款')}</small></span><ArrowUpRight size={17}/></span>
      {seen.includes(painting.id) && <i className="seen-mark" aria-label={en ? 'Viewed' : '已看过'}>✓</i>}
    </Link>)}</div> : <div className="atlas-empty">{en ? 'Your encounters will appear here. The entire atlas is still open.' : '你遇见过的画会出现在这里。完整画册随时开放。'}</div>}
    <div className="atlas-colophon">{en ? 'Twenty-one source images. Every interpretation begins by looking.' : '二十一幅原始图像。每一次理解，都从仔细看开始。'}</div>
  </section>
}

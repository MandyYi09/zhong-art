import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { GuardianGallery } from '@/components/GuardianGallery'
import { paintings } from '@/lib/paintings'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  const featured = [paintings[0], paintings[8], paintings[16]]
  return <div className="collector-home">
    <section className="collector-hero">
      <div className="hero-story"><p className="heritage-eyebrow">ZHONG ART / {en ? 'THE SHUILU COLLECTION' : '水陆画典藏系列'}</p>
        <h1>{en ? <>A collection.<br/>A connection.<br/><em>A part of you.</em></> : <>收藏一张卡，<br/>重逢一段历史，<br/><em>寻回一份认同。</em></>}</h1>
        <p className="hero-description">{en ? 'Collectible art cards rooted in Chinese heritage. Meet the figures of Shuilu painting, discover the stories behind them, and reconnect with a culture worth carrying forward.' : '以中华传统文化为灵感的艺术收藏卡。从水陆画中的人物出发，收藏图像，读懂故事，让与祖辈相连的文化记忆，在今天延续。'}</p>
        <div className="hero-links"><Link to="/collection" className="vermilion-button">{en ? 'Explore the collection' : '探索典藏系列'}<ArrowRight size={16}/></Link><Link to="/draw" className="ink-link">{en ? 'Discover your daily card' : '揭晓今日卡片'} ↗</Link></div>
        <p className="hero-footnote">{en ? '20 regular editions · 1 secret edition · countless connections' : '20 张常规款 · 1 张隐藏款 · 与文化的万千连接'}</p>
      </div>
      <div className="hero-cards" aria-label={en ? 'A selection of Shuilu art cards' : '水陆艺术卡精选'}><span className="hero-ring" aria-hidden="true"/><span className="vertical-inscription" aria-hidden="true">溯源 · 传承 · 珍藏</span>{featured.map((p, i) => <Link to="/card/$cardId" params={{cardId:p.id}} className={`hero-art-card card-position-${i}`} key={p.id}><span>水陆 · {String(p.index).padStart(2,'0')}</span><img src={p.character} alt={p.identity.name[en ? 'en' : 'zh']}/><small>{p.identity.name[en ? 'en' : 'zh']}</small></Link>)}<span className="collection-stamp" aria-hidden="true">藏<br/>珍</span></div>
    </section>
    <div className="heritage-ribbon"><span>中华意韵</span><p>{en ? 'ROOTED IN HISTORY. COLLECTED FOR TODAY.' : '以历史为根，以收藏相连。'}</p><span>方寸典藏</span></div>
    <section className="heritage-interactive"><div className="section-heading"><div><p className="heritage-eyebrow">01 / {en ? 'ENTER THE WORLD' : '走入画境'}</p><h2>{en ? 'Before the card, there was a world.' : '卡片之外，是一整个画中世界。'}</h2></div><p>{en ? 'Move a figure. Part the clouds. Meet the world that inspires the collection.' : '移动人物，拨开云层。亲手探索这套收藏卡的灵感世界。'}</p></div><div className="living-painting"><GuardianGallery/><span className="living-corner living-corner-left" aria-hidden="true"/><span className="living-corner living-corner-right" aria-hidden="true"/></div></section>
    <section className="collector-edit"><div className="section-heading"><div><p className="heritage-eyebrow">02 / {en ? 'THE COLLECTOR’S EDIT' : '典藏之选'}</p><h2>{en ? 'Every figure has a story.' : '每一位人物，都有值得珍藏的故事。'}</h2></div><Link to="/collection" className="ink-link">{en ? 'View all 21 cards' : '查看全部 21 张卡片'} <ArrowUpRight size={16}/></Link></div><div className="collector-products">{featured.map(p => <Link to="/card/$cardId" params={{cardId:p.id}} key={p.id} className="collector-product"><div className="product-art"><span>NO. {String(p.index).padStart(2,'0')}</span><img src={p.character} alt={p.identity.name[en ? 'en' : 'zh']} loading="lazy"/></div><div className="product-title"><h3>{p.identity.name[en ? 'en' : 'zh']}</h3><ArrowUpRight size={20}/></div><p>{en ? 'Shuilu Collection / Regular edition' : '水陆画典藏系列 / 常规款'}</p></Link>)}</div><p className="availability-note">{en ? 'Explore the digital collection today. Physical-card ordering is not yet available.' : '即刻探索数字图录。实体卡订购暂未开放。'}</p></section>
    <section className="heritage-manifesto"><div className="manifesto-mark" aria-hidden="true">承</div><div><p className="heritage-eyebrow">03 / {en ? 'OUR REASON FOR COLLECTING' : '为何收藏'}</p><h2>{en ? <>More than something to keep.<br/><em>Something to belong to.</em></> : <>珍藏的不只是卡片，<br/><em>更是一份文化归属。</em></>}</h2><p>{en ? 'A familiar robe. An intricate crown. A gesture that reaches across generations. Zhong Art brings the visual language of Chinese tradition into a personal collection, inviting you to reconnect with your ancestry—or discover these stories for the first time.' : '一袭衣袍，一顶华冠，一个跨越时光的姿态。Zhong Art 将中华传统的视觉语言融入个人收藏，让你与祖辈的文化重新相遇，也欢迎每一位初次走近这些故事的人。'}</p><Link to="/draw" className="vermilion-button">{en ? 'Begin your collecting ritual' : '开启你的收藏日常'}<ArrowRight size={16}/></Link></div></section>
    <section className="collector-ritual"><article><span>壹 / 01</span><h3>{en ? 'Discover' : '遇见'}</h3><p>{en ? 'Reveal a daily card and meet a figure from the collection.' : '翻开每日卡片，遇见典藏系列中的人物。'}</p></article><article><span>贰 / 02</span><h3>{en ? 'Reconnect' : '溯源'}</h3><p>{en ? 'Follow its details back to the source painting and its cultural context.' : '循着细节回到原画，了解图像背后的文化语境。'}</p></article><article><span>叁 / 03</span><h3>{en ? 'Make it personal' : '珍藏'}</h3><p>{en ? 'Keep the details that speak to you in your journal, saved on this device.' : '将触动你的细节留在收藏手记中，保存在当前设备。'}</p></article></section>
  </div>
}

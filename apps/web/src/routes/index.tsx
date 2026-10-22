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
    <section className="heritage-interactive"><div className="section-heading"><div><p className="heritage-eyebrow">01 / {en ? 'ENTER THE WORLD' : '走入画境'}</p><h1>{en ? 'Before the card, there was a world.' : '卡片之外，是一整个画中世界。'}</h1></div><p>{en ? 'Move a figure. Part the clouds. Meet the world that inspires the collection.' : '移动人物，拨开云层。亲手探索这套收藏卡的灵感世界。'}</p></div><div className="living-painting"><GuardianGallery/><span className="living-corner living-corner-left" aria-hidden="true"/><span className="living-corner living-corner-right" aria-hidden="true"/></div></section>
    <section className="collector-edit"><div className="section-heading"><div><p className="heritage-eyebrow">02 / {en ? 'THE COLLECTOR’S EDIT' : '典藏之选'}</p><h2>{en ? 'Every figure has a story.' : '每一位人物，都有值得珍藏的故事。'}</h2></div><Link to="/collection" className="ink-link">{en ? 'View all 21 cards' : '查看全部 21 张卡片'} <ArrowUpRight size={16}/></Link></div><div className="collector-products">{featured.map(p => <Link to="/card/$cardId" params={{cardId:p.id}} key={p.id} className="collector-product"><div className="product-art"><span>NO. {String(p.index).padStart(2,'0')}</span><img decoding="async" src={p.character} alt={p.identity.name[en ? 'en' : 'zh']} loading="lazy"/></div><div className="product-title"><h3>{p.identity.name[en ? 'en' : 'zh']}</h3><ArrowUpRight size={20}/></div><p>{en ? 'Shuilu Collection / Regular edition' : '水陆画典藏系列 / 常规款'}</p></Link>)}</div><p className="availability-note">{en ? 'Explore the digital collection today. Physical-card ordering is not yet available.' : '即刻探索数字图录。实体卡订购暂未开放。'}</p></section>
    <section className="heritage-manifesto"><div className="manifesto-mark" aria-hidden="true">承</div><div><p className="heritage-eyebrow">03 / {en ? 'OUR REASON FOR COLLECTING' : '为何收藏'}</p><h2>{en ? <>More than something to keep.<br/><em>Something to belong to.</em></> : <>珍藏的不只是卡片，<br/><em>更是一份文化归属。</em></>}</h2><p>{en ? 'A familiar robe. An intricate crown. A gesture that reaches across generations. Modern Shuilu brings the visual language of Chinese tradition into a personal collection, inviting you to reconnect with your ancestry—or discover these stories for the first time.' : '一袭衣袍，一顶华冠，一个跨越时光的姿态。Modern Shuilu 将中华传统的视觉语言融入个人收藏，让你与祖辈的文化重新相遇，也欢迎每一位初次走近这些故事的人。'}</p><Link to="/draw" className="vermilion-button">{en ? 'Begin your collecting ritual' : '开启你的收藏日常'}<ArrowRight size={16}/></Link></div></section>
    <section className="collector-ritual"><article><span>壹 / 01</span><h3>{en ? 'Discover' : '遇见'}</h3><p>{en ? 'Reveal a daily card and meet a figure from the collection.' : '翻开每日卡片，遇见典藏系列中的人物。'}</p></article><article><span>贰 / 02</span><h3>{en ? 'Reconnect' : '溯源'}</h3><p>{en ? 'Follow its details back to the source painting and its cultural context.' : '循着细节回到原画，了解图像背后的文化语境。'}</p></article><article><span>叁 / 03</span><h3>{en ? 'Make it personal' : '珍藏'}</h3><p>{en ? 'Keep the details that speak to you in your journal, saved on this device.' : '将触动你的细节留在收藏手记中，保存在当前设备。'}</p></article></section>
  </div>
}

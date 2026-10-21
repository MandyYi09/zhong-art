import { Link, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()
  const pathname = useLocation({ select: location => location.pathname })
  const en = i18n.language === 'en'
  useEffect(() => { document.documentElement.lang = en ? 'en' : 'zh-Hant' }, [en])
  const toggleLanguage = () => {
    const next = en ? 'zh-TW' : 'en'
    void i18n.changeLanguage(next)
  }
  const navigation = [
    { to: '/' as const, zh: '首页', en: 'Home', shortEn: 'Home', active: pathname === '/' },
    { to: '/draw' as const, zh: '每日抽卡', en: 'Daily Draw', shortEn: 'Draw', active: pathname === '/draw' },
    { to: '/collection' as const, zh: '典藏图录', en: 'The Collection', shortEn: 'Collection', active: pathname === '/collection' || pathname.startsWith('/card/') },
    { to: '/path' as const, zh: '收藏手记', en: 'Collector’s Journal', shortEn: 'Journal', active: pathname === '/path' },
    { to: '/create' as const, zh: '创作工坊', en: 'Studio', shortEn: 'Studio', active: pathname === '/create' },
  ]

  return <div className="app-shell">
    <header className="collector-header"><Link to="/" className="collector-brand" aria-label="Modern Shuilu home"><span>Modern Shuilu<small>中华意韵 · 藏于方寸</small></span></Link><button className="language-button" type="button" onClick={toggleLanguage} aria-label={en ? 'Switch to Chinese' : 'Switch to English'} title={en ? 'Switch to Chinese' : '切換至英文'}><span className={en ? 'is-current' : undefined} aria-hidden="true">EN</span><span className="language-divider" aria-hidden="true">/</span><span className={!en ? 'is-current' : undefined} aria-hidden="true">中</span></button>
    <nav className="collector-nav" aria-label={en ? 'Main navigation' : '主导航'}>
      {navigation.map(item => <Link key={item.to} to={item.to} className={`collector-nav-link${item.active ? ' is-active' : ''}`} aria-current={item.active ? 'page' : undefined}><span className="nav-full-label">{en ? item.en : item.zh}</span><span className="nav-mobile-label">{en ? item.shortEn : item.zh}</span></Link>)}
    </nav></header>
    <main>{children}</main>
    <footer className="site-footer"><span className="footer-note">{en ? 'Modern Shuilu · Collect the art. Carry the story.' : 'Modern Shuilu · 收藏艺术，传承故事。'}</span><span>{en ? 'Chinese heritage, held close.' : '方寸之间，重逢中华文脉。'}</span></footer>
  </div>
}

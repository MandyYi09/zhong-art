import { Link, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()
  const pathname = useLocation({ select: location => location.pathname })
  const en = i18n.language === 'en'
  useEffect(() => { document.documentElement.lang = en ? 'en' : 'zh-Hans' }, [en])
  const toggleLanguage = () => {
    const next = en ? 'zh-TW' : 'en'
    void i18n.changeLanguage(next)
    localStorage.setItem('zhong-locale', next)
  }
  const navigation = [
    { to: '/' as const, zh: '首页', en: 'Home', shortEn: 'Home', active: pathname === '/' },
    { to: '/draw' as const, zh: '每日抽卡', en: 'Daily Draw', shortEn: 'Draw', active: pathname === '/draw' },
    { to: '/collection' as const, zh: '原画画册', en: 'Atlas', shortEn: 'Atlas', active: pathname === '/collection' || pathname.startsWith('/card/') },
    { to: '/create' as const, zh: '重新构图', en: 'Compose', shortEn: 'Compose', active: pathname === '/create' },
    { to: '/about' as const, zh: '关于作品', en: 'About', shortEn: 'About', active: pathname === '/about' },
  ]

  return <div className="app-shell">
    <header className="site-header">
      <Link to="/" className="wordmark" aria-label={en ? 'Yitang, home' : '吉光，首页'}>
        <span className="wordmark-seal">吉</span><span>YITANG <small>水陆画的另一种看法</small></span>
      </Link>
      <nav className="site-nav" aria-label={en ? 'Main navigation' : '主导航'}>
        {navigation.map(item => <Link key={item.to} to={item.to} className={`site-nav-link${item.active ? ' is-active' : ''}`} aria-current={item.active ? 'page' : undefined}><span className="nav-full-label">{en ? item.en : item.zh}</span><span className="nav-mobile-label">{en ? item.shortEn : item.zh}</span></Link>)}
      </nav>
      <button className="language-button" type="button" onClick={toggleLanguage} aria-label={en ? 'Switch to Chinese' : 'Switch to English'}>{en ? '中' : 'EN'}</button>
    </header>
    <main>{children}</main>
    <footer className="site-footer"><span>YITANG · 2026</span><span>{en ? 'A way into Water-and-Land paintings' : '从一张画，开始看'}</span></footer>
  </div>
}

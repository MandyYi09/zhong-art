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
    { to: '/collection' as const, zh: '原画画册', en: 'Atlas', shortEn: 'Atlas', active: pathname === '/collection' || pathname.startsWith('/card/') },
    { to: '/create' as const, zh: '重新构图', en: 'Compose', shortEn: 'Compose', active: pathname === '/create' },
  ]

  return <div className="app-shell">
    <button className="language-button floating-language" type="button" onClick={toggleLanguage} aria-label={en ? 'Switch to Chinese' : 'Switch to English'} title={en ? 'Switch to Chinese' : '切換至英文'}><span className={!en ? 'is-current' : undefined} aria-hidden="true">中</span><span className="language-divider" aria-hidden="true">/</span><span className={en ? 'is-current' : undefined} aria-hidden="true">EN</span></button>
    <nav className="page-dock" aria-label={en ? 'Main navigation' : '主导航'}>
      {navigation.map(item => <Link key={item.to} to={item.to} className={`page-dock-link${item.active ? ' is-active' : ''}`} aria-current={item.active ? 'page' : undefined}><span className="nav-full-label">{en ? item.en : item.zh}</span><span className="nav-mobile-label">{en ? item.shortEn : item.zh}</span></Link>)}
    </nav>
    <main>{children}</main>
    <footer className="site-footer"><span className="footer-note">{en ? 'A way into Water-and-Land paintings' : '从一张画，开始看'}</span></footer>
  </div>
}

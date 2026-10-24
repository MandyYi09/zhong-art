import { GarmentOrnament } from './GarmentOrnament'
import { Link, useLocation } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()
  const pathname = useLocation({ select: location => location.pathname })
  const [introOpen, setIntroOpen] = useState(false)
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
    { to: '/path' as const, zh: '我的路径', en: 'My Path', shortEn: 'Path', active: pathname === '/path' },
    { to: '/create' as const, zh: '重新构图', en: 'Compose', shortEn: 'Compose', active: pathname === '/create' },
  ]

  return <div className="app-shell">
    <header className="navigation-bar">
    <nav className="page-dock" aria-label={en ? 'Main navigation' : '主导航'}>
      {navigation.map(item => <Link key={item.to} to={item.to} className={`page-dock-link${item.active ? ' is-active' : ''}`} aria-current={item.active ? 'page' : undefined}><span className="nav-full-label">{en ? item.en : item.zh}</span><span className="nav-mobile-label">{en ? item.shortEn : item.zh}</span></Link>)}
    </nav>
    <div className="navbar-utilities">
    <button type="button" className="intro-trigger" aria-haspopup="dialog" onClick={() => setIntroOpen(true)}>{en ? 'New here?' : '初次来访？'}</button>
    <button className="language-button navbar-language" type="button" onClick={toggleLanguage} aria-label={en ? 'Switch to Chinese' : 'Switch to English'} title={en ? 'Switch to Chinese' : '切換至英文'}><span className={en ? 'is-current' : undefined} aria-hidden="true">EN</span><span className="language-divider" aria-hidden="true">/</span><span className={!en ? 'is-current' : undefined} aria-hidden="true">中</span></button>
    </div>
    </header>
    {introOpen && <SiteIntroduction en={en} onClose={() => setIntroOpen(false)}/>}
    <main><div className="page-ribbon"><GarmentOrnament/></div>{children}<div className="page-hem"><GarmentOrnament variant="hem"/></div></main>
    <footer className="site-footer"><span className="footer-note">{en ? 'A way into Shuilu paintings' : '从一张画，开始看'}</span></footer>
  </div>
}

function SiteIntroduction({ en, onClose }: { en: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    dialog.current?.showModal()
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow; previousFocus?.focus() }
  }, [])
  return <dialog ref={dialog} className="site-introduction" aria-labelledby="site-introduction-title" onCancel={event => { event.preventDefault(); onClose() }} onClick={event => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) onClose() } }}>
    <button type="button" className="intro-close" onClick={onClose} aria-label={en ? 'Close introduction' : '关闭介绍'}>×</button>
    <span className="overline">MODERN SHUILU</span>
    <h2 id="site-introduction-title">{en ? 'A small discovery in an old painting.' : '从一张卡，走近一幅画。'}</h2>
    <p>{en ? 'Modern Shuilu is a place to explore Shuilu paintings through illustrated characters and details. You do not need any art history knowledge to begin.' : '这里用插画角色和画中细节，带你轻松认识水陆画。不需要古画知识，从喜欢的形象开始就好。'}</p>
    <ul>
      <li><strong>{en ? 'Draw a card' : '抽一张卡'}</strong><span>{en ? 'Meet today’s character and follow a clue back to its source.' : '遇见今天的角色，跟着线索找到它来自的原画。'}</span></li>
      <li><strong>{en ? 'Browse the atlas' : '逛逛图集'}</strong><span>{en ? 'Look closer at the paintings and save details to your path.' : '细看原画，把喜欢的细节留在「我的路径」。'}</span></li>
      <li><strong>{en ? 'Make a wallpaper' : '做张壁纸'}</strong><span>{en ? 'Choose an image, arrange it your way, and download it.' : '选一张原画或角色，自由调整构图，下载自己的壁纸。'}</span></li>
    </ul>
    <button type="button" className="paper-button" onClick={onClose}>{en ? 'Start exploring' : '开始逛逛'} →</button>
  </dialog>
}

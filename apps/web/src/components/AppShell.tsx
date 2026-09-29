import { Link, useRouterState } from '@tanstack/react-router'
import { BookHeart, Box, Languages, Menu, Sparkles, UserRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getKeycloak, initializeAuth } from '@/lib/auth'
import { Button } from './ui'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation()
  const path = useRouterState({ select: (state) => state.location.pathname })
  const [open, setOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  useEffect(() => { initializeAuth().then(setAuthenticated).catch(() => setAuthenticated(false)) }, [])
  useEffect(() => { document.documentElement.lang = i18n.language === 'en' ? 'en' : 'zh-Hant' }, [i18n.language])
  const toggleLanguage = () => { const next = i18n.language === 'en' ? 'zh-TW' : 'en'; void i18n.changeLanguage(next); localStorage.setItem('zhong-locale', next) }
  const links = [{ to: '/', label: t('draw'), icon: Sparkles }, { to: '/collection', label: t('collection'), icon: BookHeart }, { to: '/create', label: t('create'), icon: Box }]
  return <div className="app-shell">
    <header className="site-header">
      <Link to="/" className="wordmark" aria-label={t('brand')}><span className="seal">吉</span><span><strong>{t('brand')}</strong><small>{t('tagline')}</small></span></Link>
      <nav className="desktop-nav" aria-label="Primary">{links.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className={path === to ? 'nav-link active' : 'nav-link'}><Icon size={16}/>{label}</Link>)}</nav>
      <div className="header-actions">
        <Button variant="ghost" onClick={toggleLanguage} aria-label={t('language')}><Languages size={17}/>{i18n.language === 'en' ? '繁中' : 'EN'}</Button>
        <Button variant="outline" onClick={() => authenticated ? void getKeycloak().logout({ redirectUri: `${location.origin}/` }) : void getKeycloak().login({ redirectUri: `${location.origin}/` })}><UserRound size={16}/>{authenticated ? t('signOut') : t('signIn')}</Button>
        <Button variant="ghost" className="menu-button" onClick={() => setOpen(!open)} aria-label={t('menu')}>{open ? <X/> : <Menu/>}</Button>
      </div>
    </header>
    {open && <nav className="mobile-nav">{links.map(({ to, label, icon: Icon }) => <Link key={to} to={to} onClick={() => setOpen(false)}><Icon size={18}/>{label}</Link>)}</nav>}
    <main>{children}</main>
    <footer><div><span className="seal small">吉</span><p>{t('footer')}</p></div><small>{t('rights')}</small></footer>
  </div>
}

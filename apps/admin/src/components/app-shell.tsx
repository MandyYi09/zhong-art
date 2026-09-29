import { Link, useRouterState } from '@tanstack/react-router'
import { Bell, ChevronDown, CircleGauge, CreditCard, Languages, Menu, Search, ShieldCheck, Users, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useAdminAuth } from '@/auth/auth'
import { Avatar, Badge, Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'

const items = [
  { to: '/', key: 'overview', icon: CircleGauge },
  { to: '/deck', key: 'deck', icon: CreditCard },
  { to: '/users', key: 'users', icon: Users },
  { to: '/settings', key: 'settings', icon: ShieldCheck },
] as const

export function AppShell({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation(); const { session, signOut } = useAdminAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const path = useRouterState({ select: (state) => state.location.pathname })
  const toggleLocale = () => { const next = i18n.language === 'en' ? 'zh-TW' : 'en'; void i18n.changeLanguage(next); localStorage.setItem('zhong-admin-locale', next); document.documentElement.lang = next }
  const navigation = <><div className="flex h-16 items-center gap-3 border-b px-5"><div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">中</div><div><div className="text-sm font-semibold leading-4">{t('product')}</div><div className="text-[11px] text-muted-foreground">{t('adminConsole')}</div></div></div><nav aria-label={t('nav')} className="space-y-1 p-3">{items.map(({ to, key, icon: Icon }) => <Link key={to} to={to} onClick={() => setMobileOpen(false)} className={cn('flex h-9 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground', path === to && 'bg-accent font-medium text-accent-foreground')}><Icon className="h-4 w-4" />{t(key)}</Link>)}</nav><div className="mt-auto border-t p-4"><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-emerald-500" />{t('environment')}</div></div></>
  return <div className="min-h-screen bg-background text-foreground"><aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-card lg:flex">{navigation}</aside>{mobileOpen && <div className="fixed inset-0 z-40 lg:hidden"><button className="absolute inset-0 bg-black/30" aria-label={t('close')} onClick={() => setMobileOpen(false)} /><aside className="relative flex h-full w-72 flex-col bg-card shadow-xl">{navigation}<Button size="icon" variant="ghost" className="absolute right-3 top-3" onClick={() => setMobileOpen(false)}><X className="h-4 w-4" /></Button></aside></div>}<div className="lg:pl-60"><header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6"><Button variant="ghost" size="icon" className="lg:hidden" aria-label={t('openMenu')} onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></Button><div className="relative hidden w-full max-w-sm sm:block"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="bg-card pl-9" placeholder={t('searchHint')} aria-label={t('search')} /></div><div className="ml-auto flex items-center gap-1"><Button variant="ghost" size="icon" onClick={toggleLocale} aria-label={t('language')}><Languages className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="h-4 w-4" /></Button><div className="ml-1 hidden h-8 w-px bg-border sm:block" /><button className="ml-2 flex items-center gap-2 rounded-md p-1.5 text-left hover:bg-muted" onClick={signOut}><Avatar name={session?.name ?? 'A'} /><div className="hidden md:block"><div className="max-w-32 truncate text-xs font-medium">{session?.name}</div><Badge className="mt-0.5 px-1 py-0" tone="green">Admin</Badge></div><ChevronDown className="hidden h-3 w-3 text-muted-foreground md:block" /></button></div></header><main className="mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8">{children}</main></div></div>
}

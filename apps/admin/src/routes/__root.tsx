import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { LoaderCircle, LockKeyhole } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { AdminAuthProvider, useAdminAuth } from '@/auth/auth'
import { AppShell } from '@/components/app-shell'
import { Button } from '@/components/ui'
import i18n from '@/i18n'
import { AdminStoreProvider } from '@/state/admin-store'
import '@/styles.css'

export const Route = createRootRoute({
  head: () => ({ meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { title: 'Zhong Art Admin' }, { name: 'description', content: 'Bilingual Zhong Art administration console' }] }),
  component: Root,
  shellComponent: Document,
  notFoundComponent: () => <div className="p-8 text-sm">Page not found.</div>,
})

function Root() { return <I18nextProvider i18n={i18n}><AdminAuthProvider><AdminStoreProvider><AuthGate /></AdminStoreProvider></AdminAuthProvider></I18nextProvider> }
function AuthGate() {
  const { t, i18n } = useTranslation(); const auth = useAdminAuth()
  useEffect(() => {
    const stored = window.localStorage.getItem('zhong-admin-locale')
    if ((stored === 'en' || stored === 'zh-TW') && stored !== i18n.language) void i18n.changeLanguage(stored)
  }, [i18n])
  useEffect(() => { document.documentElement.lang = i18n.language }, [i18n.language])
  if (auth.isLoading) return <main className="grid min-h-screen place-items-center"><div className="flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="h-4 w-4 animate-spin" />{t('loading')}</div></main>
  if (!auth.isAuthenticated) return <CenteredAccess icon={<LockKeyhole className="h-5 w-5" />} title={t('accessDenied')} detail={t('accessDeniedHint')} action={<Button onClick={auth.signIn}>{t('signIn')}</Button>} />
  if (!auth.session?.roles.includes('admin')) return <CenteredAccess icon={<LockKeyhole className="h-5 w-5" />} title={t('accessDenied')} detail={t('accessDeniedHint')} />
  return <AppShell><main className="mx-auto max-w-[1440px] p-4 sm:p-6"><Outlet /></main></AppShell>
}
function CenteredAccess({ icon, title, detail, action }: { icon: ReactNode; title: string; detail: string; action?: ReactNode }) { return <main className="grid min-h-screen place-items-center p-5"><div className="w-full max-w-sm rounded-lg border bg-card p-6 text-center"><div className="mx-auto grid h-10 w-10 place-items-center rounded-md bg-muted">{icon}</div><h1 className="mt-4 text-lg font-semibold">{title}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>{action && <div className="mt-5">{action}</div>}</div></main> }
function Document({ children }: { children: ReactNode }) { return <html lang="zh-TW"><head><HeadContent /></head><body>{children}<Scripts /></body></html> }

import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { AppShell } from '@/components/AppShell'
import '@/lib/i18n'
import '@/styles.css'
import '@/silk-theme.css'

export const Route = createRootRoute({
  head: () => ({ meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { title: 'Modern Shuilu | Collect Chinese Heritage' }, { name: 'description', content: 'Discover collectible art cards inspired by Chinese Shuilu paintings. Collect the art, reconnect with history, and carry your heritage forward.' }] }),
  component: () => import.meta.env.MODE === 'pages'
    ? <AppShell><Outlet/></AppShell>
    : <RootDocument><AppShell><Outlet/></AppShell></RootDocument>,
})

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><head><HeadContent/><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/></head><body>{children}<Scripts/></body></html>
}

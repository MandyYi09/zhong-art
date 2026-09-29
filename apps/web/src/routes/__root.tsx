import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { AppShell } from '@/components/AppShell'
import '@/lib/i18n'
import '@/styles.css'

export const Route = createRootRoute({
  head: () => ({ meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { title: '吉光 Auspicious Light' }, { name: 'description', content: 'A daily guardian card experience inspired by Chinese Water-and-Land paintings.' }] }),
  component: () => <RootDocument><AppShell><Outlet/></AppShell></RootDocument>,
})

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="zh-Hant"><head><HeadContent/><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/></head><body>{children}<Scripts/></body></html>
}

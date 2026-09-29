import { LoaderCircle, LockKeyhole } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useAdminAuth } from '@/auth/auth'
import { Button, Card } from '@/components/ui'

export function AuthGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation(); const auth = useAdminAuth()
  if (auth.isLoading) return <div className="grid min-h-screen place-items-center"><div className="flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="h-4 w-4 animate-spin" />{t('loading')}</div></div>
  if (!auth.isAuthenticated) return <AccessCard title={t('accessDenied')} description={t('accessDeniedHint')} action={<Button onClick={auth.signIn}>{t('signIn')}</Button>} />
  if (!auth.session?.roles.includes('admin')) return <AccessCard title={t('accessDenied')} description={t('accessDeniedHint')} />
  return children
}
function AccessCard({ title, description, action }: { title: string; description: string; action?: ReactNode }) { return <div className="grid min-h-screen place-items-center p-5"><Card className="max-w-md p-7 text-center"><div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-full bg-muted"><LockKeyhole className="h-5 w-5" /></div><h1 className="font-semibold">{title}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>{action && <div className="mt-5">{action}</div>}</Card></div> }

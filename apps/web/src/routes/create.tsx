import { createFileRoute } from '@tanstack/react-router'
import { CircleDollarSign, LockKeyhole, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui'
import { api, ApiError } from '@/lib/api'

export const Route = createFileRoute('/create')({ component: CreatePage })
function CreatePage() {
  const { t, i18n } = useTranslation(); const [form, setForm] = useState({ feeling: '', wish: '', style: 'classic' }); const [result, setResult] = useState<{title:string;message:string;developmentFallback:boolean;usage:{used:number;limit:number}}|null>(null); const [error,setError] = useState(''); const [busy,setBusy]=useState(false)
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); setError(''); try { setResult(await api.create({ ...form, locale: i18n.language === 'en' ? 'en' : 'zh-TW' })) } catch (e) { setError(e instanceof ApiError && e.code === 'global_budget_exhausted' ? t('budget') : e instanceof ApiError && e.code === 'daily_limit_reached' ? t('quotaReached') : t('createFailed')) } finally { setBusy(false) } }
  return <section className="create-page page-width"><header className="page-heading"><span className="section-kicker"><Sparkles size={15}/>{t('create')}</span><h1>{t('createTitle')}</h1><p>{t('createBody')}</p></header><div className="create-grid"><form className="create-form surface" onSubmit={submit}>
    <label>{t('feeling')}<textarea required maxLength={180} value={form.feeling} placeholder={t('placeholderFeeling')} onChange={e=>setForm({...form, feeling:e.target.value})}/></label>
    <label>{t('wish')}<input required maxLength={120} value={form.wish} placeholder={t('placeholderWish')} onChange={e=>setForm({...form, wish:e.target.value})}/></label>
    <fieldset><legend>{t('style')}</legend><div className="style-options">{['classic','lively','quiet'].map(style=><label key={style} className={form.style===style?'selected':''}><input type="radio" name="style" value={style} checked={form.style===style} onChange={()=>setForm({...form,style})}/><span className={`swatch ${style}`}/>{t(style)}</label>)}</div></fieldset>
    <Button disabled={busy}>{busy ? '…' : t('generate')}<Sparkles size={17}/></Button>{error && <p className="form-error" role="alert">{error}</p>}
  </form><aside className="quota-panel">{result ? <div className="personal-card"><span className="seal large">心</span><small>{result.title}</small><p>「{result.message}」</p>{result.developmentFallback && <small role="status">{t('demoFallback')}</small>}<small>{result.usage.used} / {result.usage.limit}</small></div> : <div className="create-placeholder"><span className="orb"><Sparkles/></span><p>{t('createBody')}</p></div>}<ul><li><LockKeyhole size={16}/>{t('quotaAnon')}</li><li><LockKeyhole size={16}/>{t('quotaAuth')}</li><li><CircleDollarSign size={16}/>{t('budget')}</li></ul></aside></div></section>
}

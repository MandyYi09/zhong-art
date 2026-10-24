import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Gift, Package, Sparkles, Truck, X } from 'lucide-react'
import { reservationConfig, reservationEndpoint, reservationPrice } from '@/lib/reservations'
import type { Painting } from '@/lib/paintings'

const journey = [
  { Icon: Package, zh: '制作实体卡', en: 'Make your card', detailZh: '把抽到的角色，印成可收藏的实体卡。', detailEn: 'Your drawn character becomes a collectible print.' },
  { Icon: Truck, zh: '寄往合作寺庙', en: 'Send to the temple', detailZh: '制作完成后，先寄往已确认的合作寺庙。', detailEn: 'The finished card is sent to a confirmed partner temple.' },
  { Icon: Sparkles, zh: '依传统祈福', en: 'A traditional blessing', detailZh: '由寺庙依自身传统安排仪式，尊重各自仪轨。', detailEn: 'The temple arranges a ceremony according to its own tradition.' },
  { Icon: Gift, zh: '将祝福寄给你', en: 'Delivered to you', detailZh: '仪式完成后，由寺庙直接寄往你的收货地址。', detailEn: 'After the ceremony, the temple ships directly to your address.' },
]

export function BlessingJourney({ en }: { en: boolean }) {
  return <ol className="blessing-journey">{journey.map(({ Icon, zh, en: titleEn, detailZh, detailEn }, index) => <li key={zh}>
    <span className="blessing-journey-icon"><Icon size={21}/><small>0{index + 1}</small></span>
    <h3>{en ? titleEn : zh}</h3><p>{en ? detailEn : detailZh}</p>
  </li>)}</ol>
}

export function BlessingIntroduction({ en }: { en: boolean }) {
  return <section className="blessing-introduction" aria-labelledby="blessing-intro-title">
    <div className="blessing-intro-heading"><span className="overline">{en ? 'FROM A DIGITAL ENCOUNTER TO A KEEPSAKE' : '从一次数字相遇，到一份实体珍藏'}</span><span className="blessing-badge">{en ? 'RESERVATIONS' : '预约服务'}</span></div>
    <h2 id="blessing-intro-title">{en ? <>Keep the card.<br/><em>Carry the wish.</em></> : <>让喜欢的角色，<em>带着祝福来到身边。</em></>}</h2>
    <p>{en ? 'Reserve a physical card and blessing service. We will contact you to confirm availability, price and delivery before any payment.' : '翻开角色卡后，可预约实体收藏卡与寺庙祈福服务。我们会联系你确认寺庙安排、费用和寄送时间；预约不收款。'}</p>
    <BlessingJourney en={en}/>
    <p className="blessing-footnote">{en ? 'This is the proposed service journey. Ceremonies follow each temple’s tradition; blessings express a wish and do not promise a particular outcome.' : '以上为拟定服务流程。具体仪式以合作寺庙传统为准；祈福承载心愿，不承诺特定效果。'}</p>
  </section>
}

export function BlessingExperience({ painting, en, onClose }: { painting: Painting; en: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const [step, setStep] = useState(0)
  const [edition, setEdition] = useState<'card' | 'gift'>('card')
  const [quantity, setQuantity] = useState(1)
  const [wish, setWish] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [consent, setConsent] = useState(false)
  const [sending, setSending] = useState(false)
  const [reference] = useState(() => `SL-${crypto.randomUUID()}`)
  const endpoint = reservationEndpoint(reservationConfig)
  const t = (zh: string, english: string) => en ? english : zh
  const packageName = edition === 'card' ? t('实体收藏卡', 'Collectible card') : t('心意赠礼装', 'Gift edition')
  const total = reservationPrice(edition, quantity, en)
  useEffect(() => {
    const focus = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    dialog.current?.showModal(); document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow; focus?.focus() }
  }, [])
  useEffect(() => { heading.current?.focus(); dialog.current?.scrollTo?.(0, 0) }, [step])
  function submit(event: FormEvent<HTMLFormElement>) {
    if (step === 0) { event.preventDefault(); setStep(1); return }
    if (!endpoint || !consent || sending) { event.preventDefault(); return }
    setSending(true)
    // Native POST preserves the provider's CAPTCHA and real submission result.
    // Never report success locally before the mail service accepts the request.
  }
  return <dialog ref={dialog} className="blessing-dialog" aria-labelledby="blessing-title" onCancel={event => { event.preventDefault(); onClose() }}>
    <div className="blessing-dialog-top"><span className="overline">{t('实体卡 · 寺庙祈福预约', 'CARD & TEMPLE BLESSING RESERVATION')}</span><button type="button" className="blessing-close" aria-label={t('关闭预约', 'Close reservation')} onClick={onClose}><X size={20}/></button></div>
    <h2 id="blessing-title" tabIndex={-1} ref={heading}>{step === 0 ? t('预约你的收藏卡', 'Reserve your card') : t('核对预约', 'Review reservation')}</h2>
    <p className="blessing-preview-note">{t('预约不收款。我们会联系你确认寺庙、费用与时间，再由你决定是否正式下单。', 'No payment now. We will contact you to confirm the temple, price and timing before you decide to order.')}</p>
    {!endpoint && <p className="reservation-unavailable" role="status">{t('预约通道尚未开放，暂时无法发送。你可以先查看方案，开放后再填写提交。', 'Reservations are not open yet. You can explore the options now and submit once the service opens.')}</p>}
    <form action={endpoint || undefined} method="POST" onSubmit={submit}>
      <input type="hidden" name="_subject" value={`Modern Shuilu 预约 ${reference}`}/>
      <input type="hidden" name="_template" value="table"/>
      <input type="hidden" name="预约编号 / Reference" value={reference}/>
      <input type="hidden" name="卡款 / Card" value={`${painting.id} · ${painting.identity.name.zh} / ${painting.identity.name.en} · ${painting.edition}`}/>
      <input type="hidden" name="方案 / Edition" value={packageName}/>
      <input type="hidden" name="数量 / Quantity" value={quantity}/>
      <input type="hidden" name="参考金额 / Estimate" value={total}/>
      <input type="hidden" name="称呼 / Name" value={name.trim()}/>
      <input type="hidden" name="联系方式 / Contact" value={contact.trim()}/>
      <input type="hidden" name="心愿 / Wish" value={wish.trim()}/>
      <input type="hidden" name="预约性质 / Status" value="预约意向，未付款；寺庙、费用、时效待人工确认。Reservation only; unpaid; subject to confirmation."/>
      <input type="hidden" name="信息使用同意 / Consent" value={consent ? 'Agreed to email processing for reservation follow-up' : ''}/>
      <div hidden aria-hidden="true"><label>Leave blank<input name="_honey" tabIndex={-1} autoComplete="off"/></label></div>
      <div className="blessing-checkout-grid">
        <aside className="blessing-card-summary"><div className="blessing-print"><img src={painting.character} alt={painting.identity.name[en ? 'en' : 'zh']}/></div><h3>{painting.identity.name[en ? 'en' : 'zh']}</h3><p>{packageName} × {quantity}</p><p>{total}</p></aside>
        <div className="blessing-fields">
          {step === 0 ? <>
            <fieldset className="blessing-packages"><legend>{t('选择收藏方式', 'Choose your edition')}</legend>{(['card', 'gift'] as const).map(value => <label key={value} className={edition === value ? 'is-selected' : ''}><input type="radio" checked={edition === value} onChange={() => setEdition(value)}/><span><strong>{value === 'card' ? t('实体收藏卡', 'Collectible card') : t('心意赠礼装', 'Gift edition')}</strong><small>{reservationPrice(value, 1, en)}</small></span></label>)}</fieldset>
            <label className="blessing-field">{t('收藏数量', 'Quantity')}<select value={quantity} onChange={event => setQuantity(Number(event.target.value))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
            <label className="blessing-field">{t('称呼', 'Name')}<input required pattern=".*\S.*" maxLength={40} autoComplete="name" value={name} onChange={event => setName(event.target.value)}/></label>
            <label className="blessing-field">{t('联系方式（邮箱、手机或微信）', 'Contact (email, phone or WeChat)')}<input required pattern=".*\S.*" minLength={3} maxLength={100} value={contact} onChange={event => setContact(event.target.value)}/></label>
            <label className="blessing-field">{t('心愿或备注（选填）', 'Wish or notes (optional)')}<textarea maxLength={300} rows={3} value={wish} onChange={event => setWish(event.target.value)}/></label>
            <p className="blessing-field-help">{t('暂不需要收货地址，确认预约后再联系你补充。', 'No delivery address needed yet. We will ask after confirming your reservation.')}</p>
          </> : <>
            <dl className="blessing-review"><div><dt>{t('预约编号', 'Reference')}</dt><dd className="reservation-reference">{reference}</dd></div><div><dt>{t('称呼', 'Name')}</dt><dd>{name}</dd></div><div><dt>{t('联系方式', 'Contact')}</dt><dd>{contact}</dd></div><div><dt>{t('心愿或备注', 'Wish or notes')}</dt><dd>{wish || t('未填写', 'None')}</dd></div><div><dt>{t('参考金额', 'Estimate')}</dt><dd>{total} · {t('最终费用另行确认', 'Final price subject to confirmation')}</dd></div></dl>
            <label className="blessing-consent"><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)}/><span>{t('我同意将上述信息通过 FormSubmit 邮件服务发送给网站运营者，用于预约联系。我理解预约不等于付款或寺庙确认。', 'I agree to send these details through FormSubmit to the site operator for reservation follow-up. This is not payment or temple confirmation.')}</span></label>
            <p className="blessing-field-help">{t('提交后将前往邮件服务完成验证。请以服务返回的提交结果为准；如失败可返回重试。', 'Continue to the mail service to complete verification. Check its submission result; return and retry if it fails.')}</p>
          </>}
        </div>
      </div>
      <div className="blessing-form-actions">{step === 1 && <button type="button" className="subtle-button" onClick={() => { setStep(0); setSending(false) }}>{t('返回修改', 'Edit details')}</button>}<button type="submit" className="paper-button" disabled={sending || (step === 1 && !endpoint)}>{sending ? t('正在前往验证…', 'Continuing…') : step === 0 ? t('下一步 · 核对预约', 'Next · Review') : t('提交预约（不付款）', 'Submit reservation · No payment')}<ArrowRight size={16}/></button></div>
    </form>
  </dialog>
}

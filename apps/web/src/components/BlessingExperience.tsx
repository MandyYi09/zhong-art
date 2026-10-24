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

export function CollectibleEntry({ painting, en, compact = false }: { painting: Painting; en: boolean; compact?: boolean }) {
  const [open, setOpen] = useState(false)
  return <>
    {compact ? <button type="button" className="collectible-link" onClick={() => setOpen(true)}>{en ? 'See the collectible card' : '看看实体收藏卡'} →</button> : <section className="collectible-entry">
      <img src={painting.character} alt={en ? 'Collectible card concept' : '实体卡效果示意'} loading="lazy"/>
      <div><h2>{en ? 'Take this encounter home.' : '把这次相遇带回家'}</h2><p>{en ? 'Love this character? Explore a physical collectible card, with an optional temple blessing.' : '喜欢这位角色？可以收藏实体卡，也可以选择寺庙祈福服务。'}</p><button type="button" className="subtle-button" onClick={() => setOpen(true)}>{en ? 'See the collectible card' : '看看实体收藏卡'} <ArrowRight size={15}/></button></div>
    </section>}
    {open && <BlessingExperience painting={painting} en={en} onClose={() => setOpen(false)}/>}
  </>
}

export function BlessingExperience({ painting, en, onClose }: { painting: Painting; en: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const [step, setStep] = useState(-1)
  const [edition, setEdition] = useState<'card' | 'gift'>('card')
  const [quantity, setQuantity] = useState(1)
  const [includeBlessing, setIncludeBlessing] = useState(false)
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
    if (step === -1) { event.preventDefault(); setStep(0); return }
    if (step === 0) { event.preventDefault(); setStep(1); return }
    if (!endpoint || !consent || sending) { event.preventDefault(); return }
    setSending(true)
    // Native POST preserves the provider's CAPTCHA and real submission result.
    // Never report success locally before the mail service accepts the request.
  }
  return <dialog ref={dialog} className="blessing-dialog" aria-labelledby="blessing-title" onCancel={event => { event.preventDefault(); onClose() }}>
    <div className="blessing-dialog-top"><span className="overline">{t('实体收藏 · 自愿选择', 'PHYSICAL KEEPSAKE · OPTIONAL')}</span><button type="button" className="blessing-close" aria-label={t('关闭预约', 'Close reservation')} onClick={onClose}><X size={20}/></button></div>
    <h2 id="blessing-title" tabIndex={-1} ref={heading}>{step === -1 ? t('一张可以留在身边的卡', 'A card to keep close') : step === 0 ? t('预约你的收藏卡', 'Reserve your card') : t('核对预约', 'Review reservation')}</h2>
    <p className="blessing-preview-note">{t('实体收藏是看画之外的自愿选择。预约不收款，费用与寄送时间将在联系后确认。', 'Physical collecting is optional. No payment now; price and delivery timing will be confirmed with you.')}</p>
    {!endpoint && <p className="reservation-unavailable" role="status">{t('预约通道尚未开放，暂时无法发送。你可以先查看方案，开放后再填写提交。', 'Reservations are not open yet. You can explore the options now and submit once the service opens.')}</p>}
    <form action={endpoint || undefined} method="POST" onSubmit={submit}>
      <input type="hidden" name="_subject" value={`Modern Shuilu 预约 ${reference}`}/>
      <input type="hidden" name="_template" value="table"/>
      <input type="hidden" name="预约编号 / Reference" value={reference}/>
      <input type="hidden" name="卡款 / Card" value={`${painting.id} · ${painting.identity.name.zh} / ${painting.identity.name.en} · ${painting.edition}`}/>
      <input type="hidden" name="方案 / Edition" value={packageName}/>
      <input type="hidden" name="寺庙祈福 / Temple blessing" value={includeBlessing ? 'Requested · details and additional cost to be confirmed' : 'Not requested · card only'}/>
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
          {step === -1 ? <>
            <h3>{t('你将收藏什么？', 'What will you receive?')}</h3>
            <p>{t('将这位插画角色制作成实体收藏卡，可自留，也可选择赠礼包装。图中为效果示意。', 'A physical print of this illustrated character, for yourself or as a gift. The image is a concept preview.')}</p>
            <dl className="blessing-review"><div><dt>{t('材质与尺寸', 'Material & size')}</dt><dd>{t('待确认，正式下单前提供', 'To be confirmed before ordering')}</dd></div><div><dt>{t('卡片参考价', 'Card estimate')}</dt><dd>{reservationPrice('card', 1, en)}</dd></div><div><dt>{t('赠礼装参考价', 'Gift estimate')}</dt><dd>{reservationPrice('gift', 1, en)}</dd></div></dl>
            <label className="blessing-consent"><input type="checkbox" checked={includeBlessing} onChange={event => setIncludeBlessing(event.target.checked)}/><span><strong>{t('我也想了解寺庙祈福（可选）', 'I am also interested in a temple blessing (optional)')}</strong><br/>{t('不勾选也可以预约实体卡。', 'You can reserve the card without this service.')}</span></label>
            {includeBlessing && <div className="collectible-temple-note"><p>{t('寺庙名称、所在地、仪式安排、附加费用及预计时间均待确认，确认后再决定是否委托。', 'The temple, location, ceremony, additional fee and timing will be provided for your approval before proceeding.')}</p><p>{t('拟定流程：制作卡片 → 寺庙祈福 → 寄送。仪式遵循寺庙传统，不承诺特定效果。', 'Proposed journey: print → temple blessing → delivery. Ceremonies follow the temple’s tradition and do not promise specific outcomes.')}</p></div>}
          </> : step === 0 ? <>
            <fieldset className="blessing-packages"><legend>{t('选择收藏方式', 'Choose your edition')}</legend>{(['card', 'gift'] as const).map(value => <label key={value} className={edition === value ? 'is-selected' : ''}><input type="radio" checked={edition === value} onChange={() => setEdition(value)}/><span><strong>{value === 'card' ? t('实体收藏卡', 'Collectible card') : t('心意赠礼装', 'Gift edition')}</strong><small>{reservationPrice(value, 1, en)}</small></span></label>)}</fieldset>
            <label className="blessing-field">{t('收藏数量', 'Quantity')}<select value={quantity} onChange={event => setQuantity(Number(event.target.value))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
            <label className="blessing-field">{t('称呼', 'Name')}<input required pattern=".*\S.*" maxLength={40} autoComplete="name" value={name} onChange={event => setName(event.target.value)}/></label>
            <label className="blessing-field">{t('联系方式（邮箱、手机或微信）', 'Contact (email, phone or WeChat)')}<input required pattern=".*\S.*" minLength={3} maxLength={100} value={contact} onChange={event => setContact(event.target.value)}/></label>
            <label className="blessing-field">{t('心愿或备注（选填）', 'Wish or notes (optional)')}<textarea maxLength={300} rows={3} value={wish} onChange={event => setWish(event.target.value)}/></label>
            <p className="blessing-field-help">{t('暂不需要收货地址，确认预约后再联系你补充。', 'No delivery address needed yet. We will ask after confirming your reservation.')}</p>
          </> : <>
            <dl className="blessing-review"><div><dt>{t('预约编号', 'Reference')}</dt><dd className="reservation-reference">{reference}</dd></div><div><dt>{t('称呼', 'Name')}</dt><dd>{name}</dd></div><div><dt>{t('联系方式', 'Contact')}</dt><dd>{contact}</dd></div><div><dt>{t('心愿或备注', 'Wish or notes')}</dt><dd>{wish || t('未填写', 'None')}</dd></div><div><dt>{t('寺庙祈福', 'Temple blessing')}</dt><dd>{includeBlessing ? t('希望了解，待确认', 'Interested; subject to confirmation') : t('不需要，仅收藏卡片', 'Card only')}</dd></div><div><dt>{t('参考金额', 'Estimate')}</dt><dd>{total} · {t('最终费用另行确认', 'Final price subject to confirmation')}</dd></div></dl>
            <label className="blessing-consent"><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)}/><span>{t('我同意将上述信息通过 FormSubmit 邮件服务发送给网站运营者，用于预约联系。我理解预约不等于付款或寺庙确认。', 'I agree to send these details through FormSubmit to the site operator for reservation follow-up. This is not payment or temple confirmation.')}</span></label>
            <p className="blessing-field-help">{t('提交后将前往邮件服务完成验证。请以服务返回的提交结果为准；如失败可返回重试。', 'Continue to the mail service to complete verification. Check its submission result; return and retry if it fails.')}</p>
          </>}
        </div>
      </div>
      <div className="blessing-form-actions">{step >= 0 && <button type="button" className="subtle-button" onClick={() => { setStep(current => current - 1); setSending(false) }}>{t('返回修改', 'Edit details')}</button>}<button type="submit" className="paper-button" disabled={sending || (step === 1 && !endpoint)}>{sending ? t('正在前往验证…', 'Continuing…') : step === -1 ? t('继续 · 填写预约', 'Continue · Reservation details') : step === 0 ? t('下一步 · 核对预约', 'Next · Review') : t('提交预约（不付款）', 'Submit reservation · No payment')}<ArrowRight size={16}/></button></div>
    </form>
  </dialog>
}

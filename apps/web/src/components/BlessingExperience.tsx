import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Check, Gift, Package, Sparkles, Truck, X } from 'lucide-react'
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
    <div className="blessing-intro-heading"><span className="overline">{en ? 'FROM A DIGITAL ENCOUNTER TO A KEEPSAKE' : '从一次数字相遇，到一份实体珍藏'}</span><span className="blessing-badge">{en ? 'SERVICE PREVIEW' : '服务筹备中'}</span></div>
    <h2 id="blessing-intro-title">{en ? <>Keep the card.<br/><em>Carry the wish.</em></> : <>让喜欢的角色，<em>带着祝福来到身边。</em></>}</h2>
    <p>{en ? 'Draw for free. After revealing your character, explore a physical card and temple blessing. Ordering will open once partner temples, prices and delivery arrangements are confirmed.' : '免费抽卡，随心珍藏。翻开角色卡后，可体验实体收藏卡与寺庙祈福方案；合作寺庙、价格与寄送安排确认后，将开放正式下单。'}</p>
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
  const [recipient, setRecipient] = useState('')
  const [phone, setPhone] = useState('')
  const [region, setRegion] = useState('')
  const [address, setAddress] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const t = (zh: string, english: string) => en ? english : zh
  const packageName = edition === 'card' ? t('实体收藏卡', 'Collectible card') : t('心意赠礼装', 'Gift edition')
  const title = [t('把相遇，留在手中。', 'A meeting to hold on to.'), t('祝福，将寄往哪里？', 'Where will your wish travel?'), t('确认你的收藏方案', 'Review your keepsake'), t('体验完成，静候启程。', 'Preview complete. A journey awaits.')][step]

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog.current?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [])
  useEffect(() => { heading.current?.focus(); dialog.current?.scrollTo?.(0, 0) }, [step])

  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step === 2) {
      // The public preview never submits, persists, or transmits delivery details.
      setRecipient(''); setPhone(''); setRegion(''); setAddress(''); setWish('')
    }
    setStep(current => Math.min(current + 1, 3))
  }

  return <dialog className="blessing-dialog" ref={dialog} aria-labelledby="blessing-title" aria-describedby="blessing-preview-note" onCancel={event => { event.preventDefault(); onClose() }}>
    <div className="blessing-dialog-top"><span className="overline">{t('寺庙祈福加持 · 实体收藏', 'TEMPLE BLESSING · PHYSICAL KEEPSAKE')}</span><button type="button" className="blessing-close" onClick={onClose} aria-label={t('关闭体验', 'Close preview')}><X size={20}/></button></div>
    <p id="blessing-preview-note" className="blessing-preview-note">{t('流程体验版 · 暂未开放下单或收款。合作寺庙、费用与时效待公布。', 'Preview only · Orders and payments are not open. Partner temples, pricing and timing are to be announced.')}</p>
    {step < 3 && <ol className="blessing-steps" aria-label={t('体验步骤', 'Preview steps')}>{[t('选择收藏', 'Choose'), t('收货信息', 'Delivery'), t('核对方案', 'Review')].map((label, index) => <li key={label} className={step === index ? 'is-current' : ''} aria-current={step === index ? 'step' : undefined}><span>{index < step ? <Check size={13}/> : index + 1}</span>{label}</li>)}</ol>}
    <h2 id="blessing-title" ref={heading} tabIndex={-1}>{title}</h2>
    {step === 3 ? <div className="blessing-complete">
      <span className="blessing-complete-seal" aria-hidden="true">愿</span>
      <p>{t('你已体验从数字抽卡到实体祈福卡的完整路径。本次没有生成订单、扣款或安排仪式；填写的信息已清除。', 'You have explored the journey from a digital draw to a physical blessing card. No order, payment or ceremony was created. Your entered details have been cleared.')}</p>
      <div className="blessing-complete-card"><img decoding="async" src={painting.character} alt=""/><div><span className="overline">{t('本次体验方案', 'YOUR PREVIEW')}</span><h3>{painting.identity.name[en ? 'en' : 'zh']}</h3><p>{packageName} × {quantity}</p><small>{t('合作服务开放后，方可正式下单。', 'Ordering will be available after the service launches.')}</small></div></div>
      <h3>{t('正式服务开放后的旅程', 'The journey when the service opens')}</h3><BlessingJourney en={en}/>
      <button type="button" className="paper-button" onClick={onClose}>{t('回到我的角色卡', 'Back to my character')}<ArrowRight size={16}/></button>
    </div> : <form onSubmit={advance}>
      <div className="blessing-checkout-grid">
        <aside className="blessing-card-summary"><div className="blessing-print"><img decoding="async" src={painting.character} alt={painting.identity.name[en ? 'en' : 'zh']}/></div><span className="overline">{t('你的今日相遇', 'TODAY’S ENCOUNTER')}</span><h3>{painting.identity.name[en ? 'en' : 'zh']}</h3><p>{painting.blessing[en ? 'en' : 'zh']}</p><small>{t('实体效果示意 · 最终材质与规格待公布', 'Print concept · Final materials and dimensions to be announced')}</small></aside>
        <div className="blessing-fields">
          {step === 0 && <>
            <fieldset className="blessing-packages"><legend>{t('选择收藏方式', 'Choose your edition')}</legend>{(['card', 'gift'] as const).map(value => <label key={value} className={edition === value ? 'is-selected' : ''}><input type="radio" name="edition" value={value} checked={edition === value} onChange={() => setEdition(value)}/><span><strong>{value === 'card' ? t('实体收藏卡', 'Collectible card') : t('心意赠礼装', 'Gift edition')}</strong><small>{value === 'card' ? t('角色卡 + 保护卡套（拟定）', 'Character card + protective sleeve (proposed)') : t('角色卡 + 卡套 + 赠礼包装（拟定）', 'Character card + sleeve + gift packaging (proposed)')}</small></span><span className="blessing-price">{t('待定价', 'TBA')}</span></label>)}</fieldset>
            <label className="blessing-field">{t('收藏数量', 'Quantity')}<select value={quantity} onChange={event => setQuantity(Number(event.target.value))}>{[1, 2, 3, 4, 5].map(value => <option key={value} value={value}>{value} {t('张', value === 1 ? 'card' : 'cards')}</option>)}</select></label>
            <label className="blessing-field">{t('写下一句心愿（选填）', 'A personal wish (optional)')}<textarea value={wish} onChange={event => setWish(event.target.value)} maxLength={100} rows={3} placeholder={t('愿心有所安，所行皆坦途。', 'May your heart find peace and your path be clear.')}/><small>{wish.length}/100 · {t('仅用于本次体验，不会发送给寺庙', 'For this preview only; not sent to a temple')}</small></label>
            <div className="blessing-temple"><Sparkles size={19}/><div><strong>{t('合作寺庙 · 筹备中', 'Partner temple · Coming soon')}</strong><p>{t('正式开放时，将展示寺庙名称、所在地、仪式说明及预计时间，由你确认后再付款。', 'At launch, review the temple name, location, ceremony details and estimated timing before paying.')}</p></div></div>
          </>}
          {step === 1 && <>
            <p className="blessing-field-help">{t('请使用示例信息体验。内容仅暂存于当前弹窗，关闭或完成体验即清除，不会提交或保存。', 'Use sample details. They stay only in this open dialog and are cleared on closing or completion; nothing is submitted or saved.')}</p>
            <button type="button" className="blessing-sample" onClick={() => { setRecipient(t('体验用户', 'Sample recipient')); setPhone('13800000000'); setRegion(t('示例省 / 示例市 / 示例区', 'Sample province / city / district')); setAddress(t('示例路 1 号（仅供体验）', '1 Sample Road (preview only)')) }}>{t('填入示例收货信息', 'Use sample delivery details')}</button>
            <div className="blessing-field-pair"><label className="blessing-field">{t('收件人', 'Recipient')}<input required pattern=".*\S.*" maxLength={40} autoComplete="off" value={recipient} onChange={event => setRecipient(event.target.value)}/></label><label className="blessing-field">{t('联系电话', 'Phone')}<input required type="tel" pattern="[+]?[0-9]{6,15}" title={t('请输入 6–15 位数字，可在开头加 +', 'Use 6–15 digits, optionally starting with +')} maxLength={25} autoComplete="off" value={phone} onChange={event => setPhone(event.target.value)}/></label></div>
            <label className="blessing-field">{t('省 / 市 / 区', 'Province / city / district')}<input required pattern=".*\S.*" maxLength={100} autoComplete="off" value={region} onChange={event => setRegion(event.target.value)}/></label>
            <label className="blessing-field">{t('详细地址', 'Street address')}<textarea required maxLength={200} rows={3} autoComplete="off" value={address} onChange={event => { setAddress(event.target.value); event.target.setCustomValidity(event.target.value.trim() ? '' : t('请填写详细地址', 'Enter a street address')) }}/></label>
            <p className="blessing-field-help">{t('正式服务将先制作并寄卡至寺庙，仪式完成后再由寺庙寄给收件人。可配送地区和运费待公布。', 'At launch, the card will go to the temple first, then to the recipient after the ceremony. Delivery regions and shipping fees are to be announced.')}</p>
          </>}
          {step === 2 && <>
            <dl className="blessing-review"><div><dt>{t('收藏方案', 'Edition')}</dt><dd>{packageName} × {quantity}</dd></div><div><dt>{t('合作寺庙', 'Partner temple')}</dt><dd>{t('待公布', 'To be announced')}</dd></div><div><dt>{t('我的心愿', 'Personal wish')}</dt><dd>{wish.trim() || t('未填写', 'Not provided')}</dd></div><div><dt>{t('体验收货信息', 'Sample delivery')}</dt><dd>{recipient}<br/>{phone}<br/>{region}<br/>{address}</dd></div></dl>
            <dl className="blessing-costs">{[t('实体卡与包装', 'Card and packaging'), t('寺庙服务费用', 'Temple service'), t('两程寄送费用', 'Both shipping legs')].map(label => <div key={label}><dt>{label}</dt><dd>{t('待公布', 'TBA')}</dd></div>)}<div className="blessing-total"><dt>{t('本次体验', 'This preview')}</dt><dd>{t('不收取费用', 'No charge')}</dd></div></dl>
            <label className="blessing-consent"><input required type="checkbox" checked={acknowledged} onChange={event => setAcknowledged(event.target.checked)}/><span>{t('我理解这是流程体验，尚未开放真实下单；祈福仪式依寺庙传统进行，不承诺特定效果。', 'I understand this is a preview with no real orders. Ceremonies follow the temple’s tradition and do not promise specific outcomes.')}</span></label>
          </>}
        </div>
      </div>
      <div className="blessing-form-actions">{step > 0 && <button className="subtle-button" type="button" onClick={() => setStep(current => current - 1)}>{t('上一步', 'Back')}</button>}<button type="submit" className="paper-button">{step === 0 ? t('下一步 · 收货信息', 'Next · Delivery') : step === 1 ? t('下一步 · 核对方案', 'Next · Review') : t('完成流程体验（不付款）', 'Finish preview · No payment')}<ArrowRight size={16}/></button></div>
    </form>}
  </dialog>
}

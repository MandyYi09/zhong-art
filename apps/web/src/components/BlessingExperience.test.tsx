// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { BlessingExperience } from './BlessingExperience'
import { paintings } from '../lib/paintings'

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  vi.spyOn(Storage.prototype, 'setItem')
  vi.stubGlobal('fetch', vi.fn())
})
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals() })

function start() { return render(<BlessingExperience painting={paintings[0]} en={false} onClose={() => {}}/>) }
function next() { fireEvent.click(screen.getByRole('button', { name: /下一步/ })) }

describe('temple blessing preview', () => {
  it('keeps the drawn card and choices while reviewing, then clears entered details without sending an order', () => {
    start()
    fireEvent.click(screen.getByRole('radio', { name: /心意赠礼装/ }))
    fireEvent.change(screen.getByLabelText('收藏数量'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText(/写下一句心愿/), { target: { value: '祝家人平安' } })
    next()
    fireEvent.click(screen.getByRole('button', { name: '填入示例收货信息' }))
    next()
    expect(screen.getByText('心意赠礼装 × 3')).toBeTruthy()
    expect(screen.getByText('祝家人平安')).toBeTruthy()
    expect(screen.getByText(/示例路 1 号/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '上一步' }))
    expect((screen.getByLabelText('收件人') as HTMLInputElement).value).toBe('体验用户')
    next()
    expect(screen.getByRole('checkbox').hasAttribute('required')).toBe(true)
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: '完成流程体验（不付款）' }))
    expect(screen.getByText(/没有生成订单、扣款或安排仪式/)).toBeTruthy()
    expect(screen.queryByText(/示例路 1 号/)).toBeNull()
    expect(screen.getByText(paintings[0].identity.name.zh)).toBeTruthy()
    expect(fetch).not.toHaveBeenCalled()
    expect(Storage.prototype.setItem).not.toHaveBeenCalled()
  })

  it('requires delivery fields and rejects invalid phone input', () => {
    start(); next()
    const phone = screen.getByLabelText('联系电话') as HTMLInputElement
    expect(phone.checkValidity()).toBe(false)
    fireEvent.change(phone, { target: { value: 'abcdef' } })
    expect(phone.checkValidity()).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: '填入示例收货信息' }))
    expect(phone.checkValidity()).toBe(true)
    expect(phone.form?.checkValidity()).toBe(true)
    fireEvent.change(screen.getByLabelText('详细地址'), { target: { value: '   ' } })
    expect(phone.form?.checkValidity()).toBe(false)
  })

  it('supports English, restores scrolling on close, and starts with empty details when reopened', () => {
    document.body.style.overflow = 'auto'
    const close = vi.fn()
    const view = render(<BlessingExperience painting={paintings[0]} en onClose={close}/>)
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.click(screen.getByRole('button', { name: 'Next · Delivery' }))
    fireEvent.click(screen.getByRole('button', { name: 'Use sample delivery details' }))
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { bubbles: false, cancelable: true }))
    expect(close).toHaveBeenCalledOnce()
    view.unmount()
    expect(document.body.style.overflow).toBe('auto')
    render(<BlessingExperience painting={paintings[0]} en onClose={close}/>)
    fireEvent.click(screen.getByRole('button', { name: 'Next · Delivery' }))
    expect((screen.getByLabelText('Recipient') as HTMLInputElement).value).toBe('')
  })
})

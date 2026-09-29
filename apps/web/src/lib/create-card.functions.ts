import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { createRemoteJWKSet, jwtVerify } from 'jose'

type Usage = { day: string; count: number }
const usage = new Map<string, Usage>()
let globalSpend = 0
let budgetDay = ''

async function getVerifiedSubject(token?: string) {
  if (!token) return null
  const realm = process.env.KEYCLOAK_REALM || 'zhong-art'
  const issuer = `https://passport.keesee.net/realms/${realm}`
  const { payload } = await jwtVerify(token, createRemoteJWKSet(new URL(`${issuer}/protocol/openid-connect/certs`)), { issuer })
  return typeof payload.sub === 'string' ? payload.sub : null
}

export const createPersonalCard = createServerFn({ method: 'POST' })
  .validator((input: { feeling: string; wish: string; style: string; token?: string }) => {
    if (!input.feeling.trim() || !input.wish.trim()) throw new Error('INVALID_INPUT')
    return { ...input, feeling: input.feeling.slice(0, 180), wish: input.wish.slice(0, 120) }
  })
  .handler(async ({ data }) => {
    const budget = Number(process.env.AI_GLOBAL_DAILY_BUDGET || '0')
    const day = new Date().toISOString().slice(0, 10)
    if (budgetDay !== day) { budgetDay = day; globalSpend = 0 }
    if (budget <= 0 || globalSpend >= budget) throw new Error('BUDGET_CUTOFF')
    const verifiedSubject = await getVerifiedSubject(data.token).catch(() => null)
    const subject = verifiedSubject || getRequestHeader('x-forwarded-for') || 'anonymous'
    const current = usage.get(subject)
    const count = current?.day === day ? current.count : 0
    const limit = verifiedSubject ? 3 : 1
    if (count >= limit) throw new Error('DAILY_LIMIT')
    usage.set(subject, { day, count: count + 1 }); globalSpend += 1
    return { title: data.wish, message: `願你在${data.feeling}的此刻，仍能找到${data.wish}。`, style: data.style }
  })

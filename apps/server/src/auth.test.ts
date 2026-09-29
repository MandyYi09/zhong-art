import { describe,expect,it,vi } from 'vitest'
import { requireAdmin,requireAuth } from './auth.js'

function response(){const res={status:vi.fn(),json:vi.fn()};res.status.mockReturnValue(res);return res}
describe('server role enforcement',()=>{
  it('rejects anonymous user routes',()=>{const res=response();requireAuth({} as never,res as never,vi.fn());expect(res.status).toHaveBeenCalledWith(401)})
  it('accepts user role on authenticated user routes',()=>{const next=vi.fn();requireAuth({auth:{roles:['user']}} as never,response() as never,next);expect(next).toHaveBeenCalledOnce()})
  it('rejects user role on admin routes',()=>{const res=response();requireAdmin({auth:{roles:['user']}} as never,res as never,vi.fn());expect(res.status).toHaveBeenCalledWith(403)})
  it('accepts admin role on admin routes',()=>{const next=vi.fn();requireAdmin({auth:{roles:['admin']}} as never,response() as never,next);expect(next).toHaveBeenCalledOnce()})
})

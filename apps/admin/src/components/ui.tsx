import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva('inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', {
  variants: { variant: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border bg-card hover:bg-muted', ghost: 'hover:bg-muted',
    destructive: 'bg-destructive text-white hover:bg-destructive/90',
  }, size: { default: 'h-9 px-3', sm: 'h-8 px-2.5 text-xs', icon: 'h-9 w-9 px-0' } },
  defaultVariants: { variant: 'default', size: 'default' },
})
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
export function Button({ className, variant, size, ...props }: ButtonProps) { return <button className={cn(buttonVariants({ variant, size }), className)} {...props} /> }

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('rounded-lg border bg-card text-card-foreground', className)} {...props} /> }
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('flex flex-col gap-1 p-5', className)} {...props} /> }
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) { return <h2 className={cn('text-sm font-semibold', className)} {...props} /> }
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('px-5 pb-5', className)} {...props} /> }
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={cn('h-9 w-full rounded-md border bg-card px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/30 focus:border-ring disabled:opacity-50', className)} {...props} /> }
export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={cn('min-h-24 w-full resize-y rounded-md border bg-card px-3 py-2 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/30 focus:border-ring', className)} {...props} /> }
export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) { return <label className={cn('text-sm font-medium', className)} {...props} /> }
export function Badge({ className, tone = 'neutral', children }: { className?: string; tone?: 'neutral'|'green'|'amber'|'red'|'blue'; children: ReactNode }) {
  const tones = { neutral: 'bg-muted text-muted-foreground', green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15', amber: 'bg-amber-50 text-amber-700 ring-amber-600/15', red: 'bg-red-50 text-red-700 ring-red-600/15', blue: 'bg-blue-50 text-blue-700 ring-blue-600/15' }
  return <span className={cn('inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset', tones[tone], className)}>{children}</span>
}
export function Avatar({ name, className }: { name: string; className?: string }) { return <AvatarPrimitive.Root className={cn('inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent', className)}><AvatarPrimitive.Fallback className="text-xs font-semibold text-accent-foreground">{name.split(/\s/).map(x => x[0]).join('').slice(0, 2)}</AvatarPrimitive.Fallback></AvatarPrimitive.Root> }
export function Progress({ value, className }: { value: number; className?: string }) { return <ProgressPrimitive.Root className={cn('relative h-2 overflow-hidden rounded-full bg-muted', className)} value={value}><ProgressPrimitive.Indicator className="h-full bg-primary transition-transform" style={{ transform: `translateX(-${100 - value}%)` }} /></ProgressPrimitive.Root> }
export function Switch({ checked, onCheckedChange, 'aria-label': ariaLabel }: { checked: boolean; onCheckedChange: (value: boolean) => void; 'aria-label': string }) { return <SwitchPrimitive.Root checked={checked} onCheckedChange={onCheckedChange} aria-label={ariaLabel} className="relative h-5 w-9 rounded-full bg-input transition data-[state=checked]:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><SwitchPrimitive.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[18px]" /></SwitchPrimitive.Root> }

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export function DialogContent({ children, className, title }: { children: ReactNode; className?: string; title: string }) { return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/35 data-[state=open]:animate-in" /><DialogPrimitive.Content className={cn('fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card p-5 shadow-xl focus:outline-none', className)}><div className="mb-5 flex items-start justify-between gap-4"><DialogPrimitive.Title className="text-base font-semibold">{title}</DialogPrimitive.Title><DialogPrimitive.Close asChild><Button size="icon" variant="ghost" aria-label="Close"><X className="h-4 w-4" /></Button></DialogPrimitive.Close></div>{children}</DialogPrimitive.Content></DialogPrimitive.Portal> }

export const AlertDialog = AlertDialogPrimitive.Root
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger
export function AlertDialogContent({ title, description, cancel, action, onAction }: { title: string; description: string; cancel: string; action: string; onAction: () => void }) { return <AlertDialogPrimitive.Portal><AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/35" /><AlertDialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card p-5 shadow-xl"><AlertDialogPrimitive.Title className="text-base font-semibold">{title}</AlertDialogPrimitive.Title><AlertDialogPrimitive.Description className="mt-2 text-sm leading-6 text-muted-foreground">{description}</AlertDialogPrimitive.Description><div className="mt-6 flex justify-end gap-2"><AlertDialogPrimitive.Cancel asChild><Button variant="outline">{cancel}</Button></AlertDialogPrimitive.Cancel><AlertDialogPrimitive.Action asChild><Button onClick={onAction}>{action}</Button></AlertDialogPrimitive.Action></div></AlertDialogPrimitive.Content></AlertDialogPrimitive.Portal> }

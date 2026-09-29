import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

export function Button({ className = '', variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' }) {
  return <button className={`button button-${variant} ${className}`} {...props} />
}

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`badge ${className}`}>{children}</span>
}

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`surface ${className}`} {...props} />
}

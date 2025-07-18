'use client'

import { FC, InputHTMLAttributes, useState } from 'react'
import { cn } from '@/app/shared/libs'

export const TagSearchInput: FC<
  Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    value: string
    onChange: (value: string) => void
    inputClassName?: string
  }
> = ({
  className,
  value,
  onChange,
  inputClassName,
  ...props
}) => {
  return (
    <div className={cn(className, 'flex items-center relative')} {...props}>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        type="text"
        placeholder="Поиск по тегам..."
        className={cn("h-10 w-full rounded-full px-4 pb-0.5 pl-11 text-sm font-medium text-white/100 placeholder-white border border-white/40", inputClassName)}
        style={{ background: 'linear-gradient(90deg, #000000 0%, #75BE40 100%)' }}
      />
      <svg className="absolute top-1/2 left-4 -translate-y-1/2 transform stroke-white/60" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.6 10.6z"/></svg>
    </div>
  )
} 
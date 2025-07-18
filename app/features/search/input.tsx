'use client'

import { cn } from '@/app/shared/libs'
import { Icons } from '@/app/shared/ui/icons'
import { FC, HTMLAttributes } from 'react'
import { useHeader } from '@/app/shared/store/header-store'

type SearchInputProps = HTMLAttributes<HTMLInputElement> & {
  value: string
  inputClassName?: string
}

export const SearchInput: FC<SearchInputProps> = ({
  className,
  value,
  inputClassName,
  ...props
}) => {
  const { search_opened, setSearchOpened } = useHeader()

  return (
    <div className={cn(className, 'flex items-center')} {...props}>
      <input
        value={value}
        readOnly
        onChange={() => {}}
        onClick={() => setSearchOpened(true)}
        type="text"
        placeholder="Найдется всё..."
        className={cn("h-10 w-full rounded-full px-4 pb-0.5 pl-11 text-sm font-medium text-white/100 placeholder-white border border-white/40", inputClassName)}
        style={{ background: 'linear-gradient(90deg, #000000 0%, #75BE40 100%)' }}
      />
      <Icons.Search className="absolute top-1/2 left-4 -translate-y-1/2 transform stroke-white/60" />
    </div>
  )
}

'use client'

import { Icons } from '../shared/ui/icons'
import { FC } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/app/shared/libs'
import { useHeader } from '@/app/shared/store/header-store'

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Сначала новые', width: 110 },
  { value: 'createdAt:asc', label: 'Сначала старые', width: 116 },
  { value: 'popularity:desc', label: 'Сначала популярные', width: 150 },
  { value: 'popularity:asc', label: 'Сначала не популярные', width: 171 },
]

type FiltersProps = {
  isSearch: boolean
  className?: string
}

export const Filters: FC<FiltersProps> = ({ isSearch, className }) => {
  const { sort, setSort } = useHeader()
  const pathname = usePathname()

  const shouldShow =
    isSearch ||
    pathname === '/' ||
    (pathname.startsWith('/tag') && pathname !== '/tags') ||
    pathname.startsWith('/category')

  if (!shouldShow) return null

  const selectId = 'sort-select'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="mr-[26px] flex flex-row items-center gap-1 text-sm font-medium text-white/60">
        <Icons.List className="fill-white/60" />
        Сортировка:
      </div>
      <div className="flex flex-row items-center gap-1">
        <label htmlFor={selectId} className="sr-only">
          Сортировка по
        </label>
        <select
          id={selectId}
          value={sort}
          style={{ width: SORT_OPTIONS.find((s) => s.value === sort)?.width }}
          onChange={(e) => setSort(e.target.value)}
          className="cursor-pointer appearance-none border-none bg-transparent pr-1 text-sm font-medium text-white outline-none"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value} className="text-black">
              {label}
            </option>
          ))}
        </select>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 10l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

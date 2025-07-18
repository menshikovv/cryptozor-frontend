'use client'

import { cn } from '@/app/shared/libs'
import Link from 'next/link'
import { FC, HTMLAttributes } from 'react'
import { usePathname } from 'next/navigation'

type CategoryProps = HTMLAttributes<HTMLDivElement> & {
  href: string
  isDrawer?: boolean
}

export const Category: FC<CategoryProps> = ({
  children,
  isDrawer = false,
  className,
  href,
}) => {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      className={cn(
        className,
        isDrawer
          ? pathname.includes(href) && 'bg-lemon/15 !text-lemon border-0'
          : pathname.includes(href) && 'rainbow-box bg-white/5',
        'flex h-10 items-center rounded-xl border-1 border-transparent px-4 text-sm font-medium text-white transition-colors hover:bg-white/5',
      )}
    >
      {children}
    </Link>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Filters } from '@/app/features/filters'
import { OpenDrawer } from '@/app/features/drawer/open'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import CurrentPageLabel from './current-page-label'

type MobileHeaderProps = {
  tags: any[]
  categories: any[]
}

export default function MobileHeader({
  tags,
  categories,
}: MobileHeaderProps) {
  const pathname = usePathname();
  const isArticlePage = pathname.startsWith('/article/');
  return (
    <header className="bg-bg/80 tablet-small:px-7 tablet-small:flex-row tablet-small:hidden sticky top-0 z-50 flex w-full flex-col items-center justify-between px-0 pt-5 pb-6 backdrop-blur">
      <div
        className={
          'tablet-small:hidden flex w-full flex-row items-center justify-between'
        }
      >
        <Link href="/" className="flex flex-row items-center -ml-4">
          <Image
            width={110}
            height={80}
            className={
              'max-h-[80px] min-h-[80px] max-w-[110px] min-w-[110px]'
            }
            src="/logo.svg"
            alt="Logo"
          />
        </Link>
        <div className="flex-1 flex justify-center">
          <CurrentPageLabel tags={tags} categories={categories} />
        </div>
        <OpenDrawer />
      </div>
      <Filters className={'mt-6 w-full justify-between'} isSearch={false} />
    </header>
  )
}

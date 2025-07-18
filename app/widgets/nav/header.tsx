'use client'

import { Filters } from '@/app/features/filters'
import CurrentPageLabel from './current-page-label'
import { usePathname } from 'next/navigation'

type HeaderProps = {
  tags: any[]
  categories: any[]
}

export default function Header({ tags, categories }: HeaderProps) {
  const pathname = usePathname();
  const isArticlePage = pathname.startsWith('/article/');
  return (
    <header className="bg-bg/80 tablet-small:px-7 tablet-small:flex-row tablet-small:flex sticky top-0 z-50 hidden h-20 w-full flex-col items-center justify-between px-0 py-0 backdrop-blur empty:mb-6 empty:h-0">
      <div className="flex flex-row items-center w-full justify-between">
        <CurrentPageLabel tags={tags} categories={categories} />
        <Filters
          className={'tablet-small:w-fit tablet-small:justify-start justify-between'}
          isSearch={false}
        />
      </div>
    </header>
  )
}

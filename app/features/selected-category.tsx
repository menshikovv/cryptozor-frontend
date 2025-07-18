'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { cn } from '@/app/shared/libs'

type SelectedCategoryProps = {
  categories: any[]
  tags: any[]
  className?: string
}

export default function SelectedCategory({
  categories,
  tags,
  className,
}: SelectedCategoryProps) {
  const pathname = usePathname()

  const category = useMemo(() => {
    return categories.find((category) => pathname.includes(category.slug))
  }, [pathname, categories])

  const tag = useMemo(() => {
    return tags.find((tag) => pathname.includes(tag.slug))
  }, [pathname, tags])

  const shouldHide = pathname.startsWith('/article')

  const isOpenTagsPage = pathname === '/tags'
  const isAboutPage = pathname === '/about'
  const isNotFoundPage = pathname === '/not-found'

  const isCategoryPage = pathname.startsWith('/category/') && category;
  const isTagPage = pathname.startsWith('/tag/') && tag;
  const isHomePage = pathname === '/';

  if (shouldHide || isHomePage || isOpenTagsPage) {
    return <></>;
  }

  let label = '';
  if (isNotFoundPage) {
    label = 'Error 404';
  } else if (isAboutPage) {
    label = 'Открытая страничка';
  } else if (isCategoryPage) {
    label = category.title;
  } else if (isTagPage) {
    label = tag.title;
  } else {
    label = 'Все новости';
  }

  let prefix = '';
  if (isCategoryPage) {
    prefix = 'Выбранная категория:';
  } else if (isTagPage) {
    prefix = 'Выбранный тег:';
  } else if (isAboutPage) {
    prefix = '';
  } else if (isNotFoundPage) {
    prefix = '';
  }

  return (
    <div className={cn('flex max-h-10 items-center gap-2', className)}>
      {prefix && (
        <h1 className="tablet-small:flex hidden text-sm font-medium text-white/60">
          {prefix}
        </h1>
      )}
      <h1 className="border-primary flex h-10 items-center border-b text-base font-medium text-white tablet-small:text-sm">
        {label}
      </h1>
    </div>
  )
}

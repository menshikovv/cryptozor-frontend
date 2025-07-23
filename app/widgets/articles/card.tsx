'use client'

import Image from 'next/image'
import { Badge } from '@/app/shared/ui/badge'
import { BASE_URL } from '@/app/shared/config'
import Link from 'next/link'
import { Article } from '@/app/shared/types'
import { cn, formatDate } from '@/app/shared/libs'
import { useMemo, useState } from 'react'
import { useMediaQuery } from '@siberiacancode/reactuse'
import { Eye } from 'lucide-react'
import { useIsClient } from '@/app/shared/hooks/useIsClient'

export const ArticleCard = ({
  article,
  isLarge,
  isSearch = false,
  className,
}: {
  article: Article
  isLarge: boolean
  isSearch?: boolean
  className?: string
}) => {
  const isClient = useIsClient()

  const formattedDate = formatDate(article.createdAt)
  const wallpaperUrl = BASE_URL + (article.wallpaper?.url || '')

  const totalViews = useMemo(() => {
    return Number(article.organic_views) + Number(article.boosted_views)
  }, [article.organic_views, article.boosted_views])

  const isMobile = useMediaQuery('(max-width: 768px)')
  const isLargeFinal = !isMobile ? isLarge : false

  const imageHeightClass = 'aspect-[16/9]'

  if (!isClient) return null

  return (
    <div
      key={article.id}
      className={cn(
        'article-gradient-bg',
        isSearch && 'tablet-small:rainbow-box-3',
        isLargeFinal ? 'rounded-2xl' : 'rounded-xl',
        'flex flex-col overflow-hidden bg-white/5',
        'border border-transparent border-[0.2px] transition-colors duration-500',
        'relative group',
        className // добавляем сюда
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{background: 'rgba(255,255,255,0.10)'}}
      />
      <div
        className={cn(
          imageHeightClass,
          'relative flex items-center justify-center',
        )}
      >
        <Image
          src={wallpaperUrl}
          alt={article.title || 'preview'}
          className={cn(
            'rounded object-cover object-center',
            isSearch && 'p-0',
          )}
          fill
          placeholder="empty"
          priority
          sizes={
            isLargeFinal
              ? '(min-width: 768px) 50vw, 100vw'
              : '(min-width: 768px) 25vw, 100vw'
          }
        />
      </div>

      <div
        className={cn(
          'relative flex h-full flex-col gap-3',
          isLargeFinal ? 'p-3' : 'p-2',
        )}
      >
        <h3
          className={cn(
            isLargeFinal ? 'text-base' : 'tablet-small:text-sm text-xs',
            'line-clamp-3 leading-tight font-semibold text-white uppercase',
          )}
        >
          {article.title}
        </h3>

        <div className="mt-auto flex flex-wrap items-center gap-1">
          {article.categories?.[0] && (
            <Badge>{article.categories[0].title}</Badge>
          )}
          {article.tags.map((tag) => (
            <Badge key={tag.id} icon={BASE_URL + (tag?.icon?.url || '')}>
              {tag.title}
            </Badge>
          ))}
        </div>

        <div className="tablet-small:text-xs flex items-center gap-1.5 text-[10px] text-white/60 uppercase">
          {formattedDate} • {totalViews}
          <Eye className="size-3.5" />
        </div>
      </div>
    </div>
  )
}

export const ArticleCardSkeleton = ({ isLarge }: { isLarge: boolean }) => {
  const isClient = useIsClient()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isLargeFinal = !isMobile ? isLarge : false

  if (!isClient) return null

  const imageHeightClass = 'aspect-[16/9]'

  return (
    <div
      className={cn(
        isLargeFinal ? 'rounded-2xl' : 'rounded-xl',
        'flex flex-col overflow-hidden bg-white/5',
      )}
    >
      <div
        className={cn(
          imageHeightClass,
          'relative flex animate-pulse items-center justify-center bg-white/10',
        )}
      />

      <div
        className={cn(
          'flex h-full flex-col gap-3',
          isLargeFinal ? 'p-4' : 'p-2.5',
        )}
      >
        <div
          className={cn(
            isLargeFinal ? 'h-6' : 'h-4',
            'w-full animate-pulse rounded bg-white/10',
          )}
        />
        <div
          className={cn(
            isLargeFinal ? 'h-6' : 'h-4',
            'w-3/4 animate-pulse rounded bg-white/10',
          )}
        />

        <div className="mt-auto flex flex-wrap items-center gap-1">
          <div className="h-5 w-16 animate-pulse rounded-full bg-white/10" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-white/10" />
        </div>

        <div className="flex items-center gap-1.5">
          <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </div>
  )
}

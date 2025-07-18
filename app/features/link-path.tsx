'use client'

import { BackButton } from '@/app/article/[slug]/BackButton'
import Link from 'next/link'
import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArticleContent } from '@/app/widgets/articles/content'
import { PreviousPathHandler } from '@/app/article/[slug]/PreviousPathHandler'
import { NavigationHandler } from '@/app/article/[slug]/NavigationHandler'
import { API_URL } from '@/app/shared/config'
import { usePreloadRelatedArticles } from '@/app/shared/hooks/usePreloadData'

type LinkPathProps = {
  article: any
  referer: any
  slug: string
  reactions: any[]
  views: any
}

export const LinkPath: FC<LinkPathProps> = ({
  slug,
  referer,
  article,
  reactions,
  views,
}) => {
  const currentPath = `/article/${slug}`
  const containerRef = useRef<HTMLDivElement>(null)
  const [barStyle, setBarStyle] = useState({ left: 0, width: 0 })

  // Предзагружаем связанные статьи
  usePreloadRelatedArticles(article.id)

  useEffect(() => {
    const handle = async () => {
      try {
        await fetch(`${API_URL}/articles/${article.documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              organic_views: (Number(views.organic_views) + 1).toString(),
            },
          }),
        })
      } catch (error) {
        console.error('Error updating views:', error)
      }
    }

    handle()
  }, [])

  const category =
    article.categories.find((category: any) =>
      referer?.includes(category.slug),
    ) || article.categories[0]

  const tag = article.tags.find((tag: any) => referer?.includes(tag.slug))

  useLayoutEffect(() => {
    const updateBarStyle = () => {
      if (containerRef.current) {
        const { left, width } = containerRef.current.getBoundingClientRect()
        setBarStyle({ left, width })
      }
    }

    const raf = requestAnimationFrame(updateBarStyle)

    window.addEventListener('resize', updateBarStyle)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', updateBarStyle)
    }
  }, [])

  return (
    <>
      <div className="with-right-fade relative flex flex-row items-center gap-2 overflow-x-auto text-base font-medium text-white/60">
        <div
          style={{
            width: barStyle.width,
          }}
          className={'back_button flex flex-row items-center gap-2'}
        >
          <BackButton />
          {category && (
            <>
              <Link
                href={`/category/${category.slug}`}
                className="flex items-center gap-2 text-nowrap"
              >
                {category.title}
              </Link>
              /
            </>
          )}
          {tag && (
            <>
              <Link
                href={`/tag/${tag.slug}`}
                className="flex items-center gap-2 text-nowrap"
              >
                {tag.title}
              </Link>
              /
            </>
          )}
          <Link
            href={`/article/${article.slug}`}
            className="flex items-center gap-2 !text-white"
          >
            <span className={'text-nowrap'}>{article.title}</span>
          </Link>
        </div>
      </div>
      
      <ArticleContent
        views={views}
        containerRef={containerRef}
        article={article}
        reactions={reactions}
      />
      
      <PreviousPathHandler currentPath={currentPath} referer={referer} />
      <NavigationHandler slug={slug} />
    </>
  )
}

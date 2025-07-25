'use client'

import { API_URL } from '@/app/shared/config'
import { ArticleCard } from '@/app/widgets/articles/card'
import { useEffect, useMemo, useState, useRef } from 'react'
import { useHeader } from '@/app/shared/store/header-store'
import Link from 'next/link'

type ArticlesListProps = {
  isDefaultLayout?: boolean
  isTagPage?: { tag_id: string }
  isCategoryPage?: { category_id: string }
  excludeArticleId?: string
}

export default function ArticlesList({
  isDefaultLayout = false,
  isTagPage,
  isCategoryPage,
  excludeArticleId,
}: ArticlesListProps) {
  const { sort } = useHeader()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const observerTarget = useRef<HTMLDivElement>(null)

  const pageSize = isDefaultLayout ? 16 : 10

  useEffect(() => {
    setArticles([])
    setPage(1)
    setHasMore(true)
    setLoadingMore(false)
  }, [sort, isCategoryPage, isTagPage, excludeArticleId])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && hasMore) {
          setPage(prev => prev + 1)
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [loading, loadingMore, hasMore])

  useEffect(() => {
    const fetchArticles = async () => {
      if (page === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const params = new URLSearchParams()

      if (!sort.includes('popularity')) {
        params.append('sort', sort)
      }

      params.append('pagination[page]', String(page))
      params.append('pagination[pageSize]', String(pageSize))

      if (isTagPage) {
        params.append('filters[tags][id][$eq]', isTagPage.tag_id)
      }

      if (isCategoryPage) {
        params.append('filters[categories][id][$eq]', isCategoryPage.category_id)
      }

      if (excludeArticleId) {
        params.append('filters[id][$ne]', excludeArticleId)
      }

      try {
        const url = `${API_URL}/articles?populate[wallpaper][populate]&populate[tags][populate]=icon&populate[categories][populate]&${decodeURIComponent(params.toString())}`

        const res = await fetch(url)
        const json = await res.json()

        const newArticles = json.data || []
        
        const pagination = json.meta?.pagination
        
        if (pagination) {
          setHasMore(pagination.page < pagination.pageCount)
        } else {
          setHasMore(false)
        }
        setArticles((prev) => (page === 1 ? newArticles : [...prev, ...newArticles]))
      } catch (error) {
        console.error('Failed to fetch articles:', error)
      } finally {
        if (page === 1) {
          setLoading(false)
        } else {
          setLoadingMore(false)
        }
      }
    }

    if (hasMore) {
      fetchArticles()
    }
  }, [sort, excludeArticleId, page, pageSize, isCategoryPage, isTagPage])

  const sortByPopularityDesc = (a: any, b: any) => {
    const aPopularity = Number(a.organic_views) + Number(a.boosted_views)
    const bPopularity = Number(b.organic_views) + Number(b.boosted_views)
    return Number(bPopularity - aPopularity)
  }

  const sortByPopularityAsc = (a: any, b: any) => {
    const aPopularity = Number(a.organic_views) + Number(a.boosted_views)
    const bPopularity = Number(b.organic_views) + Number(b.boosted_views)
    return Number(aPopularity - bPopularity)
  }

  const sortedArticles = useMemo(() => {
    if (sort === 'popularity:desc') {
      return [...articles].sort(sortByPopularityDesc)
    }
    if (sort === 'popularity:asc') {
      return [...articles].sort(sortByPopularityAsc)
    }
    return articles
  }, [articles, sort])

  const filteredArticles = useMemo(() => {
    if (!excludeArticleId) return sortedArticles;
    return sortedArticles.filter(article => String(article.id) !== String(excludeArticleId));
  }, [sortedArticles, excludeArticleId]);

  if (isDefaultLayout) {
    return (
      <div
        className={
          'tablet-small:gap-5 tablet-small:grid-cols-2 tablet:grid-cols-3 grid w-full grid-cols-2 gap-3 items-stretch'
        }
      >
        {filteredArticles.map((article) => (
          <Link key={article.id} href={`/article/${article.slug}`} className="h-full">
            <ArticleCard article={article} isLarge={false} className="h-full" />
          </Link>
        ))}
        {hasMore && (
          <div ref={observerTarget} className="h-10 w-full flex items-center justify-center">
          </div>
        )}
      </div>
    )
  }

  const [first, second, ...rest] = filteredArticles

  return (
    <div className="tablet-small:gap-5 flex w-full flex-col gap-3">
      <div className="tablet-small:grid-cols-2 tablet-small:gap-5 grid w-full grid-cols-1 gap-3 items-stretch">
        {[first, second].map(
          (article) =>
            article && (
              <Link key={article.id} href={`/article/${article.slug}`} className="h-full">
                <ArticleCard article={article} isLarge className="h-full" />
              </Link>
            ),
        )}
      </div>
      <div className="tablet-small:grid-cols-3 tablet-small:gap-5 grid grid-cols-2 gap-3 items-stretch">
        {rest.map((article) => (
          <Link key={article.id} href={`/article/${article.slug}`} className="h-full">
            <ArticleCard article={article} isLarge={false} className="h-full" />
          </Link>
        ))}
        {hasMore && (
          <div ref={observerTarget} className="h-10 w-full col-span-full flex items-center justify-center">
          </div>
        )}
      </div>
    </div>
  )
}

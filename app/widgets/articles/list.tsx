'use client'

import { API_URL } from '@/app/shared/config'
import { ArticleCard } from '@/app/widgets/articles/card'
import { useEffect, useMemo, useState } from 'react'
import { useHeader } from '@/app/shared/store/header-store'
import Link from 'next/link'

type ArticlesListProps = {
  isDefaultLayout?: boolean
  isTagPage?: { tag_id: string }
  isCategoryPage?: { category_id: string }
  excludeArticleId?: string
}

// Компонент пагинации
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void 
}) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-center gap-3 mt-12 mb-8">
      {/* Кнопка "Предыдущая" */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-12 h-12 rounded-[11px] border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-button"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Номера страниц */}
      {visiblePages.map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="flex items-center justify-center w-12 h-12 text-white/60 font-medium">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`flex items-center justify-center w-12 h-12 rounded-[11px] border font-semibold text-base transition-all duration-200 ${
                currentPage === page
                  ? 'bg-primary border-primary text-white shadow-button'
                  : 'border-white/10 bg-white/5 text-white hover:bg-white/10 shadow-button'
              }`}
            >
              {page}
            </button>
          )}
        </div>
      ))}

      {/* Кнопка "Следующая" */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-12 h-12 rounded-[11px] border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-button"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalArticles, setTotalArticles] = useState(0)

  const pageSize = isDefaultLayout ? 16 : 10

  useEffect(() => {
    setArticles([])
    setCurrentPage(1)
  }, [sort, isCategoryPage, isTagPage, excludeArticleId])

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)

      const params = new URLSearchParams()

      if (!sort.includes('popularity')) {
        params.append('sort', sort)
      }

      params.append('pagination[page]', String(currentPage))
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
          setTotalPages(pagination.pageCount)
          setTotalArticles(pagination.total)
        } else {
          setTotalPages(1)
          setTotalArticles(newArticles.length)
        }
        
        setArticles(newArticles)
      } catch (error) {
        console.error('Failed to fetch articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [sort, excludeArticleId, currentPage, pageSize, isCategoryPage, isTagPage])

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Прокрутка к началу страницы при смене страницы
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (isDefaultLayout) {
    return (
      <div className="w-full">
        <div className="tablet-small:gap-5 tablet-small:grid-cols-2 tablet:grid-cols-3 grid w-full grid-cols-2 gap-3 items-stretch">
          {filteredArticles.map((article) => (
            <Link key={article.id} href={`/article/${article.slug}`} className="h-full">
              <ArticleCard article={article} isLarge={false} className="h-full" />
            </Link>
          ))}
        </div>
        
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        )}
      </div>
    )
  }

  const [first, second, ...rest] = filteredArticles

  return (
    <div className="w-full">
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
        </div>
      </div>
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}
    </div>
  )
}

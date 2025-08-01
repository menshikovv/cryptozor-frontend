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
  const [isExpanded, setIsExpanded] = useState(false)

  const getVisiblePages = () => {
    // Если развернуто, показываем все страницы
    if (isExpanded) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Показываем текущую страницу с соседними и последнюю страницу
    const pages = []
    
    if (currentPage === 1) {
      // Для первой страницы: 1 2 3 ... 139
      pages.push(1, 2, 3)
      if (totalPages > 3) {
        pages.push('...', totalPages)
      }
         } else {
       // Для остальных страниц: текущая страница с соседними
       const start = Math.max(1, currentPage - 1)
       const end = Math.min(totalPages, currentPage + 1)
       
       for (let i = start; i <= end; i++) {
         pages.push(i)
       }
       
       // Добавляем последнюю страницу, если она не входит в диапазон
       if (totalPages > end) {
         pages.push('...', totalPages)
       }
     }

    return pages
  }

  const handleDotsClick = () => {
    setIsExpanded(true)
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-center gap-3 mt-12 mb-8">
      {/* Кнопка "Предыдущая" */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-8 h-8 text-white hover:text-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg font-medium"
      >
        &lt;
      </button>

      {/* Номера страниц */}
      {isExpanded ? (
        // Если развернуто, показываем все страницы в строчку с переносом
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-full">
          {visiblePages.map((page, index) => (
            <button
              key={index}
              onClick={() => onPageChange(page as number)}
              className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-base transition-all duration-200 ${
                currentPage === page
                  ? 'bg-green-600 text-white'
                  : 'text-white hover:text-white/80'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      ) : (
        // Обычный режим с "..." кнопкой
        visiblePages.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <button
                onClick={handleDotsClick}
                className="flex items-center justify-center w-8 h-8 text-white font-medium hover:text-white/80 cursor-pointer transition-all duration-200"
              >
                ...
              </button>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-base transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-green-700 text-white'
                    : 'text-white hover:text-white/80'
                }`}
              >
                {page}
              </button>
            )}
          </div>
        ))
      )}

      {/* Кнопка "Следующая" */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-8 h-8 text-white hover:text-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg font-medium"
      >
        &gt;
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
  const [showPagination, setShowPagination] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalArticles, setTotalArticles] = useState(0)

  const pageSize = isDefaultLayout ? 16 : 10

  useEffect(() => {
    setArticles([])
    setCurrentPage(1)
    setShowPagination(false)
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
      } finally {
        setLoading(false)
        // Показываем пагинацию с небольшой задержкой после загрузки
        setTimeout(() => {
          setShowPagination(true)
        }, 300)
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
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-12 h-12 rounded-full border-4 border-transparent border-t-purple-500 border-r-purple-500 animate-spin"></div>
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
        
        {totalPages > 1 && showPagination && (
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
      
      {totalPages > 1 && showPagination && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}
    </div>
  )
}

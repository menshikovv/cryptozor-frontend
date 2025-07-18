import { useEffect } from 'react'
import { API_URL } from '@/app/shared/config'

export function usePreloadData(slug: string) {
  useEffect(() => {
    // Предзагружаем данные статьи
    const preloadArticle = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 секунд таймаут

        await fetch(
          `${API_URL}/articles?filters[slug][$eq]=${slug}&populate[wallpaper][populate]&populate[tags][populate]=icon&populate[categories][populate]&populate[seo][populate]=og_image&populate[button][populate]=*`,
          { 
            signal: controller.signal,
            priority: 'high'
          }
        )

        clearTimeout(timeoutId)
      } catch (error) {
        console.debug('Preload failed:', error)
      }
    }

    if (slug) {
      preloadArticle()
    }
  }, [slug])
}

export function usePreloadRelatedArticles(excludeArticleId?: string) {
  useEffect(() => {
    const preloadRelated = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)

        const params = new URLSearchParams()
        params.append('pagination[page]', '1')
        params.append('pagination[pageSize]', '10')

        if (excludeArticleId) {
          params.append('filters[id][$ne]', excludeArticleId)
        }

        await fetch(
          `${API_URL}/articles?populate[wallpaper][populate]&populate[tags][populate]=icon&populate[categories][populate]&${decodeURIComponent(params.toString())}`,
          { 
            signal: controller.signal,
            priority: 'low'
          }
        )

        clearTimeout(timeoutId)
      } catch (error) {
        console.debug('Related articles preload failed:', error)
      }
    }

    preloadRelated()
  }, [excludeArticleId])
} 
import { API_URL } from '@/app/shared/config'

export async function getArticle(slug: string) {
  try {
    const res = await fetch(
      `${API_URL}/articles?filters[slug][$eq]=${slug}&populate[wallpaper][populate]&populate[tags][populate]=icon&populate[categories][populate]&populate[seo][populate]=og_image&populate[button][populate]=*`,
      { next: { revalidate: 100 } },
    )
    if (!res.ok) {
      console.error(`Failed to fetch article with slug: ${slug}, status: ${res.status}`)
      return null
    }
    const json = await res.json()
    return Array.isArray(json.data) && json.data.length > 0 ? json.data[0] : null
  } catch (error) {
    console.error(`Error fetching article with slug: ${slug}`, error)
    return null
  }
}

export async function getArticleViews(documentId: string) {
  try {
    const res = await fetch(
      `${API_URL}/articles/${documentId}?fields[1]=organic_views&fields[2]=boosted_views`,
      { next: { revalidate: 1 } },
    )
    if (!res.ok) {
      console.error(`Failed to fetch article views for documentId: ${documentId}, status: ${res.status}`)
      return { organic_views: 0, boosted_views: 0 }
    }
    const json = await res.json()
    return json.data
  } catch (error) {
    console.error(`Error fetching article views for documentId: ${documentId}`, error)
    return { organic_views: 0, boosted_views: 0 }
  }
}

export async function getReactions(documentId: string) {
  try {
    const res = await fetch(
      `${API_URL}/reactions?filters[article][documentId][$eq]=${documentId}`,
      { next: { revalidate: 1 } },
    )
    if (!res.ok) {
      console.error(`Failed to fetch reactions for documentId: ${documentId}, status: ${res.status}`)
      return []
    }
    const json = await res.json()
    return json.data
  } catch (error) {
    console.error(`Error fetching reactions for documentId: ${documentId}`, error)
    return []
  }
}

export async function getRelatedArticles(articleTags: any[], excludeArticleId: string) {
  if (!articleTags || articleTags.length === 0) {
    return []
  }
  try {
    const tagIds = articleTags.map(tag => tag.id)
    const tagFilters = tagIds.map((tagId, index) => 
      `filters[tags][id][$in][${index}]=${tagId}`
    ).join('&')
    const res = await fetch(
      `${API_URL}/articles?populate[wallpaper][populate]&populate[tags][populate]=icon&populate[categories][populate]&filters[id][$ne]=${excludeArticleId}&${tagFilters}&pagination[pageSize]=10&sort=publishedAt:desc`,
      { next: { revalidate: 100 } },
    )
    if (!res.ok) {
      console.error(`Failed to fetch related articles for articleId: ${excludeArticleId}, status: ${res.status}`)
      return []
    }
    const json = await res.json()
    return json.data
  } catch (error) {
    console.error(`Error fetching related articles for articleId: ${excludeArticleId}`, error)
    return []
  }
} 
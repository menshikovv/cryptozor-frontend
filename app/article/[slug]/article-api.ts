import { API_URL } from '@/app/shared/config'

export async function getArticle(slug: string) {
  const res = await fetch(
    `${API_URL}/articles?filters[slug][$eq]=${slug}&populate[wallpaper][populate]&populate[tags][populate]=icon&populate[categories][populate]&populate[seo][populate]=og_image&populate[button][populate]=*`,
    { next: { revalidate: 100 } },
  )
  if (!res.ok) console.log(res)
  const json = await res.json()
  return Array.isArray(json.data) && json.data.length > 0 ? json.data[0] : null
}

export async function getArticleViews(documentId: string) {
  const res = await fetch(
    `${API_URL}/articles/${documentId}?fields[1]=organic_views&fields[2]=boosted_views`,
    { next: { revalidate: 1 } },
  )
  if (!res.ok) throw new Error('Failed to fetch article views')
  const json = await res.json()
  return json.data
}

export async function getReactions(documentId: string) {
  const res = await fetch(
    `${API_URL}/reactions?filters[article][documentId][$eq]=${documentId}`,
    { next: { revalidate: 1 } },
  )
  if (!res.ok) throw new Error('Failed to fetch reactions')
  const json = await res.json()
  return json.data
}

export async function getRelatedArticles(articleTags: any[], excludeArticleId: string) {
  if (!articleTags || articleTags.length === 0) {
    return []
  }
  const tagIds = articleTags.map(tag => tag.id)
  const tagFilters = tagIds.map((tagId, index) => 
    `filters[tags][id][$in][${index}]=${tagId}`
  ).join('&')
  const res = await fetch(
    `${API_URL}/articles?populate[wallpaper][populate]&populate[tags][populate]=icon&populate[categories][populate]&filters[id][$ne]=${excludeArticleId}&${tagFilters}&pagination[pageSize]=10&sort=publishedAt:desc`,
    { next: { revalidate: 100 } },
  )
  if (!res.ok) throw new Error('Failed to fetch related articles')
  const json = await res.json()
  return json.data
} 
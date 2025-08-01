export const revalidate = 1

import { SITEMAP_CONFIG } from './shared/config'

async function fetchAllPaginated(url: string, token?: string) {
  let page = 1;
  const pageSize = 100;
  let allData: any[] = [];
  let total = 0;
  do {
    const res = await fetch(
      `${url}${url.includes('?') ? '&' : '?'}pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: 'no-store',
      },
    )
    if (!res.ok) {
      break
    }
    const json = await res.json()
    if (Array.isArray(json.data)) {
      allData = allData.concat(json.data)
    }
    total = json.meta?.pagination?.total || 0
    page++
  } while (allData.length < total)
  return allData
}

export default async function sitemap(): Promise<
  {
    url: string
    lastModified: Date
    changeFrequency: string
    priority: number
  }[]
> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const token = process.env.STRAPI_API_TOKEN

  const nonArticleEntries = (await fetchAllPaginated(`${apiUrl}/sitemap-entries?sort=updatedAt:desc`, token)).filter((item: any) => !item.url.startsWith('/article/'))

  const articles = await fetchAllPaginated(`${apiUrl}/articles?sort=updatedAt:desc`, token)

  const articleEntries = articles.map((article: any) => ({
    url: `https://cryptozor.ru/article/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.updated_at),
    changeFrequency: SITEMAP_CONFIG.changeFrequency.articles,
    priority: 0.5,
  }))

  const otherEntries = nonArticleEntries.map((item: any) => ({
    url: item.url,
    lastModified: new Date(item.last_modified),
    changeFrequency: item.change_frequency,
    priority: item.priority,
  }))

  return [...otherEntries, ...articleEntries]
}
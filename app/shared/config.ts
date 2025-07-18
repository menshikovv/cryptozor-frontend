export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL

export const SITEMAP_CONFIG = {
  priorities: {
    home: 1.0,
    categories: 0.8,
    articles: 0.7,
    tags: 0.6,
    about: 0.5,
  },
  changeFrequency: {
    home: 'daily' as const, 
    categories: 'weekly' as const,
    articles: 'weekly' as const,
    tags: 'weekly' as const,
    about: 'monthly' as const,
  },
  cacheTime: 3600,
}

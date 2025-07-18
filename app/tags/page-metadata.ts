import { BASE_URL, API_URL } from '@/app/shared/config'
import { Metadata } from 'next'
// @ts-ignore
import { parseBlocks } from 'strapi-blocks-parser'

async function getTagsPageSEO() {
  const res = await fetch(`${API_URL}/tags-page?populate=seo&populate=seo.og_image`, {
    next: { revalidate: 100 },
  })
  if (!res.ok) return null
  const json = await res.json()
  return json.data
}

export default async function generateMetadata(): Promise<Metadata> {
  const tagsPageData = await getTagsPageSEO()
  
  if (!tagsPageData?.seo) {
    return {
      title: 'Все темы новостей CryptoZor — P2P, арбитраж, криптоаналитика и события криптомира',
      description: 'Открой все новостные категории CryptoZor: от P2P-арбитража и криптотрейдинга до аналитики и законодательных изменений. Следи за ключевыми событиями в мире криптовалют.',
      keywords: 'CryptoZor, криптовалютные новости, P2P арбитраж, крипто аналитика, криптовалюта законы, крипто события, трейдинг крипта, биржи, блокчейн, актуальные криптоновости',
      openGraph: {
        title: 'Темы новостей CryptoZor — P2P, арбитраж, аналитика и криптособытия',
        description: 'Изучайте все ключевые направления CryptoZor: P2P-арбитраж, трейдинг, криптоаналитика, свежие новости, изменения в законах и многое другое.',
        type: 'website',
        url: 'https://cryptozor.ru/tags/',
      },
    }
  }

  const { seo } = tagsPageData

  return {
    title: seo?.title_tag,
    description: seo?.meta_description,
    keywords: seo?.meta_keywords?.split(',').map((k: string) => k.trim()),

    openGraph: {
      title: seo?.og_title,
      type: seo?.og_type,
      url: seo?.og_url,
      description: seo?.og_description,
      images: seo?.og_image?.url ? [
        {
          url: BASE_URL + seo.og_image.url,
          width: seo.og_image.width,
          height: seo.og_image.height,
          alt: seo.og_image.alternativeText || seo?.og_title,
        }
      ] : undefined,
    },
  }
} 
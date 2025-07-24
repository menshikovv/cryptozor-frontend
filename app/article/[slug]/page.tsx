import { API_URL, BASE_URL } from '@/app/shared/config'
import { headers } from 'next/headers'
import { ArticleCard } from '@/app/widgets/articles/card'
import { LinkPath } from '@/app/features/link-path'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { PageLoadingSpinner } from '@/app/shared/ui/loading-indicator'
import { Suspense } from 'react'
import ArticleContentLoader from './ArticleContentLoader'
import { getArticle, getReactions, getArticleViews, getRelatedArticles } from './article-api'

async function getArticles() {
  const res = await fetch(
    `${API_URL}/articles?populate[wallpaper][populate]&populate[tags][populate]=icon&pagination[limit]=-1`,
    { next: { revalidate: 100 } },
  )
  if (!res.ok) throw new Error('Failed to fetch articles')
  const json = await res.json()
  return json.data
}

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map((article: any) => ({ slug: article.slug }))
}

export const dynamicParams = true
export const revalidate = 1200

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const article = await getArticle(slug)

  if (!article || !article.seo) return null

  const { seo } = article

  return {
    title: seo?.title_tag,
    description: seo?.meta_description,
    keywords: seo?.meta_keywords?.split(',').map((k: string) => k.trim()),

    openGraph: {
      title: seo?.og_title,
      type: seo?.og_type,
      url: seo?.og_url,
      description: seo?.og_description,
      images: seo?.og_image ? [
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

export default async function ArticleWrapper({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!slug) return null

  const article = await getArticle(slug)
  console.log(article )
  if (!article) return null
  const reactions = await getReactions(article.documentId)
  const views = await getArticleViews(article.documentId)
  const relatedArticles = await getRelatedArticles(article.tags, article.id)

  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <ArticleContentLoader
        article={article}
        reactions={reactions}
        views={views}
        relatedArticles={relatedArticles}
        slug={slug}
      />
    </Suspense>
  )
}

async function _ArticleContent({ slug }: { slug: string }) {
  const article = await getArticle(slug)
  if (!article) return notFound()
  const reactions = await getReactions(article.documentId)
  const views = await getArticleViews(article.documentId)
  const relatedArticles = await getRelatedArticles(article.tags, article.id)

  if (!article) return null

  const headersList = await headers()
  const referer = headersList.get('referer') ?? null

  return (
    <div className="relative flex flex-col gap-5">
      <LinkPath
        views={views}
        reactions={reactions}
        referer={referer}
        article={article}
        slug={slug}
      />

      {relatedArticles.length > 0 && (
        <div className={'tablet-small:mb-32 my-6 mb-14 flex flex-col gap-4'}>
          <h3 className={'text-lg font-medium'}>Читайте также</h3>
          <RelatedArticlesList articles={relatedArticles} />
        </div>
      )}
    </div>
  )
}

function RelatedArticlesList({ articles }: { articles: any[] }) {
  const [first, second, ...rest] = articles
  const largeCount = 2
  const smallCount = 8
  const loadedLarge = [first, second].filter(Boolean).length
  const loadedSmall = rest.length

  return (
    <div className="tablet-small:gap-5 flex w-full flex-col gap-3">
      <div className="tablet-small:grid-cols-2 tablet-small:gap-5 grid w-full grid-cols-1 gap-3">
        {[first, second].map(
          (article) =>
            article && (
              <ArticleCard key={article.id} article={article} isLarge />
            ),
        )}
      </div>
      {rest.length > 0 && (
        <div className="tablet-small:grid-cols-3 tablet-small:gap-5 grid grid-cols-2 gap-3">
          {rest.map((article) => (
            <ArticleCard key={article.id} article={article} isLarge={false} />
          ))}
        </div>
      )}
    </div>
  )
}
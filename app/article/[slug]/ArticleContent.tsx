import { notFound } from 'next/navigation'
import { LinkPath } from '@/app/features/link-path'
import { ArticleCard } from '@/app/widgets/articles/card'

function RelatedArticlesList({ articles }: { articles: any[] }) {
  const [first, second, ...rest] = articles
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

export default function ArticleContent({
  article,
  reactions,
  views,
  relatedArticles,
  slug,
}: {
  article: any,
  reactions: any,
  views: any,
  relatedArticles: any[],
  slug: string
}) {
  if (!article) return notFound()

  let referer: string | null = null
  if (typeof window !== 'undefined') {
    referer = document.referrer || null
  }

  return (
    <div className="relative flex flex-col gap-2 mt-0">
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
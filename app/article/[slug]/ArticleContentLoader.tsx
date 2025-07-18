'use client'

import { PageLoadingSpinner } from '@/app/shared/ui/loading-indicator'
import ArticleContent from './ArticleContent'

export default function ArticleContentLoader({ article, reactions, views, relatedArticles, slug }: {
  article: any,
  reactions: any,
  views: any,
  relatedArticles: any,
  slug: string
}) {
  if (!article) return <PageLoadingSpinner />
  return (
    <ArticleContent
      article={article}
      reactions={reactions}
      views={views}
      relatedArticles={relatedArticles}
      slug={slug}
    />
  )
} 
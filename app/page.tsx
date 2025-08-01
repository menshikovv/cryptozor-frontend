import ArticlesList from '@/app/widgets/articles/list'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'CryptoZor.Ru',
  description: 'Новости и статьи о технологиях, бизнесе и инновациях',
  openGraph: {
    title: 'CryptoZor.Ru',
    description: 'Новости и статьи о технологиях, бизнесе и инновациях',
    type: 'website',
  },
}

export default function Home() {
  return (
    <div className={'flex flex-row pb-6'}>
      <ArticlesList />
    </div>
  )
}

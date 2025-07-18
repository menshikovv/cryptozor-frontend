import ArticlesList from '@/app/widgets/articles/list'

export const dynamic = 'force-static'
export const revalidate = 1200

export default function Home() {
  return (
    <div className={'flex flex-row pb-6'}>
      <ArticlesList />
    </div>
  )
}

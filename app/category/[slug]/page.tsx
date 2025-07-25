import Image from 'next/image'
import { API_URL, BASE_URL } from '@/app/shared/config'
import { ArticleCard } from '@/app/widgets/articles/card'
import { Article } from '@/app/shared/types'
// @ts-ignore
import { parseBlocks } from 'strapi-blocks-parser'
import Head from 'next/head'
import ArticlesList from '@/app/widgets/articles/list'
import { notFound } from 'next/navigation'

async function getCategory(slug: string) {
  const res = await fetch(
    `${API_URL}/categories?filters[slug][$eq]=${slug}&populate[icon][populate]&populate[wallpaper][populate]&populate[seo][populate]=og_image`,
    { next: { revalidate: 100 } },
  )

  if (!res.ok) throw new Error('Failed to fetch category')
  const json = await res.json()
  return json.data[0]
}

async function getCategories() {
  const res = await fetch(
    `${API_URL}/categories?populate[icon][populate]&populate[wallpaper][populate]`,
    { next: { revalidate: 100 } },
  )
  if (!res.ok) throw new Error('Failed to fetch categories')
  const json = await res.json()
  return json.data
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category: any) => ({ slug: category.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const tag = await getCategory(slug)

  if (!tag?.seo) return null

  const { seo } = tag

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

export const dynamicParams = true
export const revalidate = 1200

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (!slug) return notFound()

  const category = await getCategory(slug)

  if (!category) return notFound()

  const html_seo_description = parseBlocks(
    category?.seo?.['html_seo_description'],
  )

  return (
    <>
      <Head>
        <meta
          name="html-seo-description"
          content={html_seo_description.toString()}
        />
      </Head>
      <div className="relative flex flex-col gap-5 pb-6">
        <div className={`flex flex-col overflow-hidden rounded-2xl bg-white/5`}>
          <div
            className={
              'tablet-small:min-h-[221px] relative flex min-h-[107px] items-center justify-center'
            }
          >
            {category?.wallpaper && (
              <Image
                src={BASE_URL + category?.wallpaper?.url}
                alt={'preview'}
                className="object-cover rounded-b-2xl"
                fill
                sizes={'(min-width: 768px) 50vw, 100vw'}
              />
            )}
          </div>
          <div className={'tablet-small:p-6 flex h-full flex-col gap-3 p-4'}>
            <div
              className={
                'tablet-small:top-38 tablet-small:gap-6 absolute top-17 flex flex-row items-end gap-4'
              }
            >
              {category.icon && (
                <div
                  className={
                    'tablet-small:max-h-[128px] tablet-small:min-h-[128px] tablet-small:max-w-[128px] tablet-small:min-w-[128px] max-h-20 min-h-20 max-w-20 min-w-20 overflow-hidden rounded-full'
                  }
                >
                  <Image
                    height={128}
                    width={128}
                    alt={'Icon'}
                    src={BASE_URL + category.icon?.url}
                  />
                </div>
              )}
              <h3
                className={`tablet-small:text-2xl tablet-small:mb-1.5 tablet-small:line-clamp-3 mb-1 line-clamp-1 text-xl leading-tight font-semibold text-white`}
              >
                {category.title}
              </h3>
            </div>
            <span
              className={`tablet-small:text-sm tablet-small:mt-14 mt-8 text-xs leading-tight font-medium text-white/60`}
            >
              {category.description}
            </span>
          </div>
        </div>

        <ArticlesList isCategoryPage={{ category_id: category.id }} />
      </div>
    </>
  )
}

import { API_URL, BASE_URL } from '@/app/shared/config'
import { ArticleCard } from '@/app/widgets/articles/card'
import { Article } from '@/app/shared/types'
import Image from 'next/image'
import Head from 'next/head'
// @ts-ignore
import { parseBlocks } from 'strapi-blocks-parser'
import ArticlesList from '@/app/widgets/articles/list'
import { notFound } from 'next/navigation'

async function getTag(slug: string) {
  try {
    const res = await fetch(
      `${API_URL}/tags?filters[slug][$eq]=${slug}&populate[icon][populate]&populate[wallpaper][populate]&populate[seo][populate]=og_image`,
      { next: { revalidate: 100 } },
    )
    if (!res.ok) {
      console.error(`Failed to fetch tag with slug: ${slug}, status: ${res.status}`)
      return null
    }
    const json = await res.json()
    return json.data[0]
  } catch (error) {
    console.error(`Error fetching tag with slug: ${slug}`, error)
    return null
  }
}

async function getTags() {
  const res = await fetch(`${API_URL}/tags?populate=icon`, {
    next: { revalidate: 100 },
  })
  if (!res.ok) throw new Error('Failed to fetch tags')
  const json = await res.json()
  return json.data
}

export async function generateStaticParams() {
  const tags = await getTags()
  return tags.map((tag: any) => ({ slug: tag.slug }))
}

export const dynamicParams = true
export const revalidate = 1200

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const tag = await getTag(slug)

  if (!tag?.seo) {
    return {
      title: 'Страница не найдена',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const { seo } = tag

  // Список поддерживаемых OpenGraph типов
  const allowedOgTypes = [
    'website',
    'article',
    'profile',
    'book',
    'music.song',
    'music.album',
    'music.playlist',
    'music.radio_station',
    'video.movie',
    'video.episode',
    'video.tv_show',
    'video.other',
  ]
  const ogType = allowedOgTypes.includes(seo?.og_type) ? seo.og_type : 'website'

  return {
    title: seo?.title_tag,
    description: seo?.meta_description,
    keywords: seo?.meta_keywords?.split(',').map((k: string) => k.trim()),

    openGraph: {
      title: seo?.og_title,
      type: ogType,
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

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (!slug) return notFound()

  const tag = await getTag(slug)

  if (!tag) return notFound()

  const html_seo_description = parseBlocks(tag?.seo?.['html_seo_description'])

  return (
    <>
      <Head>
        <meta
          name="html-seo-description"
          content={html_seo_description.toString()}
        />
      </Head>
      <div className="relative flex flex-col gap-5 pb-6">
        <div className={`flex flex-col overflow-hidden rounded-2xl bg-white/5`} style={{ borderRadius: '30px' }}>
          <div
            className={
              'tablet-small:min-h-[221px] relative flex min-h-[107px] items-center justify-center'
            }
          >
            {tag?.wallpaper && (
              <Image
                src={BASE_URL + tag?.wallpaper?.url}
                alt={'preview'}
                className="object-cover"
                fill
                sizes={'(min-width: 768px) 50vw, 100vw'}
                style={{ borderRadius: '30px' }}
              />
            )}
          </div>
          <div className={'tablet-small:p-6 flex h-full flex-col gap-3 p-4'}>
            <div
              className={
                'tablet-small:top-38 tablet-small:gap-6 absolute top-17 flex flex-row items-end gap-4'
              }
            >
              {tag.icon && (
                <div
                  className={
                    'tablet-small:max-h-[128px] tablet-small:min-h-[128px] tablet-small:max-w-[128px] tablet-small:min-w-[128px] max-h-20 min-h-20 max-w-20 min-w-20 overflow-hidden rounded-full'
                  }
                >
                  <Image
                    height={128}
                    width={128}
                    alt={'Icon'}
                    src={BASE_URL + tag.icon?.url}
                  />
                </div>
              )}
              <h3
                className={`tablet-small:text-2xl tablet-small:mb-1.5 tablet-small:line-clamp-3 mb-1 line-clamp-1 text-xl leading-tight font-semibold text-white`}
              >
                {tag.title}
              </h3>
            </div>
            <span
              className={`tablet-small:text-sm tablet-small:mt-14 mt-8 text-xs leading-tight font-medium text-white/60`}
            >
              {tag.description}
            </span>
          </div>
        </div>

        <ArticlesList isTagPage={{ tag_id: tag.id }} />
      </div>
    </>
  )
}

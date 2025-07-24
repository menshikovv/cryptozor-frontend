'use client'

import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import {
  FC,
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Icons } from '@/app/shared/ui/icons'
import { cn } from '@/app/shared/libs'
import { DialogTitle } from '@radix-ui/react-dialog'
import { ArticleCard } from '@/app/widgets/articles/card'
import { usePathname, useRouter } from 'next/navigation'
import { API_URL, BASE_URL } from '@/app/shared/config'
import { useHeader } from '@/app/shared/store/header-store'
import { useMediaQuery } from '@siberiacancode/reactuse'
import Link from 'next/link'
import { useDebounce } from '@/app/shared/hooks/useDebounce'

type SearchProps = HTMLAttributes<HTMLDivElement> & {
  tags: any[]
}

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Сначала новые', width: 110 },
  { value: 'createdAt:asc', label: 'Сначала старые', width: 116 },
  { value: 'popularity:desc', label: 'Сначала популярные', width: 150 },
  { value: 'popularity:asc', label: 'Сначала не популярные', width: 171 },
]

export const SearchModal: FC<SearchProps> = ({ className, tags, ...props }) => {
  const [tag, setTag] = useState<string | null>(null)
  const [sort, setSort] = useState<string>('createdAt:desc')
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()
  const { search_opened, setSearchOpened } = useHeader()
  const [value, setValue] = useState<string>('')
  const router = useRouter()
  const debouncedValue = useDebounce(value, 250)

  useEffect(() => {
    setSearchOpened(false)
  }, [pathname])

  const handleSelectTag = useCallback(
    (title: string) => {
      if (tag === title) {
        setTag(null)
      } else {
        setTag(title)
      }
    },
    [tag],
  )

  useEffect(() => {
    if (!search_opened) return
    const controller = new AbortController()

    const fetchArticles = async () => {
      if (loading) return

      setLoading(true)

      try {
        const params = new URLSearchParams()

        if (!sort.includes('popularity')) {
          params.append('sort', sort)
        }

        if (debouncedValue) {
          params.append('filters[$or][0][title][$containsi]', debouncedValue)
          params.append('filters[$or][1][tags][title][$containsi]', debouncedValue)
          params.append('filters[$or][2][content][$containsi]', debouncedValue)
        }

        if (tag) {
          params.append('filters[tags][title][$eq]', tag)
        }

        const res = await fetch(
          `${API_URL}/articles?populate[categories][populate]&populate[tags][populate]=icon&populate[wallpaper][populate]&${decodeURIComponent(params.toString())}`,
          {
            signal: controller.signal,
          },
        )

        const json = await res.json()

        const newArticles = json.data || []

        setArticles(newArticles)
      } catch (error) {
        console.error('Failed to fetch articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
    return () => controller.abort()
  }, [debouncedValue, sort, tag, search_opened])

  const handleClose = useCallback(() => {
    if (value !== '') {
      setValue('')
    } else {
      setSearchOpened(false)
    }
  }, [value, search_opened])

  const sortByPopularityDesc = (a: any, b: any) => {
    const aPopularity = Number(a.organic_views) + Number(a.boosted_views)
    const bPopularity = Number(b.organic_views) + Number(b.boosted_views)
    return Number(bPopularity - aPopularity)
  }

  const sortByPopularityAsc = (a: any, b: any) => {
    const aPopularity = Number(a.organic_views) + Number(a.boosted_views)
    const bPopularity = Number(b.organic_views) + Number(b.boosted_views)
    return Number(aPopularity - bPopularity)
  }

  const sortedArticles = useMemo(() => {
    if (sort === 'popularity:desc') {
      return [...articles].sort(sortByPopularityDesc)
    }
    if (sort === 'popularity:asc') {
      return [...articles].sort(sortByPopularityAsc)
    }
    return articles
  }, [articles, sort])

  const matchedTags = useMemo(() => {
    if (debouncedValue === '') return tags
    return tags.filter((tag: any) =>
      tag.title.toLowerCase().includes(debouncedValue.toLowerCase())
    )
  }, [tags, debouncedValue])

  const isMobile = useMediaQuery('(max-width: 768px)')

  const selectId = 'sort-select-modal'

  return (
    <>
      <Dialog.Root modal open={search_opened} onOpenChange={setSearchOpened}>
        <Dialog.Portal>
          <Dialog.Content
            onClick={() => setSearchOpened(false)}
            className={cn(
              'tablet-small:top-5 fixed top-0 z-[51] w-full focus:outline-none',
              'data-[state=open]:animate-in tablet-small:bg-transparent fade-in data-[state=closed]:animate-out fade-out tablet-small:min-h-auto min-h-dvh bg-[#1F1D22]',
              'max-h-[100dvh] overflow-y-auto'
            )}
          >
            <div
              onClick={() => setSearchOpened(false)}
              className="tablet-small:max-w-[1440px] tablet-small:px-5 tablet-small:pl-7 mx-auto w-full max-w-full z-[9999]"
            >
              <DialogTitle className="hidden">Поиск</DialogTitle>
              <div
                onClick={(e) => e.stopPropagation()}
                className={
                  'tablet:max-w-[calc(100%-300px-20px)] shadow-bg tablet-small:shadow-2xl tablet-small:rounded-2xl ml-auto flex w-full max-w-full flex-col gap-4 overflow-hidden'
                }
              >
                <div
                  className={cn(
                    'tablet-small:m-0 rainbow-box-3 tablet-small:border-0 relative mx-5 mt-6 flex h-11 items-center rounded-full border-1 border-white/20 bg-[#1B1B20]',
                  )}
                >
                  <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    type="text"
                    placeholder="Найдется всё..."
                    className="h-10 w-full bg-white/5 px-4 pb-0.5 pl-11 font-medium text-white/100"
                    style={{ fontSize: 16 }}
                  />
                  <Icons.Search className="absolute top-1/2 left-4 -translate-y-1/2 transform stroke-white/60" />
                  <Icons.X
                    onClick={handleClose}
                    className={cn(
                      'tablet-small:block absolute top-1/2 right-4 hidden -translate-y-1/2 transform cursor-pointer fill-white opacity-100 transition-all',
                    )}
                  />
                  <Icons.X
                    onClick={handleClose}
                    className={cn(
                      'tablet-small:hidden absolute top-1/2 right-4 block -translate-y-1/2 transform cursor-pointer fill-white transition-all',
                    )}
                  />
                </div>
                <div
                  className={cn(
                    'tablet-small:flex-row tablet-small:pt-5 tablet-small:pb-6 tablet-small:pl-5 flex flex-col gap-4 rounded-2xl p-0 transition-all',
                    isMobile ? '!bg-transparent' : 'search-gradient',
                  )}
                >
                  {isMobile && matchedTags.length > 0 && value !== '' && (
                    <div className="flex min-w-[250px] flex-col gap-2 px-5">
                      <h3 className="flex h-10 items-center text-sm font-medium text-white/60">
                        {value === '' ? 'Актуальные темы' : 'Темы по запросу'}
                      </h3>
                      <div
                        className={
                          'flex w-full flex-row flex-wrap gap-2 overflow-y-auto p-0'
                        }
                      >
                        {matchedTags?.map((item: any, key: any) => (
                          <Link
                            href={`/tag/${item.slug}`}
                            key={item.documentId + key}
                            className={
                              'rainbow-box h-full min-h-10 w-fit p-[1px]'
                            }
                          >
                            <div
                              className={cn(
                                'gradient flex h-full min-h-10 cursor-pointer items-center gap-2 rounded-lg border-transparent px-3 text-sm font-medium text-white',
                              )}
                            >
                              <Image
                                alt={'Icon'}
                                src={BASE_URL + (item?.icon?.url || '')}
                                height={25}
                                width={25}
                                className={'rounded'}
                              />
                              <span className="max-w-[110px] truncate whitespace-nowrap overflow-hidden text-ellipsis block">
                                {item.title}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {!isMobile && (
                    <div className="flex min-w-[250px] flex-col gap-2">
                      <h3 className="tablet-small:px-3 flex h-10 items-center px-5 text-sm font-medium text-white/60">
                        {value === '' ? 'Актуальные темы' : 'Темы по запросу'}
                      </h3>
                      <div
                        className={
                          'tablet-small:pr-4 flex max-h-[calc(100dvh-20px-180px)] w-full flex-col gap-2 overflow-y-auto p-0'
                        }
                      >
                        {matchedTags?.map((item: any, key: any) => (
                          <button
                            onClick={() => handleSelectTag(item.title)}
                            key={item.documentId + key}
                            className={cn(
                              tag === item.title
                                ? 'rainbow-box !bg-white/5'
                                : 'bg-transparent',
                              'tablet-small:bg-transparent bg-gradient flex min-h-10 cursor-pointer items-center gap-3 rounded-xl border-1 border-transparent px-4 text-sm font-medium text-white transition-colors hover:bg-white/5',
                            )}
                          >
                            <Image
                              alt={'Icon'}
                              src={BASE_URL + (item?.icon?.url || '')}
                              height={25}
                              width={25}
                              className={'rounded'}
                            />
                            <span className="max-w-[230px] truncate whitespace-nowrap overflow-hidden text-ellipsis block">
                              {item.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className={'flex w-full flex-col gap-3'}>
                    <div
                      className={
                        'tablet-small:pr-5 tablet-small:px-0 flex w-full flex-row items-center justify-between px-5'
                      }
                    >
                      <h3 className="tablet-small:flex hidden h-10 items-center text-sm font-medium text-white/60">
                        {tag
                          ? `Новости по теме ${tag}`
                          : value === ''
                            ? 'Актуальные новости'
                            : 'Новости по запросу'}
                      </h3>

                      <div className="tablet-small:w-fit tablet-small:justify-start flex w-full items-center justify-between gap-2">
                        <h3 className="tablet-small:hidden flex h-10 items-center text-sm font-medium text-white/60">
                          Свежие новости
                        </h3>

                        <div className="tablet-small:flex mr-[26px] hidden flex-row items-center gap-1 text-sm font-medium text-white/60">
                          <Icons.List className="fill-white/60" />
                          Сортировка:
                        </div>
                        <div
                          className={cn(
                            isMobile ? 'select-gradient' : 'bg-transparent',
                            'tablet-small:p-0 tablet-small:rounded-none flex !cursor-pointer flex-row items-center gap-1 rounded-full px-2 py-1',
                          )}
                        >
                          <label htmlFor={selectId} className="sr-only">
                            Сортировка по
                          </label>
                          <select
                            id={selectId}
                            value={sort}
                            style={{
                              width: SORT_OPTIONS.find((s) => s.value === sort)
                                ?.width,
                            }}
                            onChange={(e) => setSort(e.target.value)}
                            className="cursor-pointer appearance-none border-none pr-1 text-sm font-medium text-white outline-none"
                          >
                            {SORT_OPTIONS.map(({ value, label }) => (
                              <option
                                key={value}
                                value={value}
                                className="text-black"
                              >
                                {label}
                              </option>
                            ))}
                          </select>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7 10l5 5 5-5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {sortedArticles.length === 0 ? (
                      <div className="tablet-small:pr-5 flex h-full items-center justify-center p-0 flex-col gap-2">
                        {value !== '' && (
                          <span className="text-sm font-medium text-white/80">
                            Поиск по запросу: <span className="font-bold">{value}</span>
                          </span>
                        )}
                        <span className="text-sm font-medium text-white/60">
                          Ничего не найдено
                        </span>
                      </div>
                    ) : (
                      <div
                        className={
                          'tablet-small:grid-cols-3 tablet-small:pr-5 tablet-small:pb-0 tablet-small:pl-0 grid grid-cols-2 gap-5 pr-4 pb-5 pl-5'
                        }
                      >
                        {sortedArticles.slice(0, 6).map((article: any) => (
                          <Link href={`/article/${article.slug}`} key={article.documentId}>
                            <ArticleCard
                              isSearch
                              article={article}
                              isLarge={false}
                            />
                          </Link>
                        ))}
                      </div>
                    )}
                    {sortedArticles.length > 6 && (
                      <div className="mt-3 flex justify-center">
                        <button
                          onClick={() => {
                            const path = tag
                              ? `/tag/${tags.find((item) => item.title === tag).slug}`
                              : '/'
                            router.push(path)
                            setSearchOpened(false)
                          }}
                          className="cursor-pointer text-sm font-medium text-white/60"
                        >
                          Посмотреть все
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

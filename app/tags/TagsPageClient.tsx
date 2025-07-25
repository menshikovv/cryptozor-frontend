'use client'

import { BASE_URL, API_URL } from '../shared/config'
import Link from 'next/link'
import Image from 'next/image'
import { TagSearchInput } from './TagSearchInput'
import { useEffect, useState } from 'react'

const getArticleWord = (count: number): string => {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) return 'статья'
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100))
    return 'статьи'
  return 'статей'
}

export default function TagsPageClient() {
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch(`${API_URL}/tags?populate=icon&populate=articles&pagination[pageSize]=100`)
        if (!res.ok) return setTags([])
        const json = await res.json()
        setTags(json.data || [])
      } catch {
        setTags([])
      } finally {
        setLoading(false)
      }
    }
    fetchTags()
  }, [])

  const sortedTags = tags?.sort((a: any, b: any) => {
    return b.articles.length - a.articles.length
  }) || []

  const filteredTags = search.trim()
    ? sortedTags.filter((tag: any) => tag.title.toLowerCase().includes(search.trim().toLowerCase()))
    : sortedTags

  return (
    <div className="flex flex-col min-h-full pb-8">
      <div className="max-[960px]:block hidden">
        <TagSearchInput value={search} onChange={setSearch} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-5">
        {loading ? (
          <div className="text-white/60 px-4 py-2 text-center w-full col-span-full">Загрузка...</div>
        ) : filteredTags.length === 0 ? (
          search.trim() ? (
            <div className="text-white/60 px-4 py-2 text-center w-full col-span-full">По запросу "{search}" ничего не найдено</div>
          ) : (
            <div className="text-white/60 px-4 py-2 text-center w-full col-span-full">Здесь ничего нет</div>
          )
        ) : (
          filteredTags.map((tag: any) => {
            const articleCount = tag.articles.length
            const articleWord = getArticleWord(articleCount)
            return (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="tag-glow-card flex flex-col items-center gap-3 rounded-2xl p-4"
              >
                <Image
                  src={BASE_URL + tag.icon?.url}
                  alt={tag.title}
                  width={115}
                  height={115}
                  className="tablet-small:size-[105px] size-[78px] rounded-2xl object-cover"
                />
                <div className="flex flex-col items-center gap-2">
                  <span className="tablet-small:text-sm text-center text-xs font-medium text-white-shadow">
                    {tag.title}
                  </span>
                  <span className="text-xs font-medium text-white text-white-shadow">
                    {articleCount} {articleWord}
                  </span>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
} 
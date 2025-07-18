'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BASE_URL } from '@/app/shared/config'

function getArticleWord(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return 'статья'
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'статьи'
  return 'статей'
}

export default function TagSearch({ tags }: { tags: any[] }) {
  const [search, setSearch] = useState('')
  const filteredTags = useMemo(() => {
    if (!search.trim()) return tags
    return tags.filter((tag: any) =>
      tag.title.toLowerCase().includes(search.trim().toLowerCase())
    )
  }, [tags, search])

  return (
    <>
      <div className="mb-6 flex items-center relative">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          type="text"
          placeholder="Поиск по тегам..."
          className="h-10 w-full rounded-full px-4 pb-0.5 pl-11 text-sm font-medium text-white/100 placeholder-white border border-white/40"
          style={{ background: 'linear-gradient(90deg, #000000 0%, #75BE40 100%)' }}
        />
        <svg className="absolute top-1/2 left-4 -translate-y-1/2 transform stroke-white/60" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.6 10.6z"/></svg>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredTags.length === 0 ? (
          <div className="text-white/60 px-4 py-2">Здесь ничего нет</div>
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
    </>
  )
} 
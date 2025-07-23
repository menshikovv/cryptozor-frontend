'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Category } from '@/app/shared/ui/category'
import { CornerDownRight } from 'lucide-react'

type SidebarProps = {
  tags: any[]
  categories: any[]
}

export function Sidebar({ tags, categories }: SidebarProps) {
  return (
    <aside className="tablet-small:flex sticky top-0 col-span-1 hidden flex-col justify-between py-2 max-h-screen overflow-y-auto z-20">
      <Link
        href="/"  
        className="flex h-[84px] flex-row items-center pl-0 pr-4"
      >
        <Image
          loading={'eager'}
          width={96}
          height={84}
          className={'max-h-[84px] min-h-[84px] max-w-[144px]'}
          src="/logo.svg"
          alt="Logo"
        />
        <div className="text-xl font-bold text-white flex items-center h-full">CryptoZor.Ru</div>
      </Link>

      <nav className="mb-auto flex flex-col gap-2 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {categories.length === 0 ? (
            <div className="text-white/60 px-4 py-2">Здесь ничего нет</div>
          ) : (
            categories.map((category: any) => (
              <Category key={category.id} href={'/category/' + category.slug}>
                <div className="flex items-center gap-2">
                  {category.icon?.url && (
                    <Image
                      src={process.env.NEXT_PUBLIC_BASE_URL + category.icon.url}
                      alt={category.title}
                      width={20}
                      height={20}
                      className="mr-2 rounded-sm"
                    />
                  )}
                  {category.title}
                </div>
              </Category>
            ))
          )}
        </div>

        <div className={'h-px w-full bg-white/5'} />

        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          <h3 className="flex h-10 items-center px-4 text-sm font-medium text-white/60 text-[17px]">
            Актуальные темы
          </h3>
          <div className="flex-1 overflow-y-auto">
            {tags.length === 0 ? (
              <div className="text-white/60 px-4 py-2">Здесь ничего нет</div>
            ) : (
              tags.slice(0, 20).map((tag: any) => (
                <Category key={tag.id} href={`/tag/${tag.slug}`}>
                  <div className="flex items-center gap-2 transition-all duration-150 rounded-lg px-2 py-1">
                    {tag.icon?.url && (
                      <Image
                        src={process.env.NEXT_PUBLIC_BASE_URL + tag.icon.url}
                        alt={tag.title}
                        width={20}
                        height={20}
                        className="mr-2 rounded-sm"
                      />
                    )}
                    {tag.title}
                  </div>
                </Category>
              ))
            )}
          </div>

          <Link
            href="/tags"
            className="flex h-10 cursor-pointer flex-row items-center gap-2 px-4 text-sm font-medium text-white/60 text-[17px]"
          >
            <CornerDownRight className={'size-5.7'} /> Посмотреть все темы
          </Link>
        </div>
      </nav>
        <div className={'flex flex-col gap-1'}>
          <div className={'h-px w-full bg-white/5'} />
          <Link
            href={'/about'}
            className={
              'flex h-10 flex-row items-center text-sm font-medium justify-start'
            }
          >
            <Image
              loading={'eager'}
              className={'max-h-[32px] min-h-[32px] max-w-[32px] min-w-[32px]'}
              width={32}
              height={32}
              src="/logo.svg"
              alt="Logo"
            />
            <span className="ml-2">О проекте CryptoZor LTD</span>
          </Link>
        </div>
    </aside>
  )
}

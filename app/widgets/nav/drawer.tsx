'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { useHeader } from '@/app/shared/store/header-store'
import { cn } from '@/app/shared/libs'
import { CornerDownRight, X } from 'lucide-react'
import { useEffect } from 'react'
import { SearchInput } from '@/app/features/search/input'
import { Category } from '@/app/shared/ui/category'
import Link from 'next/link'
import { Icons } from '@/app/shared/ui/icons'
import { usePathname } from 'next/navigation'

type DrawerProps = {
  tags: any[]
  categories: any[]
  socials: any
}

export function Drawer({ tags, categories, socials }: DrawerProps) {
  const { drawer_opened, setDrawerOpened, search_opened } = useHeader()
  const pathname = usePathname()
  useEffect(() => {
    if (search_opened) {
      setDrawerOpened(false)
    }
  }, [search_opened, setDrawerOpened])

  useEffect(() => {
    setDrawerOpened(false)
  }, [pathname])

  return (
    <AnimatePresence>
      {drawer_opened && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99] bg-black/50"
            onClick={() => setDrawerOpened(false)}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.2 }}
            className={cn(
              'shadow-bg fixed top-0 right-0 z-[100] flex flex-col h-full w-72 bg-[linear-gradient(180deg,_#000000_0%,_#0D1D01_50%,_#0C1C00_100%)] p-4 px-[21px] shadow-2xl z-[10000000000000000]',
            )}
          >
            <div className="flex flex-col flex-grow min-h-0 overflow-y-auto gap-4">
              <div className={'flex w-full flex-row items-center justify-between'}>
                <Link href="/" className="flex flex-col px-3 cursor-pointer select-none">
                  <span className="text-2xl font-bold leading-6">Cryptozor</span>
                  <span className="text-xs font-medium text-white/60 tracking-widest">КРИПТОНОВОСТИ</span>
                </Link>
                <div
                  onClick={() => setDrawerOpened(!drawer_opened)}
                  className={
                    'flex size-[52px] items-center justify-center rounded-full transition-colors duration-150 hover:bg-white/10 cursor-pointer'
                  }
                >
                  <X />
                </div>
              </div>
              <div className={'relative'}>
                <SearchInput value={''} />
              </div>
              <nav className="mb-auto flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  {categories.length === 0 ? (
                    <div className="text-white/60 px-3 py-2">Здесь ничего нет</div>
                  ) : (
                    categories.map((category: any) => (
                      <Category
                        isDrawer
                        key={category.id}
                        className={'gap-2 !px-3'}
                        href={'/category/' + category.slug}
                      >
                        {category.icon?.url ? (
                          <Image
                            src={process.env.NEXT_PUBLIC_BASE_URL + category.icon.url}
                            alt={category.title}
                            width={25}
                            height={25}
                            className="mr-2 rounded-sm"
                          />
                        ) : (
                          <Icons.Widget className={'fill-lemon size-4'} />
                        )}
                        {category.title}
                      </Category>
                    ))
                  )}
                </div>
                <div className={'h-px w-full bg-white/5'} />
                <div className="flex flex-col gap-1">
                  <h3 className="flex h-10 items-center gap-2 px-3 text-sm font-medium text-white/60">
                    <Icons.Note className={'size-4 fill-white/60'} /> Актуальные
                    темы
                  </h3>
                  <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                    {tags.length === 0 ? (
                      <div className="text-white/60 px-3 py-2">Здесь ничего нет</div>
                    ) : (
                      tags.slice(0, 30).map((tag: any) => (
                        <Category
                          className={'gap-1 !px-2 !py-1 text-[15px]'}
                          isDrawer
                          key={tag.id}
                          href={`/tag/${tag.slug}`}
                        >
                          {tag.icon?.url ? (
                            <Image
                              src={process.env.NEXT_PUBLIC_BASE_URL + tag.icon.url}
                              alt={tag.title}
                              width={22}
                              height={22}
                              className="mr-1 rounded-sm"
                            />
                          ) : (
                            <Icons.Widget className={'fill-lemon size-4'} />
                          )}
                          {tag.title}
                        </Category>
                      ))
                    )}
                  </div>
                  <div className="sticky bottom-0 bg-[linear-gradient(rgb(0, 0, 0) 0%, rgb(13, 29, 1) 50%, rgb(12, 28, 0) 100%)] z-[10000000000000000]">
                    <Link
                      href="/tags"
                      className="flex w-full h-10 cursor-pointer flex-row items-center gap-2 text-sm font-medium text-white/60 relative"
                      style={{ minHeight: 40, backdropFilter: 'blur(15px)' }}
                    >
                      <span className="pl-3 flex items-center gap-2">
                        <CornerDownRight className={'size-3.5'} /> Посмотреть всё
                      </span>
                      <span
                        style={{
                          position: 'absolute',
                          left: '40px', // отступ слева для линии
                          top: 0,
                          right: 0,
                          height: '1px',
                          background: 'rgba(255,255,255,0.05)',
                        }}
                      />
                    </Link>
                  </div>
                </div>
              </nav>
            </div>
            <div className={'mt-auto flex flex-col'}>
              <div className={'h-px w-full bg-white/5'} />
              <div
                className={
                  'flex flex-row items-center justify-center min-h-[60px]  w-full px-2'
                }
              >
                <Link href="/about">
                  <Image
                    className={'w-[65px] h-[65px]'}
                    width={65}
                    height={65}
                    src="/logo.svg"
                    alt="Logo"
                  />
                </Link>
                <Link
                  href="/about"
                  className="ml-3 text-[13px] font-bold hover:text-white/80 transition-colors whitespace-nowrap"
                >
                  О проекте CryptoZor LTD
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

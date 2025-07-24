'use client'

import { usePathname } from 'next/navigation'
import { useMemo, useEffect, useState, useRef } from 'react'

export default function CurrentPageLabel({ tags = [], categories = [], articleTitle }: { tags?: any[], categories?: any[], articleTitle?: string }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 960)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const pageName = useMemo(() => {
    if (pathname === '/') return 'Все новости';
    if (pathname === '/about') return 'О проекте CryptoZor LTD';
    if (pathname === '/school') return 'Обучение P2P-арбитражу'
    if (pathname === '/tags') return 'Все новостные темы';
    if (pathname === '/article') return 'новость';
    if (pathname.startsWith('/article')) return 'Текущая новость'
    if (pathname.startsWith('/category/')) {
      const match = pathname.match(/^\/category\/([^\/]+)/)
      if (match && categories && categories.length > 0) {
        const category = categories.find((c: any) => c.slug === match[1])
        if (category) return `Выбранная категория: ${category.title}`
      }
      return 'Категория';
    }
    if (pathname.startsWith('/tag/')) {
      const match = pathname.match(/^\/tag\/([^\/]+)/)
      if (match && tags && tags.length > 0) {
        const tag = tags.find((t: any) => t.slug === match[1])
        if (tag) return `Выбранная тема: ${tag.title}`
      }
      return 'Тег';
    }
  }, [pathname, tags, categories, articleTitle])

  const textRef = useRef<HTMLSpanElement>(null)

  return (
    <div
      className="flex flex-col items-center tablet-small:items-start"
      style={isMobile ? { marginLeft: '2px' } : undefined}
    >
      {pageName && (pageName.startsWith('Выбранная категория') || pageName.startsWith('Выбранная тема')) ? (
        <span className="font-medium text-sm text-center tablet-small:text-left relative">
          {!isMobile && (
            <span className="text-gray-400">
              {pageName.startsWith('Выбранная категория')
                ? 'Выбранная категория: '
                : pageName.startsWith('Выбранная тема')
                ? 'Выбранная тема: '
                : ''}
            </span>
          )}
          <span className={`text-white relative inline-block after:content-[''] after:block after:mt-2 after:h-0.5 after:rounded after:bg-gradient-to-r after:from-[#D9D9D9] after:to-[#75BE40] after:w-full${isMobile ? ' ml-[-35px]' : ''}`}>
            {pageName.replace(/^Выбранная категория: |^Выбранная тема: /, '')}
          </span>
        </span>
      ) : (
        pageName && (
          <span
            ref={textRef}
            className={`font-medium text-sm text-center tablet-small:text-left relative after:content-[''] after:block after:mt-2 after:h-0.5 after:rounded after:bg-gradient-to-r after:from-[#D9D9D9] after:to-[#75BE40] after:w-full${isMobile ? ' ml-[-35px]' : ''}`}
          >
            <span className="text-gray-400">
              {pageName.startsWith('Выбранная категория')
                ? 'Выбранная категория: '
                : ''}
            </span>
            <span className="text-white">
              {pageName.replace(/^Выбранная категория: |^ Выбранная тема: /, '')}
            </span>
          </span>
        )
      )}
    </div>
  )
}
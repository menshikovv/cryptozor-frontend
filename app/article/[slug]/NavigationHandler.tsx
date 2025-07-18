'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface NavigationHandlerProps {
  slug: string
}

export function NavigationHandler({ slug }: NavigationHandlerProps) {
  const router = useRouter()

  useEffect(() => {
    const isPageRefresh =
      (performance.navigation && performance.navigation.type === 1) ||
      (window.performance &&
        window.performance.getEntriesByType('navigation').length > 0 &&
        (window.performance.getEntriesByType('navigation')[0] as any).type ===
          'reload')

    if (isPageRefresh) {
      const previousPath = localStorage.getItem('previousPath')

      const currentPath = `/article/${slug}`
      if (previousPath && previousPath !== currentPath) {
      }
    }
  }, [slug, router])

  return null
}

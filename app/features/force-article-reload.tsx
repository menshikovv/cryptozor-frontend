"use client"
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function ForceArticleReload() {
  const pathname = usePathname()
  const prevPath = useRef<string | null>(null)

  useEffect(() => {
    if (
      prevPath.current &&
      pathname.startsWith('/article/') &&
      prevPath.current !== pathname
    ) {
      window.location.reload()
    }
    prevPath.current = pathname
  }, [pathname])

  return null
} 
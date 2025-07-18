'use client'

import { useEffect } from 'react'

interface PreviousPathHandlerProps {
  currentPath: string
  referer: string | null
}

export function PreviousPathHandler({
  currentPath,
  referer,
}: PreviousPathHandlerProps) {
  useEffect(() => {
    if (currentPath) {
      localStorage.setItem('previousPath', currentPath)
    }

    if (referer) {
      localStorage.setItem('refererPath', referer)
    }
  }, [currentPath, referer])

  return null
}

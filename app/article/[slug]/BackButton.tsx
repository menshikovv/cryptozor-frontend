'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()
  const [previousPath, setPreviousPath] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPath = localStorage.getItem('previousPath')
      const refererPath = localStorage.getItem('refererPath')

      setPreviousPath(refererPath || savedPath || '/')
    }
  }, [])

  const handleBack = () => {
    if (previousPath) {
      router.push(previousPath)
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleBack}
      className="flex min-h-[36px] w-fit min-w-[36px] cursor-pointer items-center justify-center rounded-full bg-white/10 p-1 text-white"
    >
      <ArrowLeft className={'size-5'} />
    </button>
  )
}

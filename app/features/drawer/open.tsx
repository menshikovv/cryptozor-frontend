'use client'

import { Menu } from 'lucide-react'
import { useHeader } from '@/app/shared/store/header-store'

export const OpenDrawer = () => {
  const { setDrawerOpened, drawer_opened } = useHeader()

  return (
    <div
      onClick={() => setDrawerOpened(!drawer_opened)}
      className="flex size-[52px] items-center justify-center rounded-full"
      style={{
        background: 'linear-gradient(135deg,rgb(142, 140, 140) 0%, #75BE40 50%)'
      }}
    >
      <Menu className="text-white" />
    </div>
  )
}

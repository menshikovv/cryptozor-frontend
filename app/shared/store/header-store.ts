'use client'

import { create } from 'zustand'

interface HeaderState {
  sort: string
  drawer_opened: boolean
  search_opened: boolean
  setSort: (sort: string) => void
  setDrawerOpened: (drawer_opened: boolean) => void
  setSearchOpened: (search_opened: boolean) => void
}

export const useHeader = create<HeaderState>((set, get) => ({
  sort: 'createdAt:desc',
  drawer_opened: false,
  search_opened: false,

  setSort: (sort) => set({ sort }),
  setDrawerOpened: (drawer_opened) => set({ drawer_opened }),
  setSearchOpened: (search_opened) => set({ search_opened }),
}))

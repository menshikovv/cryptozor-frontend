'use client'

import { createContext, useContext } from 'react'

const LayoutDataContext = createContext(null)

export function LayoutDataProvider({ children, value }: any) {
  return (
    <LayoutDataContext.Provider value={value}>
      {children}
    </LayoutDataContext.Provider>
  )
}

export function useLayoutData() {
  const context = useContext(LayoutDataContext)
  if (!context) throw new Error('Use layout data is outside context')
  return context
}

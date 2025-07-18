'use client'

import { useEffect, useState } from 'react'

export function useUserId(): string {
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let storedUserId = localStorage.getItem('mentup_user_id')

      if (!storedUserId) {
        storedUserId = generateUserId()
        localStorage.setItem('mentup_user_id', storedUserId)
      }

      setUserId(storedUserId)
    }
  }, [])

  return userId
}

function generateUserId(): string {
  return (
    'user_' +
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 9)
  )
}

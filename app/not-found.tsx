import { Metadata } from 'next'
import NotFoundClient from './not-found-client'

export const metadata: Metadata = {
  title: 'Страница не найдена',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return <NotFoundClient />
} 
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // Отключаем статическую генерацию для страниц с API
  serverExternalPackages: ['strapi-blocks-parser'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'strapi.mentup.ru',
        pathname: '/uploads/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'strapi.cryptozor.ru',
        pathname: '/uploads/**',
        search: '',
      },
    ],
  },
}

export default nextConfig

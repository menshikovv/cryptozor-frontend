// @ts-ignore
import { parseBlocks } from 'strapi-blocks-parser'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { Sidebar } from '@/app/widgets/nav/sidebar'
import { Socials } from '@/app/widgets/nav/socials'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import Header from '@/app/widgets/nav/header'
import { API_URL, BASE_URL } from '@/app/shared/config'
import MobileHeader from '@/app/widgets/nav/mobile-header'
import { Drawer } from '@/app/widgets/nav/drawer'
import { SearchModal } from '@/app/features/search/modal'
import { LayoutDataProvider } from '@/app/shared/hooks/useLayoutData'
import Script from 'next/script'
import { Suspense } from 'react'
import { LoadingIndicator } from '@/app/shared/ui/loading-indicator'

dayjs.locale('ru')

const inter = Inter({ subsets: ['latin'] })

async function getGlobal() {
  // Всегда возвращаем статические данные во время сборки
  if (process.env.NODE_ENV === 'production') {
    return {
      seo: {
        title_tag: 'CryptoZor.Ru',
        meta_description: 'Новости и статьи о технологиях, бизнесе и инновациях',
        og_title: 'CryptoZor.Ru',
        og_description: 'Новости и статьи о технологиях, бизнесе и инновациях',
        og_type: 'website'
      }
    }
  }

  try {
    if (!API_URL) {
      console.warn('API_URL is not defined')
      return {
        seo: {
          title_tag: 'CryptoZor.Ru',
          meta_description: 'Новости и статьи о технологиях, бизнесе и инновациях',
          og_title: 'CryptoZor.Ru',
          og_description: 'Новости и статьи о технологиях, бизнесе и инновациях',
          og_type: 'website'
        }
      }
    }
    
    const res = await fetch(`${API_URL}/global?populate=favicon&populate=seo&populate=seo.og_image`, {
      next: { revalidate: 1 },
    })
    if (!res.ok) {
      console.warn(`Failed to fetch global data: ${res.status}`)
      return {
        seo: {
          title_tag: 'CryptoZor.Ru',
          meta_description: 'Новости и статьи о технологиях, бизнесе и инновациях',
          og_title: 'CryptoZor.Ru',
          og_description: 'Новости и статьи о технологиях, бизнесе и инновациях',
          og_type: 'website'
        }
      }
    }
    const json = await res.json()
    return json?.data || {
      seo: {
        title_tag: 'CryptoZor.Ru',
        meta_description: 'Новости и статьи о технологиях, бизнесе и инновациях',
        og_title: 'CryptoZor.Ru',
        og_description: 'Новости и статьи о технологиях, бизнесе и инновациях',
        og_type: 'website'
      }
    }
  } catch (error) {
    console.error('Error fetching global data:', error)
    return {
      seo: {
        title_tag: 'CryptoZor.Ru',
        meta_description: 'Новости и статьи о технологиях, бизнесе и инновациях',
        og_title: 'CryptoZor.Ru',
        og_description: 'Новости и статьи о технологиях, бизнесе и инновациях',
        og_type: 'website'
      }
    }
  }
}

function GlobalLoadingIndicator() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div className="h-full bg-blue-500 animate-pulse" style={{ width: '100%' }}></div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  // Во время сборки возвращаем статические метаданные
  if (process.env.NODE_ENV === 'production') {
    return {
      title: 'CryptoZor.Ru',
      description: 'Новости и статьи о технологиях, бизнесе и инновациях',
      openGraph: {
        title: 'CryptoZor.Ru',
        type: 'website',
        description: 'Новости и статьи о технологиях, бизнесе и инновациях',
      },
    }
  }

  const { seo } = await getGlobal()

  return {
    title: seo?.title_tag || 'CryptoZor.Ru',
    description: seo?.meta_description || 'Новости и статьи о технологиях, бизнесе и инновациях',
    keywords: seo?.meta_keywords?.split(',').map((k: string) => k.trim()),

    openGraph: {
      title: seo?.og_title || 'CryptoZor.Ru',
      type: seo?.og_type || 'website',
      url: seo?.og_url,
      description: seo?.og_description || 'Новости и статьи о технологиях, бизнесе и инновациях',
      images: seo?.og_image?.url ? [
        {
          url: `${BASE_URL}${seo.og_image.url}`,
          width: seo.og_image.width,
          height: seo.og_image.height,
          alt: seo.og_image.alternativeText || seo?.og_title || 'CryptoZor.Ru',
        }
      ] : undefined,
    },
  }
}

async function getCategories() {
  // Всегда возвращаем пустой массив во время сборки
  if (process.env.NODE_ENV === 'production') {
    return []
  }

  try {
    if (!API_URL) {
      console.warn('API_URL is not defined for categories')
      return []
    }
    
    const res = await fetch(
      `${API_URL}/categories?populate[icon][populate]&populate[wallpaper][populate]`,
      { next: { revalidate: 100 } },
    )
    if (!res.ok) {
      console.warn(`Failed to fetch categories: ${res.status}`)
      return []
    }
    const json = await res.json()
    return Array.isArray(json?.data) ? json.data : []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

async function getTags() {
  // Всегда возвращаем пустой массив во время сборки
  if (process.env.NODE_ENV === 'production') {
    return []
  }

  try {
    if (!API_URL) {
      console.warn('API_URL is not defined for tags')
      return []
    }
    
    const res = await fetch(`${API_URL}/tags?populate=icon&populate=articles&pagination[pageSize]=100`, {
      next: { revalidate: 100 },
    })
    if (!res.ok) {
      console.warn(`Failed to fetch tags: ${res.status}`)
      return []
    }
    const json = await res.json()
    return Array.isArray(json?.data) ? json.data : []
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

async function getSocials() {
  // Всегда возвращаем пустой объект во время сборки
  if (process.env.NODE_ENV === 'production') {
    return {}
  }

  try {
    if (!API_URL) {
      console.warn('API_URL is not defined for socials')
      return {}
    }
    
    const res = await fetch(`${API_URL}/social`, {
      next: { revalidate: 100 },
    })
    if (!res.ok) {
      console.warn(`Failed to fetch socials: ${res.status}`)
      return {}
    }
    const json = await res.json()
    return json?.data || {}
  } catch (error) {
    console.error('Error fetching socials:', error)
    return {}
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Во время сборки используем пустые данные
  const categories = process.env.NODE_ENV === 'production' ? [] : await getCategories()
  const tags = process.env.NODE_ENV === 'production' ? [] : await getTags()
  const socials = process.env.NODE_ENV === 'production' ? {} : await getSocials()

  const settings = process.env.NODE_ENV === 'production' ? {
    seo: {
      title_tag: 'CryptoZor.Ru',
      meta_description: 'Новости и статьи о технологиях, бизнесе и инновациях',
      og_title: 'CryptoZor.Ru',
      og_description: 'Новости и статьи о технологиях, бизнесе и инновациях',
      og_type: 'website'
    }
  } : await getGlobal()

  let html_seo_description = ''
  if (process.env.NODE_ENV !== 'production') {
    try {
      html_seo_description = parseBlocks(
        Array.isArray(settings?.seo?.['html_seo_description'])
          ? settings.seo['html_seo_description']
          : []
      ) || ''
    } catch (error) {
      console.error('Error parsing html_seo_description:', error)
      html_seo_description = ''
    }
  }
  
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="html-seo-description"
          content={html_seo_description.toString()}
        />
        <meta name="yandex-verification" content="7b9defedb9698895" />
        <script dangerouslySetInnerHTML={{ __html: 'window.yaContextCb=window.yaContextCb||[]' }} />
        <script src="https://yandex.ru/ads/system/context.js" async />
        <Script id="gtm-head" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W43XG9MK');
          `}
        </Script>
      </head>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <LoadingIndicator />
        <Suspense fallback={<GlobalLoadingIndicator />}>
          <Drawer tags={tags} categories={categories} socials={socials} />
          <SearchModal tags={tags} />
          <div className="tablet-small:px-5 tablet:grid-cols-[300px_1fr_300px] tablet-small:grid-cols-[300px_1fr] relative mx-auto grid min-h-screen max-w-[1440px] grid-cols-[1fr] px-4">
            <Sidebar tags={tags} categories={categories} />
            <div className="flex flex-col">
              <Header tags={tags} categories={categories} />
              <MobileHeader tags={tags} categories={categories} />
              <main className="tablet-small:px-7 flex-1 tablet-small:pt-0 pt-4">
                <LayoutDataProvider value={{ categories, tags }}>
                  {children}
                </LayoutDataProvider>
              </main>
            </div>
            <Socials socials={socials} />
          </div>
        </Suspense>
        <Toaster
          toastOptions={{
            classNames: {
              default:
                '!bg-white/10 !min-w-[440px] backdrop-blur !text-sm !p-4 !rounded-2xl !border-0 !text-white',
            },
          }}
          position="bottom-right"
        />
        
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {
                  if (document.scripts[j].src === r) { return; }
                }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=103425474", "ym");

            ym(103425474, 'init', {
                ssr:true,
                webvisor:true,
                clickmap:true,
                ecommerce:"dataLayer",
                accurateTrackBounce:true,
                trackLinks:true
            });
          `}
        </Script>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/103425474"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>

        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-C6DHB3DCBR"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C6DHB3DCBR');
          `}
        </Script>
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W43XG9MK" height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
        </noscript>
      </body>
    </html>
  )
}
import { Metadata } from 'next'
import AboutContent from './AboutContent'

export const generateMetadata = (): Metadata => {
  const og_images = 'https://cryptozor.ru/about'
  return {
    title: 'О проекте CryptoZor LTD — p2p, трейдинг, криптовалюты',
    description: 'CryptoZor LTD — команда профессионалов в сфере криптовалют, p2p-обменов и трейдинга. Узнайте о нашей миссии, целях и подходе.',
    keywords: 'CryptoZor LTD, криптовалютный проект, команда CryptoZor, p2p трейдинг, криптообмен, криптовалютные новости',
    openGraph: {
      title: 'О проекте CryptoZor LTD — кто мы и чем занимаемся',
      description: 'Познакомьтесь с CryptoZor LTD: p2p-торговля, трейдинг и инновации в криптомире. Узнайте, кто стоит за проектом и наши цели.',
      type: 'website',
      url: 'https://cryptozor.ru/about/',
      images: og_images ? [
        {
          url: og_images,
          alt: 'CryptoZor LTD — О компании и проекте',
        },
      ] : undefined,
    },
  }
}

export default function AboutPage() {
  return <AboutContent />
}
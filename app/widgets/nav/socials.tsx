'use client'
import { SearchInput } from '@/app/features/search/input'
import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/app/shared/ui/button'

declare global {
  interface Window {
    yaContextCb: any[];
    Ya: any;
  }
}

type SocialsProps = {
  socials: any
}

// Новый компонент для карточки соцсети
function SocialCard({
  imageSrc,
  imageAlt,
  label,
  title,
  subscribers,
  buttonHref,
  buttonText,
  buttonGradient
}: {
  imageSrc: string;
  imageAlt: string;
  label: string;
  title: string;
  subscribers: string;
  buttonHref: string;
  buttonText: string;
  buttonGradient: string;
}) {
  return (
    <div className="p-[2px] rounded-xl bg-gradient-to-br from-[#D9D9D9] to-[#75BE40]">
      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-[#2e2e2e] to-[#181818] shadow-xl flex flex-col border border-transparent">
        <div className={'relative h-[115px] w-full'}>
          <Image
            src={imageSrc}
            className="object-cover"
            sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
            alt={imageAlt}
            fill
          />
        </div>
        <div className="flex flex-col gap-2 p-4">
          <div className="text-xs font-medium text-white/60 uppercase tracking-wide">{label}</div>
          <div className="font-bold text-white text-lg leading-tight">{title}</div>
          <div className="text-xs font-medium text-white/60">{subscribers}</div>
          <Button
            className={`w-full mt-2 py-2 rounded-lg text-white font-bold text-sm uppercase transition-transform hover:scale-105 shadow-lg bg-gradient-to-r from-[#444444] to-[#75BE40]`}
            href={buttonHref}
            size={'sm'}
            target={'_blank'}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Socials({ socials }: SocialsProps) {
  useEffect(() => {
    if (window.yaContextCb) {
      window.yaContextCb.push(() => {
        const container = document.getElementById("yandex_rtb_R-A-16335060-1");
        if (container && window.Ya?.Context?.AdvManager) {
          window.Ya.Context.AdvManager.render({
            blockId: "R-A-16335060-1",
            renderTo: "yandex_rtb_R-A-16335060-1"
          });
        }
      });
    }
  }, []);

  return (
    <div className="tablet:flex col-span-1 hidden flex-col pb-5">
      <SearchInput className={'bg-bg sticky top-0 h-20'} value={''} />
      <div className={'sticky top-20 flex flex-col gap-5'}>
        {socials?.youtube && (
          <SocialCard
            imageSrc="/youtube.jpg"
            imageAlt="Youtube Premium"
            label="НАШ YOUTUBE"
            title="Cryptozor"
            subscribers="597 140 подписчиков"
            buttonHref={socials.youtube}
            buttonText="Подписаться"
            buttonGradient="bg-gradient-to-r from-[#1B3A1B] via-[#2e4319] to-[#0F2911] border-2 border-[#2e4319]"
          />
        )}
        <SocialCard
          imageSrc="/dzen.jpg"
          imageAlt="Дзен"
          label="НАШ DZEN"
          title="CryptoZor"
          subscribers="1000+ подписчиков"
          buttonHref="https://dzen.ru/cryptozor"
          buttonText="Подписаться"
          buttonGradient="bg-gradient-to-r from-black via-[#444444] to-[#75BE40]"
        />
      </div>
      {/* Yandex.RTB R-A-16335060-1 */}
      <div id="yandex_rtb_R-A-16335060-1"></div>
    </div>
  )
}
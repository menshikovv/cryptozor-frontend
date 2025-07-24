import Image from 'next/image'
import { ButtonHTMLAttributes, FC } from 'react'
import { cn } from '@/app/shared/libs'

export type BadgeProps = ButtonHTMLAttributes<HTMLDivElement> & {
  size?: 'xs' | 'sm'
  icon?: string
}

export const Badge: FC<BadgeProps> = ({ children, icon, size = 'xs' }) => {
  return (
    <div
      className={cn(
        size === 'xs' && '!h-6 !text-[11px]',
        'bg-primary/30 flex h-7 items-center justify-center gap-2 rounded-lg px-2 text-xs leading-loose font-medium transition-colors hover:bg-primary/50 cursor-pointer',
      )}
    >
      {icon && (
        <Image
          src={icon}
          alt={'Icon'}
          width={14}
          height={14}
          className={'bg-primary size-[14px] rounded-[2px]'}
        />
      )}
      <span style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 100,
        display: 'inline-block',
        verticalAlign: 'bottom',
      }}>{children}</span>
    </div>
  )
}

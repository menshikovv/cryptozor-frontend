import { ButtonHTMLAttributes, FC } from 'react'
import { tv, VariantProps } from 'tailwind-variants'
import { cn } from '@/app/shared/libs'
import Link from 'next/link'

const button = tv({
  base: 'inline-flex tracking-tight items-center cursor-pointer leading-loose justify-center font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',

  variants: {
    variant: {
      primary: 'bg-primary text-white hover:bg-secondary',
      outline: 'bg-white border-[#1F29371F] shadow-button border',
      secondary: 'bg-white shadow-button',
    },
    size: {
      sm: 'h-9 px-4 text-sm rounded-full',
      md: 'px-[23px] h-12.75 text-base rounded-[7px] font-semibold',
      lg: 'px-[23px] tablet-small:h-15 h-[47px] tablet-small:text-base text-[13px] rounded-[7px] tablet-small:rounded-[11px] font-semibold',
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & {
    href?: string
    target?: '_blank' | '_self'
  }

export const Button: FC<ButtonProps> = ({
  type = 'button',
  variant,
  target = '_blank',
  size,
  id,
  className,
  children,
  href,
  ...props
}) => {
  if (href) {
    return (
      <Link
        target={target}
        href={href}
        id={id}
        className={cn(button({ variant, size }), className)}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={cn(button({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  )
}

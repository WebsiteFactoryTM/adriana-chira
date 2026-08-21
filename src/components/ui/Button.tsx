import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Butonul din designul aprobat: pilulă, versale, letter-spacing .06em,
 * minimum 44px înălțime (țintă de atingere, brief §5.4).
 */

export type ButtonVariant = 'primary' | 'outline' | 'soft' | 'onDark'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

const BASE =
  'inline-flex items-center justify-center gap-[10px] rounded-pill font-medium uppercase min-h-[44px] ' +
  'transition-[background-color,color,border-color,transform] duration-[320ms] ease-ac'

const VARIANTS: Record<ButtonVariant, string> = {
  // Pilulă închisă, plină. CTA principal.
  primary: 'bg-ac-ink text-ac-paper border border-ac-ink hover:bg-black hover:-translate-y-[2px]',
  // Contur în cerneală, se umple la hover. Header, carduri de pachet.
  outline: 'border border-ac-ink text-ac-ink hover:bg-ac-ink hover:text-ac-paper',
  // Contur hairline. CTA secundar, lângă cel principal.
  soft: 'border border-ac-line text-ac-ink hover:border-ac-ink hover:-translate-y-[2px]',
  // Pe fundal întunecat.
  onDark: 'bg-ac-paper text-ac-ink border border-ac-paper hover:-translate-y-[2px]',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-6 py-[14px] text-btn',
  md: 'px-7 py-4 text-btn',
  lg: 'px-[34px] py-[18px] text-nav tracking-[0.06em]',
  xl: 'px-10 py-5 text-nav tracking-[0.06em]',
}

type CommonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}

type ButtonAsLink = CommonProps & { href: string } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'href' | 'className' | 'children'
  >

type ButtonAsButton = CommonProps & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'children'
  >

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = 'primary', size = 'lg', className, children, ...rest } = props
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className)

  if (typeof rest.href === 'string') {
    const { href, ...anchorProps } = rest as ButtonAsLink
    // Ancorele pe aceeași pagină nu au nevoie de router — <a> nativ e mai ieftin.
    if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) {
      return (
        <a href={href} className={classes} {...anchorProps}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    )
  }

  const { type = 'button', ...buttonProps } = rest as ButtonAsButton
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  )
}

/** Săgeata care avansează la hover pe rândul/cardul părinte. */
export function Arrow() {
  return (
    <span
      data-arrow
      aria-hidden="true"
      className="block opacity-35 transition-[transform,opacity] duration-[420ms] ease-ac"
    >
      →
    </span>
  )
}

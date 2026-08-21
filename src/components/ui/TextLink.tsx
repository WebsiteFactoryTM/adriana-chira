import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Link de text cu subliniere care crește din stânga (320ms).
 * Fără schimbare de culoare la hover — regulă de design (brief §5.6).
 */
type Props = {
  href: string
  children: ReactNode
  className?: string
  /** Adaugă „ →" după text, ca în design. */
  arrow?: boolean
}

export function TextLink({ href, children, className, arrow = false }: Props) {
  const classes = cn('ac-underline', className)
  const content = (
    <>
      {children}
      {arrow ? ' →' : null}
    </>
  )

  if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}

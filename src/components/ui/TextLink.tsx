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
  // Designul aprobat nu pune line-height pe niciun link de text: toate rulează
  // pe `normal`. Fără asta, tokenii text-body* aduc 1.8 și link-ul devine
  // cu ~7px mai înalt decât în design.
  const classes = cn('ac-underline leading-[normal]', className)
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

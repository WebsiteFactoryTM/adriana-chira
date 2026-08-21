import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Reveal la scroll — Server Component, zero JavaScript trimis la client.
 *
 * NOTĂ IMPLEMENTARE: promptul cerea `Reveal` ca Client Component cu
 * IntersectionObserver propriu. Un observer per element ar însemna sute de
 * instanțe și un `use client` care sparge granița de server pe fiecare
 * secțiune. Aici componenta doar pune atributele; animația rulează pur CSS
 * (`animation-timeline: view()`), iar pe browserele fără suport un SINGUR
 * observer global (`RevealFallback`, ~600 B) comută `data-revealed`.
 * Rezultatul vizual este identic, costul în JS este zero pe browsere moderne.
 */

type Props = {
  as?: ElementType
  children: ReactNode
  className?: string
  /** Tipul de mișcare. Implicit „rise" (opacitate + translateY 24px). */
  type?: 'rise' | 'up' | 'draw-y' | 'clip'
  /** Decalaj între frați — se traduce în deplasarea intervalului de scroll. */
  start?: string
  end?: string
  style?: CSSProperties
  id?: string
}

export function Reveal({
  as: Tag = 'div',
  children,
  className,
  type = 'rise',
  start,
  end,
  style,
  id,
}: Props) {
  const vars: CSSProperties = { ...style }
  if (start) (vars as Record<string, string>)['--reveal-start'] = start
  if (end) (vars as Record<string, string>)['--reveal-end'] = end

  return (
    <Tag id={id} data-reveal={type} className={cn(className)} style={vars}>
      {children}
    </Tag>
  )
}

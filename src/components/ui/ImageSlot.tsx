import Image from 'next/image'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import type { ImageSlotContent } from '@/content/types'

/**
 * Slot de imagine cu raport fixat de tip.
 *
 * Regula (brief §5.7): înlocuirea unui placeholder cu fotografia reală NU are
 * voie să miște layout-ul cu un pixel. De aceea raportul este determinat de
 * `slot`, nu de imagine, iar cutia există identic în ambele stări. CLS = 0.
 */

const ASPECT: Record<ImageSlotContent['slot'], string> = {
  'hero-portrait': 'aspect-[3/4]',
  'about-portrait': 'aspect-[4/5]',
  'post-cover': 'aspect-[4/3]',
  // Antetele paginilor interioare. Raportul e chiar cel al fotografiilor din
  // ședința foto (2:3 vertical, 3:2 orizontal), deci acolo nu se taie nimic.
  'page-portrait': 'aspect-[2/3]',
  'page-wide': 'aspect-[3/2]',
}

type Props = {
  content: ImageSlotContent
  /** Doar portretul din hero primește `priority` (buget LCP, brief §10.2). */
  priority?: boolean
  /** Obligatoriu corect: un `sizes` greșit anulează beneficiul responsive. */
  sizes: string
  className?: string
  /** Animația de intrare a cutiei: „clip" la scroll sau la încărcare. */
  reveal?: 'clip-on-load' | 'clip-on-scroll' | 'none'
  revealDelay?: number
}

export function ImageSlot({
  content,
  priority = false,
  sizes,
  className,
  reveal = 'none',
  revealDelay,
}: Props) {
  const boxClasses = cn(
    ASPECT[content.slot],
    'relative overflow-hidden bg-ac-cream-100',
    reveal === 'clip-on-scroll' && 'motion-safe:[--reveal-end:34%]',
    className,
  )

  const revealAttrs =
    reveal === 'clip-on-load'
      ? { 'data-enter': 'clip' as const }
      : reveal === 'clip-on-scroll'
        ? { 'data-reveal': 'clip' as const }
        : {}

  const style = revealDelay
    ? ({ '--enter-delay': `${revealDelay}ms` } as CSSProperties)
    : undefined

  if (!content.src) {
    return (
      <div
        data-image-slot={content.slot}
        className={cn(boxClasses, 'flex items-center justify-center')}
        {...revealAttrs}
        style={style}
      >
        <div aria-hidden="true" className="ac-slot-mark absolute inset-0" />
        <span className="relative font-medium text-label uppercase text-ac-accent-deep">
          {content.placeholderLabel}
        </span>
      </div>
    )
  }

  return (
    <div data-image-slot={content.slot} className={boxClasses} {...revealAttrs} style={style}>
      <Image
        data-zoom
        data-drift
        src={content.src}
        alt={content.alt}
        width={content.width}
        height={content.height}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        className={cn(
          'block size-full object-cover transition-transform duration-[900ms] ease-ac',
          // Gradare caldă, ușor desaturată — doar pe portretul din hero.
          content.slot === 'hero-portrait' && 'contrast-[1.04] saturate-[.95]',
        )}
        style={{ objectPosition: content.objectPosition ?? '50% 50%' }}
      />
    </div>
  )
}

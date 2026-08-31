import type { ReactNode } from 'react'

import { Eyebrow } from '@/components/ui/Eyebrow'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Section, Shell } from '@/components/ui/Section'
import type { Eyebrow as EyebrowContent, ImageSlotContent } from '@/content/types'
import { cn } from '@/lib/cn'

/**
 * Lățimea coloanei de fotografie, pe slot. Verticala primește mai puțin decât
 * orizontala: la aceeași lățime ar înălța antetul cu peste 200px și ar împinge
 * conținutul paginii sub prima vizualizare.
 */
const FIGURE: Record<'page-portrait' | 'page-wide' | 'default', { px: number; max: string }> = {
  'page-portrait': { px: 380, max: 'max-w-[380px]' },
  'page-wide': { px: 460, max: 'max-w-[460px]' },
  default: { px: 420, max: 'max-w-[420px]' },
}

const figureFor = (slot: ImageSlotContent['slot']) =>
  slot === 'page-portrait' || slot === 'page-wide' ? FIGURE[slot] : FIGURE.default

/**
 * Antetul unei pagini interioare.
 *
 * Designul aprobat este o pagină unică și nu conține un asemenea antet; forma
 * de aici este hero-ul homepage-ului redus la esență — aceeași etichetă
 * versală, același `h1` în Cormorant light, același ritm de spațiere. Nimic
 * nou ca limbaj vizual, doar mai puțin.
 *
 * `h1` apare o singură dată pe pagină și este mereu aici (brief §8.2).
 */
type Props = {
  eyebrow: EyebrowContent
  title: string
  /** Fraza mare de sub titlu. Opțională: nu orice pagină are una. */
  lead?: string | null
  /** Metadate sau butoane sub lead. */
  children?: ReactNode
  /** Fără padding sus, când deasupra e deja firul Ariadnei. */
  tight?: boolean
  /**
   * Fotografia paginii, în coloana din dreapta. Opțională: paginile legale și
   * cele de confirmare rămân doar text, ca până acum. Când lipsește, antetul
   * randează exact aceeași coloană unică de dinainte.
   */
  image?: ImageSlotContent | null
}

export function PageHeader({ eyebrow, title, lead, children, tight = false, image }: Props) {
  const hasImage = Boolean(image?.src)

  return (
    <Section
      padding="none"
      className={
        tight
          ? 'pt-[clamp(28px,3.5vw,48px)] pb-[clamp(48px,7vw,88px)]'
          : 'pt-[clamp(4rem,10vh,7rem)] pb-[clamp(48px,7vw,88px)]'
      }
    >
      <Shell
        className={
          hasImage
            ? 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-col-gap'
            : undefined
        }
      >
        <div>
          <Eyebrow content={eyebrow} />

          <h1 className="mt-[clamp(24px,3.2vw,40px)] max-w-[20ch] font-display text-h1 font-light">
            {title}
          </h1>

          {lead && (
            <p className="mt-[clamp(24px,3vw,36px)] max-w-[46ch] font-display text-lead font-light text-ac-ink-70">
              {lead}
            </p>
          )}

          {children}
        </div>

        {/*
          `priority`: pe paginile interioare fotografia din antet este chiar
          elementul LCP, deci amânarea ei ar strica exact bugetul pe care îl
          apără regula „doar hero-ul primește priority" (brief §10.2).
        */}
        {image && hasImage && (
          <figure className={cn('ac-media w-full justify-self-center', figureFor(image.slot).max)}>
            <ImageSlot
              content={image}
              priority
              reveal="clip-on-load"
              sizes={`(max-width: 1000px) 100vw, ${figureFor(image.slot).px}px`}
            />
            {image.caption && (
              <figcaption className="mt-4 font-medium text-label uppercase text-ac-ink-50">
                {image.caption}
              </figcaption>
            )}
          </figure>
        )}
      </Shell>
    </Section>
  )
}

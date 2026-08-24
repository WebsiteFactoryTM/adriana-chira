import type { ReactNode } from 'react'

import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section, Shell } from '@/components/ui/Section'
import type { Eyebrow as EyebrowContent } from '@/content/types'

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
}

export function PageHeader({ eyebrow, title, lead, children, tight = false }: Props) {
  return (
    <Section
      padding="none"
      className={
        tight
          ? 'pt-[clamp(28px,3.5vw,48px)] pb-[clamp(48px,7vw,88px)]'
          : 'pt-[clamp(4rem,10vh,7rem)] pb-[clamp(48px,7vw,88px)]'
      }
    >
      <Shell>
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
      </Shell>
    </Section>
  )
}

import type { CSSProperties } from 'react'

import { Reveal } from '@/components/ui/Reveal'
import { Rule } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import type { Testimonial } from '@/content/types'

/**
 * O recomandare, în forma scurtă.
 *
 * `<blockquote>` cu `<cite>` în `<figcaption>`, nu un `<div>` cu ghilimele
 * desenate: e singura formă din care un motor de căutare sau un cititor de
 * ecran înțelege că textul aparține altcuiva. Marcajul `Review` din datele
 * structurate descrie chiar acest fragment, iar regula din brief §8.3 spune că
 * marcajul reflectă exact ce vede utilizatorul.
 *
 * Fraza afișată este COPIATĂ din textul integral, nu rezumată — vezi regula 2
 * din `src/content/testimonials.ts`. Linkul de sub ea duce la recomandarea
 * întreagă, ca nimeni să nu trebuiască să ne creadă pe cuvânt că fraza nu a
 * fost scoasă din context.
 */
export function TestimonialCard({
  testimonial,
  index,
  href,
}: {
  testimonial: Testimonial
  index: number
  href: string
}) {
  return (
    <Reveal
      as="figure"
      start={`${index * 4}%`}
      end={`${26 + index * 4}%`}
      className="flex flex-col gap-7 rounded-card border border-ac-line p-[clamp(28px,3vw,40px)]"
      style={{ '--reveal-start': `${index * 4}%` } as CSSProperties}
    >
      <span aria-hidden="true" className="block h-px w-10 shrink-0 bg-ac-accent" />

      <blockquote className="font-display text-summary font-light text-ac-ink">
        {testimonial.excerpt}
      </blockquote>

      <Rule className="mt-auto" />

      <figcaption>
        <cite className="block font-display text-h3 font-normal not-italic text-ac-ink">
          {testimonial.author}
        </cite>
        {/* Funcția lipsește la unele recomandări; rândul dispare, nu se umple. */}
        {testimonial.role && (
          <p className="mt-2 text-body-sm leading-[1.7] text-ac-ink-70">{testimonial.role}</p>
        )}
        {testimonial.context && (
          <p className="mt-1 text-body-sm leading-[1.7] text-ac-ink-50">{testimonial.context}</p>
        )}

        <TextLink href={href} className="mt-5 inline-block text-body-sm" arrow>
          Citește recomandarea integral
        </TextLink>
      </figcaption>
    </Reveal>
  )
}

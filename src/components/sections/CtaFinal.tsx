import { Arrow, Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import type { CtaContent } from '@/content/types'

/** „Prima discuție e despre tine, nu despre pachete." Ultimul pas din §4.1. */
export function CtaFinal({ content }: { content: CtaContent }) {
  return (
    <Section id="cta" tone="cream-100" padding="cta" aura="cta" aria-labelledby="cta-titlu">
      <div className="mx-auto max-w-cta px-gutter text-center">
        <Eyebrow content={content.eyebrow} tone="onCream" center />

        <Reveal
          as="h2"
          id="cta-titlu"
          end="32%"
          className="mx-auto mt-[clamp(32px,4vw,56px)] max-w-[22ch] font-display text-h2 font-light"
        >
          {content.heading}
        </Reveal>

        <p className="mx-auto mt-8 max-w-[52ch] text-body-lg text-ac-ink-70">{content.body}</p>

        <div className="mt-[clamp(40px,5vw,64px)] flex justify-center">
          <Button href={content.cta.href} variant="primary" size="xl">
            {content.cta.label}
            <Arrow />
          </Button>
        </div>

        <p className="mt-6 font-medium text-[11px] tracking-[0.2em] uppercase text-ac-ink-70">
          {content.note}
        </p>
      </div>
    </Section>
  )
}

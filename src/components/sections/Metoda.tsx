import { Reveal } from '@/components/ui/Reveal'
import { Section, Shell } from '@/components/ui/Section'
import type { MetodaContent } from '@/content/types'

/** Metoda pe scurt: trei pași de clarificare. Bloc centrat, singurul din pagină. */
export function Metoda({ content }: { content: MetodaContent }) {
  return (
    <Section id="metoda" aura="metoda" aria-labelledby="metoda-titlu">
      <div className="mx-auto max-w-narrow px-gutter text-center">
        <p className="font-medium text-eyebrow uppercase text-ac-accent-ink">
          {content.eyebrow.text}
        </p>
        <Reveal
          as="h2"
          id="metoda-titlu"
          end="32%"
          className="mx-auto mt-[clamp(32px,4vw,56px)] max-w-[26ch] font-display text-h2 font-light"
        >
          {content.heading}
        </Reveal>
        <p className="mx-auto mt-[clamp(32px,4vw,48px)] max-w-[60ch] text-body-lg text-ac-ink-70">
          {content.body}
        </p>
      </div>

      <Shell className="mt-[clamp(64px,8vw,112px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-[clamp(32px,4vw,64px)]">
        {content.steps.map((step) => (
          <Reveal key={step.index} className="border-t border-ac-line pt-8">
            <p className="font-medium text-label tracking-[0.22em] text-ac-accent-ink">{step.index}</p>
            <h3 className="mt-6 font-display text-h3 font-normal">{step.title}</h3>
            <p className="mt-4 text-body text-ac-ink-70">{step.body}</p>
          </Reveal>
        ))}
      </Shell>
    </Section>
  )
}

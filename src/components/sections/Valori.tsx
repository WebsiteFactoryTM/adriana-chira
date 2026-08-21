import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section, Shell } from '@/components/ui/Section'
import type { ValoriContent } from '@/content/types'

/** Cele cinci valori, numerotate 01–05 în Cormorant, în culoarea de accent. */
export function Valori({ content }: { content: ValoriContent }) {
  return (
    <Section id="valori" padding="bottom-only" aria-labelledby="valori-titlu">
      <Shell>
        {/* Eticheta „Valori" ESTE titlul secțiunii: h2 stilizat ca eyebrow. */}
        <Eyebrow as="h2" id="valori-titlu" content={content.eyebrow} />

        <ul className="mt-[clamp(48px,6vw,80px)]">
          {content.values.map((value, index) => (
            <li
              key={value.index}
              className={`ac-row grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] items-start gap-x-[clamp(32px,4vw,72px)] gap-y-5 border-t border-ac-line px-row-x py-row ${
                index === content.values.length - 1 ? 'border-b' : ''
              }`}
            >
              <div className="flex items-baseline gap-5">
                <span aria-hidden="true" className="font-display text-numeral font-light text-ac-accent">
                  {value.index}
                </span>
                <h3 className="font-display text-h3-card font-normal">{value.title}</h3>
              </div>
              <p className="max-w-[54ch] text-body text-ac-ink-70">{value.body}</p>
            </li>
          ))}
        </ul>
      </Shell>
    </Section>
  )
}

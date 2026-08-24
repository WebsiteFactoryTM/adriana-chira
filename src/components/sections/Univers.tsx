import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section, Shell, StickyColumn } from '@/components/ui/Section'
import type { UniversContent } from '@/content/types'

/**
 * Universul Adriana Chira: CHIRA Framework™, CLAR™, Strategic Performance
 * Assessment. Formulat la timpul prezent, ca ecosistem în construcție
 * (brief §4.3) — viitorul ar semnala că nimic nu e gata.
 */
export function Univers({ content }: { content: UniversContent }) {
  return (
    <Section id="univers" tone="cream" aria-labelledby="univers-titlu">
      <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-col-gap">
        <StickyColumn>
          <Eyebrow content={content.eyebrow} />
          <h2 id="univers-titlu" className="mt-8 max-w-[20ch] font-display text-h2-col font-light">
            {content.heading}
          </h2>
          <p className="mt-8 max-w-[44ch] text-body text-ac-ink-70">{content.body}</p>
          <p className="mt-8 font-medium text-[11px] tracking-[0.2em] uppercase text-ac-accent-ink">
            {content.note}
          </p>
        </StickyColumn>

        <ul>
          {content.items.map((item, index) => (
            <li
              key={item.title}
              className={`ac-row grid grid-cols-[48px_1fr] items-start gap-5 border-t border-ac-line px-[clamp(12px,2vw,20px)] py-row ${
                index === content.items.length - 1 ? 'border-b' : ''
              }`}
            >
              <span
                aria-hidden="true"
                className="font-display text-numeral-roman font-light text-ac-accent"
              >
                {item.numeral}
              </span>
              <div>
                <h3 className="font-display text-h3-univers font-normal">
                  {item.title}
                  {item.trademark && (
                    <sup className="text-[0.5em] text-ac-ink-50">™</sup>
                  )}
                </h3>
                <p className="mt-4 max-w-[56ch] text-body text-ac-ink-70">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Shell>
    </Section>
  )
}

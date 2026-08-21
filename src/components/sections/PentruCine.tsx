import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section, Shell } from '@/components/ui/Section'
import type { PentruCineContent } from '@/content/types'

/** Cele patru segmente din brief §2.1, ca rânduri cu hairline. */
export function PentruCine({ content }: { content: PentruCineContent }) {
  return (
    <Section id="pentru-cine" padding="bottom-only" aria-labelledby="pentru-cine-titlu">
      <Shell>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow content={content.eyebrow} />
            <h2
              id="pentru-cine-titlu"
              className="mt-8 max-w-[22ch] font-display text-h2-wide font-light"
            >
              {content.heading}
            </h2>
          </div>
          <span className="font-medium text-label uppercase text-ac-ink-50">{content.aside}</span>
        </div>

        <ul className="mt-block">
          {content.segments.map((segment, index) => (
            <li
              key={segment.title}
              className={`ac-row grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-baseline gap-x-[clamp(32px,4vw,72px)] gap-y-6 border-t border-ac-line px-row-x py-row ${
                index === content.segments.length - 1 ? 'border-b' : ''
              }`}
            >
              <h3 className="font-display text-h3-lg font-normal">{segment.title}</h3>
              <p className="max-w-[52ch] text-body text-ac-ink-70">{segment.body}</p>
            </li>
          ))}
        </ul>
      </Shell>
    </Section>
  )
}

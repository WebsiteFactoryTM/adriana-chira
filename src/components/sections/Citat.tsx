import type { CSSProperties } from 'react'
import { Section } from '@/components/ui/Section'
import type { CitatContent } from '@/content/types'

/**
 * Singurul bloc întunecat din corpul paginii (brief §5.3). Două ar dizolva
 * efectul. Linia verticală se trasează de sus în jos la intrarea în viewport.
 */
export function Citat({ content }: { content: CitatContent }) {
  return (
    <Section id="citat" tone="ink" padding="wide" aura="citat">
      <div className="mx-auto max-w-narrow px-gutter text-center">
        <span
          data-reveal="draw-y"
          aria-hidden="true"
          className="mx-auto mb-[clamp(40px,5vw,64px)] block h-[clamp(48px,7vw,88px)] w-px bg-ac-accent [--reveal-end:34%]"
        />

        <blockquote className="font-display text-quote font-light text-ac-paper">
          {content.lines.map((line, index) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <span
                data-reveal="up"
                className="block"
                style={
                  {
                    '--reveal-start': `${index * 6}%`,
                    '--reveal-end': `${34 + index * 6}%`,
                  } as CSSProperties
                }
              >
                {line}
              </span>
            </span>
          ))}
        </blockquote>

        <p className="mt-[clamp(40px,5vw,64px)] font-medium text-eyebrow uppercase text-ac-accent">
          {content.attribution}
        </p>
      </div>
    </Section>
  )
}

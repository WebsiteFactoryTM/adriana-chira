import { Eyebrow } from '@/components/ui/Eyebrow'
import { Reveal } from '@/components/ui/Reveal'
import { Section, Shell, StickyColumn } from '@/components/ui/Section'
import type { ProblemaContent } from '@/content/types'

/**
 * „Știu în ce punct ești." Recunoaștere înainte de vânzare (brief §2.3.2).
 * Titlul secțiunii poartă răspunsul; cele patru semne sunt concrete, nu adjective.
 */
export function Problema({ content }: { content: ProblemaContent }) {
  return (
    <Section id="problema" tone="cream" padding="tight" aria-labelledby="problema-titlu">
      <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-start gap-col-gap">
        <StickyColumn>
          <Eyebrow content={content.eyebrow} tone="onCream" />
          <Reveal
            as="h2"
            id="problema-titlu"
            end="30%"
            className="mt-8 max-w-[22ch] font-display text-h2-col font-light"
          >
            {content.heading}
          </Reveal>
          <p className="mt-8 max-w-[46ch] text-body text-ac-ink-70">{content.body}</p>
        </StickyColumn>

        <ul>
          {content.signs.map((sign, index) => (
            <Reveal
              as="li"
              key={sign.index}
              className={`grid grid-cols-[56px_1fr] items-baseline gap-5 border-t border-ac-line py-[clamp(28px,3vw,40px)] ${
                index === content.signs.length - 1 ? 'border-b' : ''
              }`}
            >
              <span className="font-medium text-[11px] tracking-[0.2em] text-ac-accent-ink">
                {sign.index}
              </span>
              <p className="font-display text-statement font-normal">{sign.body}</p>
            </Reveal>
          ))}
        </ul>
      </Shell>
    </Section>
  )
}

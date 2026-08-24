import { Eyebrow } from '@/components/ui/Eyebrow'
import { FaqList } from '@/components/ui/FaqList'
import { Section, Shell, StickyColumn } from '@/components/ui/Section'
import type { FaqContent } from '@/content/types'

/**
 * Secțiunea de întrebări frecvente de pe homepage.
 *
 * Lista propriu-zisă stă în `ui/FaqList`, pentru că pagina de servicii și
 * paginile de pachet o folosesc la rândul lor (faza 3b).
 */
export function Faq({ content }: { content: FaqContent }) {
  return (
    <Section id="faq" aria-labelledby="faq-titlu">
      <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-col-gap">
        <StickyColumn>
          <Eyebrow content={content.eyebrow} />
          <h2 id="faq-titlu" className="mt-8 max-w-[20ch] font-display text-h2-col font-light">
            {content.heading}
          </h2>
        </StickyColumn>

        <FaqList items={content.items} />
      </Shell>
    </Section>
  )
}

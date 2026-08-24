import { Eyebrow } from '@/components/ui/Eyebrow'
import { PackageCard } from '@/components/ui/PackageCard'
import { Section, Shell } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import type { ServiciiContent } from '@/content/types'

/**
 * Previzualizarea pachetelor de pe homepage.
 *
 * Cardul propriu-zis stă în `ui/PackageCard`, pentru că pagina `/servicii`
 * randează exact același card (faza 3b).
 */
export function Servicii({ content }: { content: ServiciiContent }) {
  return (
    <Section id="servicii" aria-labelledby="servicii-titlu">
      <Shell>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow content={content.eyebrow} />
            <h2 id="servicii-titlu" className="mt-8 max-w-[20ch] font-display text-h2-wide font-light">
              {content.heading}
            </h2>
          </div>
          <p className="max-w-[44ch] text-body text-ac-ink-70">{content.intro}</p>
        </div>

        <div className="mt-block grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-stretch gap-[clamp(20px,2.4vw,32px)]">
          {content.packages.map((pkg, index) => (
            <PackageCard key={pkg.numeral} pkg={pkg} index={index} />
          ))}
        </div>

        <div className="mt-[clamp(40px,5vw,64px)] flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-50">
            {content.reassurance.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <TextLink href={content.footerLink.href} className="text-body" arrow>
            {content.footerLink.label}
          </TextLink>
        </div>
      </Shell>
    </Section>
  )
}

import type { CSSProperties, ReactNode } from 'react'
import { Arrow, Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Reveal } from '@/components/ui/Reveal'
import { Rule, Section, Shell } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import type { PackagePreview, ServiciiContent } from '@/content/types'

/**
 * Previzualizarea pachetelor.
 *
 * Conținutul pachetelor nu este încă definit de clientă (brief §13.1). Cardul
 * randează structura finală și marchează câmpurile lipsă cu `[ ... ]`, exact
 * ca în designul aprobat. Când vin datele, nu se schimbă nicio linie de layout.
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

function PackageCard({ pkg, index }: { pkg: PackagePreview; index: number }) {
  const numeralColor = pkg.featured ? 'text-ac-accent-deep' : 'text-ac-accent-ink'

  return (
    <Reveal
      as="article"
      start={`${index * 4}%`}
      end={`${26 + index * 4}%`}
      className={`flex flex-col gap-7 rounded-card p-[clamp(28px,3vw,40px)] ${
        pkg.featured ? 'border border-ac-accent bg-ac-cream-50' : 'border border-ac-line'
      }`}
      style={{ '--reveal-start': `${index * 4}%` } as CSSProperties}
    >
      <p className={`font-medium text-label tracking-[0.22em] ${numeralColor}`}>{pkg.numeral}</p>

      <div>
        <h3 className="font-display text-h3-card font-normal text-ac-ink-70">
          <Slot value={pkg.name}>[ Nume pachet ]</Slot>
        </h3>
        <p className="mt-[14px] text-body text-ac-ink-70">
          <Slot value={pkg.tagline}>[ O frază despre ce rezolvă acest pachet ]</Slot>
        </p>
      </div>

      <Rule />

      <div className="grid gap-6">
        <div>
          <FieldLabel featured={pkg.featured}>Pentru cine</FieldLabel>
          <p className="mt-2 text-body-sm leading-[1.75] text-ac-ink-70">
            <Slot value={pkg.forWho}>[ profilul clientului potrivit ]</Slot>
          </p>
        </div>

        <div>
          <FieldLabel featured={pkg.featured}>Ce include</FieldLabel>
          <ul className="mt-2 grid gap-1.5">
            {pkg.includes.map((item, itemIndex) => (
              <li key={itemIndex} className="text-body-sm leading-[1.7] text-ac-ink-70">
                <Slot value={item}>[ element ]</Slot>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FieldLabel featured={pkg.featured}>Durată</FieldLabel>
          <p className="mt-2 text-body-sm leading-[1.75] text-ac-ink-70">
            <Slot value={pkg.duration}>[ x sesiuni · y săptămâni ]</Slot>
          </p>
        </div>
      </div>

      <Rule />

      <p className="font-display text-price font-light text-ac-ink-70">
        {pkg.price === null ? (
          <span data-placeholder>[ 000 ] {pkg.currency}</span>
        ) : (
          <>
            {pkg.price} {pkg.currency}
          </>
        )}
      </p>

      <Button
        href={pkg.href}
        variant={pkg.featured ? 'primary' : 'outline'}
        size="md"
        className="mt-auto w-full"
      >
        Detalii și achiziție
        <Arrow />
      </Button>
    </Reveal>
  )
}

function FieldLabel({ children, featured }: { children: ReactNode; featured: boolean }) {
  return (
    <p
      className={`font-medium text-[11px] tracking-[0.2em] uppercase ${
        featured ? 'text-ac-accent-deep' : 'text-ac-accent-ink'
      }`}
    >
      {children}
    </p>
  )
}

/** Randează valoarea reală sau marcajul de placeholder din designul aprobat. */
function Slot({ value, children }: { value: string | null; children: ReactNode }) {
  if (value) return <>{value}</>
  return <span data-placeholder>{children}</span>
}

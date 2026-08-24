import type { CSSProperties, ReactNode } from 'react'

import { Arrow, Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Rule } from '@/components/ui/Section'
import type { PackagePreview } from '@/content/types'

/**
 * Cardul unui pachet.
 *
 * Trăia în `sections/Servicii.tsx` până la faza 3b; l-am scos aici pentru că
 * pagina `/servicii` randează exact același card. Markup-ul e neatins — cardul
 * de pe homepage a fost verificat la pixel față de designul aprobat
 * (STATUS §6) și nu are voie să se schimbe pentru că a fost mutat.
 *
 * Conținutul pachetelor nu este încă definit de clientă (STATUS §7.1). Cardul
 * randează structura finală și marchează câmpurile lipsă cu `[ ... ]`, exact
 * ca în design. Când vin datele, nu se schimbă nicio linie de layout.
 */
export function PackageCard({ pkg, index }: { pkg: PackagePreview; index: number }) {
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

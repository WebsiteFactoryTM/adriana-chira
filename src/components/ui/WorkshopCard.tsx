import type { CSSProperties } from 'react'

import { Button } from '@/components/ui/Button'
import { CheckoutButton } from '@/components/ui/CheckoutButton'
import { Reveal } from '@/components/ui/Reveal'
import { Rule } from '@/components/ui/Section'
import { WORKSHOP_COMMON } from '@/content/workshops'
import type { Workshop } from '@/content/types'
import { formatSessionDate } from '@/lib/workshops'

/**
 * Un workshop din catalog.
 *
 * ## Detaliul se deschide în pagină, pe `<details>` nativ
 *
 * Cerința clientei: pe card se vede o descriere scurtă, iar la apăsarea unui
 * buton apar toate detaliile. `<details>`/`<summary>` face exact asta cu zero
 * JavaScript — aceeași alegere ca la întrebările frecvente, și din același
 * motiv (brief §9.2): textul rămâne în DOM și când acordeonul e închis.
 *
 * Contează pentru AEO. Crawlerele de AI, spre deosebire de Googlebot, în
 * general nu execută JS. Un „citește mai mult" făcut cu stare de React ar
 * ascunde paisprezece programe de workshop exact de motoarele pe care le
 * țintim, și ar mai adăuga și a cincea componentă de client în site.
 *
 * ## Cele două căi de înscriere
 *
 * Edițiile deschise (următoarele trei programate) au butonul de plată. Sub el
 * stă mereu și calea fără plată online — pentru cine vrea factură pe firmă,
 * transfer bancar sau pur și simplu să întrebe ceva înainte. Restul
 * catalogului are doar calea a doua, formulată ca anunț de interes.
 */
export function WorkshopCard({ workshop, index }: { workshop: Workshop; index: number }) {
  const { title, subtitle, summary, sessionDate, purchasable, slug } = workshop
  const headingId = `${slug}-titlu`

  return (
    <Reveal
      as="article"
      id={slug}
      start={`${(index % 3) * 4}%`}
      end={`${26 + (index % 3) * 4}%`}
      className={`flex scroll-mt-[132px] flex-col gap-7 rounded-card p-[clamp(28px,3vw,40px)] ${
        purchasable ? 'border border-ac-accent bg-ac-cream-50' : 'border border-ac-line'
      }`}
      style={{ '--reveal-start': `${(index % 3) * 4}%` } as CSSProperties}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p
          className={`font-medium text-label tracking-[0.22em] ${
            purchasable ? 'text-ac-accent-deep' : 'text-ac-accent-ink'
          }`}
        >
          {workshop.numeral}
        </p>

        {sessionDate ? (
          <p
            className={`font-medium text-[11px] tracking-[0.18em] uppercase ${
              purchasable ? 'text-ac-accent-deep' : 'text-ac-ink-50'
            }`}
          >
            <time dateTime={sessionDate}>{formatSessionDate(sessionDate)}</time>
          </p>
        ) : (
          <p className="font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-50">
            Dată în curs de stabilire
          </p>
        )}
      </div>

      <div>
        <h3 id={headingId} className="font-display text-h3-card font-normal text-ac-ink">
          {title}
        </h3>
        <p className="mt-[14px] text-body text-ac-ink-70">{subtitle}</p>
      </div>

      <p className="text-body-sm leading-[1.75] text-ac-ink-70">{summary}</p>

      <details className="border-t border-ac-line">
        <summary className="flex min-h-11 items-center justify-between gap-4 py-4">
          <span className="font-medium text-btn uppercase tracking-[0.06em] text-ac-accent-ink">
            Citește tot programul
          </span>
          <span data-plus aria-hidden="true" className="text-xl leading-none text-ac-accent">
            +
          </span>
        </summary>

        <div className="grid gap-7 pb-8">
          <Block label="Ce este acest workshop">{workshop.what}</Block>
          <Block label="Ce probleme te ajută să abordezi">{workshop.problems}</Block>
          <Block label="Ce lucrăm în ziua respectivă">{workshop.workMethod}</Block>

          <div>
            <FieldLabel>Cu ce rămâi la final</FieldLabel>
            <ul className="mt-3 grid gap-2">
              {workshop.outcomes.map((item, itemIndex) => (
                <li key={itemIndex} className="text-body-sm leading-[1.7] text-ac-ink-70">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/*
            Formatul, durata și ce include prețul NU se repetă aici. Sunt
            identice la toate cele paisprezece workshopuri și stau o singură
            dată, în capul paginii. Paisprezece copii ale aceluiași paragraf
            pe o adresă e chiar tiparul pe care Google îl citește ca umplutură.
          */}
          <p className="text-body-sm leading-[1.7] text-ac-ink-50">
            {WORKSHOP_COMMON.duration}, {WORKSHOP_COMMON.schedule}, în Timișoara. Programul
            complet al zilei și ce include prețul sunt descrise mai sus, la începutul paginii.
          </p>
        </div>
      </details>

      <Rule />

      <div className="mt-auto grid gap-4">
        <p className="font-display text-price font-light text-ac-ink-70">
          {workshop.price} {workshop.currency}
          <span className="ml-3 align-middle font-sans text-[11px] tracking-[0.18em] uppercase text-ac-ink-50">
            de participant
          </span>
        </p>

        {purchasable ? (
          <>
            <CheckoutButton
              kind="workshop"
              slug={slug}
              label="Rezervă locul"
              variant="primary"
              size="md"
            />
            <p className="text-body-sm leading-[1.7] text-ac-ink-50">
              Preferi factură pe firmă sau plată prin transfer?{' '}
              <a
                href={`/contact?workshop=${slug}`}
                className="ac-underline leading-[normal] text-ac-ink-70"
              >
                Rezervă fără plată online
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <Button href={`/contact?workshop=${slug}`} variant="outline" size="md" className="w-full">
              Anunță-mă când se programează
            </Button>
            <p className="text-body-sm leading-[1.7] text-ac-ink-50">
              Ediția nu are încă dată. Îți scriu imediat ce se stabilește una.
            </p>
          </>
        )}
      </div>
    </Reveal>
  )
}

function Block({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <p className="mt-3 text-body-sm leading-[1.75] text-ac-ink-70">{children}</p>
    </div>
  )
}

function FieldLabel({ children }: { children: string }) {
  return (
    <p className="font-medium text-[11px] tracking-[0.2em] uppercase text-ac-accent-ink">
      {children}
    </p>
  )
}

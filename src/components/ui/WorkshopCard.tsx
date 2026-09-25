import type { CSSProperties } from 'react'

import { Button } from '@/components/ui/Button'
import { CheckoutButton } from '@/components/ui/CheckoutButton'
import { Glyph } from '@/components/ui/Glyph'
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
 * ## Ediția deschisă trebuie să se vadă de la doi metri
 *
 * Paisprezece carduri identice sunt un catalog; trei dintre ele se pot cumpăra
 * chiar acum, iar restul nu. Diferența o fac trei lucruri deodată, nu unul:
 * **fundalul** (crem, pe o secțiune de hârtie), **marginea în accent** și
 * **pastila „Înscrieri deschise"**. Culoarea singură n-ar fi suficientă — cine
 * n-o distinge ar rămâne fără informație, iar pastila o scrie în cuvinte.
 *
 * Prima variantă punea cardurile crem pe o secțiune tot crem, deci nu se
 * deosebeau deloc. Secțiunea a trecut pe hârtie, tocmai ca să existe contrastul.
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
      className={`flex scroll-mt-[132px] flex-col gap-6 rounded-card p-[clamp(28px,3vw,40px)] ${
        purchasable
          ? 'border border-ac-accent bg-ac-cream-50'
          : 'border border-ac-line bg-ac-paper'
      }`}
      style={{ '--reveal-start': `${(index % 3) * 4}%` } as CSSProperties}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p
          className={`font-medium text-label ${
            purchasable ? 'text-ac-accent-deep' : 'text-ac-accent-ink'
          }`}
        >
          {workshop.numeral}
        </p>

        {purchasable ? (
          <p className="flex items-center gap-[10px] rounded-pill border border-ac-accent px-[14px] py-[6px] font-medium text-[11px] tracking-[0.18em] uppercase text-ac-accent-deep">
            <span aria-hidden="true" className="block size-[5px] rounded-pill bg-ac-accent" />
            Înscrieri deschise
          </p>
        ) : (
          <p className="font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-50">
            În catalog
          </p>
        )}
      </div>

      <div>
        <h3 id={headingId} className="font-display text-h3-card font-normal text-ac-ink">
          {title}
        </h3>
        <p className="mt-[14px] text-body text-ac-ink-70">{subtitle}</p>
      </div>

      {/* Data ediției: rândul pe care îl caută ochiul întâi. */}
      <p
        className={`flex items-center gap-3 font-medium text-[11px] tracking-[0.18em] uppercase ${
          purchasable ? 'text-ac-accent-deep' : 'text-ac-ink-50'
        }`}
      >
        <Glyph name="calendar" size="sm" className="text-ac-accent" />
        {sessionDate ? (
          <time dateTime={sessionDate}>{formatSessionDate(sessionDate)}</time>
        ) : (
          'Dată în curs de stabilire'
        )}
      </p>

      <p className="text-body-sm leading-[1.75] text-ac-ink-70">{summary}</p>

      <details className="border-t border-ac-line">
        {/*
          Rezumatul arată ca un buton, nu ca un rând de text. Prima variantă
          era un rând cu un „+" în dreapta, adică exact ce nu se apasă: pe un
          card care are dedesubt un buton plin de plată, singurul lucru care
          spune „și eu sunt de apăsat" e conturul.
        */}
        <summary className="mt-5 flex min-h-11 w-full items-center justify-between gap-4 rounded-pill border border-ac-line px-[22px] py-3 transition-colors duration-[220ms] hover:border-ac-ink">
          <span className="font-medium text-btn uppercase text-ac-accent-ink">
            Citește tot programul
          </span>
          <span data-plus aria-hidden="true" className="text-xl leading-none text-ac-accent">
            +
          </span>
        </summary>

        <div className="grid gap-7 pt-8 pb-2">
          <Block label="Ce este acest workshop">{workshop.what}</Block>
          <Block label="Ce probleme te ajută să abordezi">{workshop.problems}</Block>
          <Block label="Ce lucrăm în ziua respectivă">{workshop.workMethod}</Block>

          <div>
            <FieldLabel glyph>Cu ce rămâi la final</FieldLabel>
            <ul className="mt-4 grid">
              {workshop.outcomes.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="flex items-start gap-3 border-t border-ac-line py-3 text-body-sm leading-[1.7] text-ac-ink-70 last:border-b"
                >
                  <Glyph name="check" size="sm" className="mt-[5px] text-ac-accent" />
                  <span>{item}</span>
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
          <p className="text-body-sm leading-[1.7] text-ac-ink-70">
            {WORKSHOP_COMMON.duration}, {WORKSHOP_COMMON.schedule}, în Timișoara. Programul
            complet al zilei și ce include prețul sunt descrise mai sus, la începutul paginii.
          </p>
        </div>
      </details>

      <Rule />

      <div className="mt-auto grid gap-4">
        <p className="flex items-baseline gap-3 font-display text-price font-light text-ac-ink-70">
          <Glyph name="coin" size="sm" className="translate-y-[2px] text-ac-accent" />
          {workshop.price} {workshop.currency}
          <span className="font-sans text-[11px] tracking-[0.18em] uppercase text-ac-ink-70">
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
            <p className="text-body-sm leading-[1.7] text-ac-ink-70">
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
            <Button
              href={`/contact?workshop=${slug}`}
              variant="outline"
              size="md"
              className="w-full"
            >
              Anunță-mă când se programează
            </Button>
            <p className="text-body-sm leading-[1.7] text-ac-ink-70">
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

function FieldLabel({ children, glyph = false }: { children: string; glyph?: boolean }) {
  return (
    <p className="flex items-center gap-3 font-medium text-[11px] tracking-[0.2em] uppercase text-ac-accent-ink">
      {glyph && <Glyph name="diamond" size="sm" className="text-ac-accent" />}
      {children}
    </p>
  )
}

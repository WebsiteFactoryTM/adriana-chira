import type { Metadata } from 'next'

import { PageHeader } from '@/components/layout/PageHeader'
import { PageCta } from '@/components/sections/PageCta'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { Arrow, Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FaqList } from '@/components/ui/FaqList'
import { PackageCard } from '@/components/ui/PackageCard'
import { Rule, Section, Shell, StickyColumn } from '@/components/ui/Section'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { TextLink } from '@/components/ui/TextLink'
import { homeContent } from '@/content/home'
import { serviciiPage } from '@/content/pages'
import type { PackagePreview } from '@/content/types'
import { WORKSHOP_COMMON } from '@/content/workshops'
import {
  getFaqs,
  getPackages,
  getSiteSettings,
  getTestimonials,
  getWorkshops,
} from '@/lib/content'
import {
  breadcrumbSchema,
  collectionPageSchema,
  faqSchema,
  graph,
  professionalServiceSchema,
  reviewSchemas,
} from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { formatSessionDate, WORKSHOPS_PATH } from '@/lib/workshops'

const TRAIL: Crumb[] = [
  { label: 'Acasă', href: '/' },
  { label: 'Servicii', href: '/servicii' },
]

export const metadata: Metadata = pageMetadata({
  title: 'Servicii',
  description: serviciiPage.metaDescription,
  path: '/servicii',
})

/** ISR: pachetele se schimbă rar, dar hook-ul de salvare invalidează imediat. */
export const revalidate = 3600

/**
 * Lista de servicii.
 *
 * Sursa este colecția `packages`, filtrată pe „Vizibil pe site" și ordonată
 * după `order`. Cât timp niciun pachet nu e vizibil — adică până când clienta
 * decide nume și prețuri (STATUS §7.1) — pagina randează cardurile-placeholder
 * din designul aprobat, exact ca homepage-ul. Nu e o stare de eroare, este
 * chiar starea de azi.
 */
export default async function ServiciiPage() {
  const [packages, faqs, settings, workshops, testimonials] = await Promise.all([
    getPackages(),
    getFaqs('servicii'),
    getSiteSettings(),
    getWorkshops(),
    getTestimonials(),
  ])

  const cards: PackagePreview[] =
    packages.length > 0 ? packages : homeContent.servicii.packages

  // Doar edițiile deschise la înscriere. Teaserul nu are ce promite din
  // catalogul neprogramat: cine vrea tot catalogul apasă butonul de sub el.
  const openWorkshops = workshops.filter((item) => item.purchasable)
  const workshopPrice = workshops[0]?.price ?? null
  const workshopCurrency = workshops[0]?.currency ?? 'RON'

  // O singură recomandare, aleasă de ordinea din admin. Trei ar fi transformat
  // pagina de vânzare într-o pagină de recomandări.
  const testimonial = testimonials.find((item) => item.featured) ?? testimonials[0]

  return (
    <>
      <Breadcrumb trail={TRAIL} />

      <main id="continut">
        <PageHeader
          eyebrow={serviciiPage.eyebrow}
          title={serviciiPage.title}
          lead={serviciiPage.lead}
          image={serviciiPage.image}
          tight
        />

        <Section padding="bottom-only" aria-labelledby="pachete-titlu">
          <Shell>
            <h2 id="pachete-titlu" className="ac-sr-only">
              Pachetele disponibile
            </h2>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-stretch gap-[clamp(20px,2.4vw,32px)]">
              {cards.map((pkg, index) => (
                <PackageCard key={pkg.numeral} pkg={pkg} index={index} />
              ))}
            </div>

            {/* Banda de reasigurare, aceeași ca pe homepage. */}
            <ul className="mt-[clamp(40px,5vw,64px)] flex flex-wrap gap-x-8 gap-y-3 border-t border-ac-line pt-8 font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-50">
              {serviciiPage.reassurance.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Shell>
        </Section>

        {/* ---------------------------------------------------------------- */}

        {/*
          Workshopurile.
          Nu sunt un al patrulea card de pachet, și e o decizie de conținut, nu
          de layout: un workshop e o zi în grup, pe o singură competență, la 510
          lei — alt angajament, alt public, alt preț. Pus lângă un program de
          15.000 de lei, ar fi arătat ca „varianta ieftină" a aceluiași lucru.
          Aici primește propria secțiune, care spune în ce fel diferă, și
          trimite la catalogul complet.
        */}
        <Section tone="cream" aria-labelledby="workshopuri-titlu">
          <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-col-gap">
            <StickyColumn>
              <Eyebrow
                content={{ text: 'Human Performance Workshops', ornament: 'pulse' }}
              />
              <h2
                id="workshopuri-titlu"
                className="mt-8 max-w-[20ch] font-display text-h2-col font-light"
              >
                Sau o singură zi, pe o singură competență
              </h2>
              <p className="mt-8 max-w-[46ch] text-body text-ac-ink-70">
                Pe lângă programele individuale, susțin o serie de {workshops.length} workshopuri
                practice de {WORKSHOP_COMMON.duration}, în grup restrâns, în Timișoara: leadership,
                comunicare, reziliență, decizie, adaptabilitate, delegare și performanță
                sustenabilă.
              </p>
              <p className="mt-6 max-w-[46ch] text-body-sm leading-[1.75] text-ac-ink-50">
                Programele individuale schimbă modul de funcționare. Un workshop dezvoltă o
                competență, cu instrumente pe care le aplici a doua zi.
              </p>

              <Button href={WORKSHOPS_PATH} variant="outline" size="lg" className="mt-9">
                Vezi toate workshopurile
                <Arrow />
              </Button>
            </StickyColumn>

            <div>
              {openWorkshops.length > 0 ? (
                <>
                  <p className="font-medium text-label uppercase text-ac-accent-deep">
                    Deschise acum la înscriere
                  </p>

                  <ul className="mt-7 grid gap-0">
                    {openWorkshops.map((workshop, index) => (
                      <li
                        key={workshop.slug}
                        className={`border-t border-ac-line py-7 ${
                          index === openWorkshops.length - 1 ? 'border-b' : ''
                        }`}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                          <h3 className="font-display text-summary font-normal">
                            <TextLink
                              href={`${WORKSHOPS_PATH}#${workshop.slug}`}
                              className="text-summary"
                            >
                              {workshop.title}
                            </TextLink>
                          </h3>
                          {workshop.sessionDate && (
                            <p className="font-medium text-[11px] tracking-[0.18em] uppercase text-ac-accent-deep">
                              <time dateTime={workshop.sessionDate}>
                                {formatSessionDate(workshop.sessionDate)}
                              </time>
                            </p>
                          )}
                        </div>
                        <p className="mt-3 max-w-[52ch] text-body-sm leading-[1.75] text-ac-ink-70">
                          {workshop.subtitle}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-7 text-body-sm leading-[1.75] text-ac-ink-50">
                    {workshopPrice === null
                      ? null
                      : `${workshopPrice} ${workshopCurrency} de participant. `}
                    Sunt deschise întotdeauna doar următoarele trei ediții programate; restul
                    catalogului se vede oricând pe pagina workshopurilor.
                  </p>
                </>
              ) : (
                <p className="max-w-[52ch] text-body text-ac-ink-70">
                  Nicio ediție nu este deschisă la înscriere în acest moment. Catalogul complet
                  rămâne pe pagina workshopurilor, iar pentru oricare dintre ele îți poți anunța
                  interesul.
                </p>
              )}
            </div>
          </Shell>
        </Section>

        {/* ---------------------------------------------------------------- */}

        {testimonial && (
          <Section padding="tight" aria-labelledby="recomandare-titlu">
            <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-col-gap">
              <div>
                <Eyebrow content={{ text: 'Recomandări', ornament: 'line' }} />
                <h2
                  id="recomandare-titlu"
                  className="mt-8 max-w-[20ch] font-display text-h2-col font-light"
                >
                  Cum e să lucrezi cu mine, spus de altcineva
                </h2>
                <p className="mt-8 max-w-[44ch] text-body text-ac-ink-70">
                  Recomandările sunt publicate integral, semnate cu numele și funcția celor care
                  le-au scris.
                </p>
                <Rule className="my-9" />
                <TextLink href="/testimoniale" className="text-body" arrow>
                  Citește toate recomandările
                </TextLink>
              </div>

              <TestimonialCard
                testimonial={testimonial}
                index={0}
                href={`/testimoniale#${testimonial.slug}`}
              />
            </Shell>
          </Section>
        )}

        {faqs.length > 0 && (
          <Section id="faq" tone="cream" aria-labelledby="faq-servicii-titlu">
            <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-col-gap">
              <StickyColumn>
                <Eyebrow content={{ text: 'Înainte să cumperi', ornament: 'line' }} />
                <h2
                  id="faq-servicii-titlu"
                  className="mt-8 max-w-[20ch] font-display text-h2-col font-light"
                >
                  Ce vor să știe oamenii despre pachete
                </h2>
              </StickyColumn>

              <FaqList items={faqs} />
            </Shell>
          </Section>
        )}

        <PageCta
          eyebrow={homeContent.cta.eyebrow}
          heading="Nu ești sigur care pachet ți se potrivește?"
          body="Atunci începe cu o discuție. Îți spun ce cred că are sens pentru situația ta — inclusiv dacă am ajunge la concluzia că niciunul dintre ele nu ți se potrivește deocamdată."
          primary={{ label: 'Programează o discuție', href: '/contact' }}
          note={settings.responseTime}
        />
      </main>

      <JsonLd
        data={graph([
          collectionPageSchema(
            {
              name: 'Servicii',
              description: serviciiPage.metaDescription,
              path: '/servicii',
              // Cele trei programe, plus catalogul de workshopuri ca o a patra
              // intrare. `ItemList` descrie exact ce se vede pe pagină, în
              // ordinea în care se vede (brief §8.3).
              items: [
                ...packages.map((pkg) => ({
                  name: pkg.name ?? 'Pachet',
                  path: pkg.href,
                })),
                {
                  name: 'Workshopuri de performanță umană',
                  path: WORKSHOPS_PATH,
                },
              ],
            },
            settings,
          ),
          breadcrumbSchema(TRAIL, settings.url),
          professionalServiceSchema(settings),
          // Recomandarea chiar afișată pe pagină, cu fraza chiar afișată.
          ...(testimonial ? reviewSchemas([testimonial], settings, '/testimoniale') : []),
          ...(faqs.length > 0 ? [faqSchema(faqs, settings.url, '/servicii')] : []),
        ])}
      />
    </>
  )
}

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { PageHeader } from '@/components/layout/PageHeader'
import { PageCta } from '@/components/sections/PageCta'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FaqList } from '@/components/ui/FaqList'
import { Rule, Section, Shell, StickyColumn } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import { WorkshopCard } from '@/components/ui/WorkshopCard'
import { PURCHASABLE_WINDOW, WORKSHOP_COMMON, workshopsPage } from '@/content/workshops'
import { getFaqs, getSiteSettings, getWorkshops } from '@/lib/content'
import {
  breadcrumbSchema,
  collectionPageSchema,
  faqSchema,
  graph,
  professionalServiceSchema,
  workshopEventSchema,
} from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { WORKSHOPS_PATH } from '@/lib/workshops'

const TRAIL: Crumb[] = [
  { label: 'Acasă', href: '/' },
  { label: 'Servicii', href: '/servicii' },
  { label: 'Workshopuri', href: WORKSHOPS_PATH },
]

export const metadata: Metadata = pageMetadata({
  title: workshopsPage.title,
  description: workshopsPage.metaDescription,
  path: WORKSHOPS_PATH,
  seo: {
    metaTitle: workshopsPage.metaTitle,
    metaDescription: workshopsPage.metaDescription,
    ogImage: null,
    noIndex: false,
  },
})

/**
 * Catalogul de workshopuri.
 *
 * ## De ce o oră de revalidare, nu prerandare la build
 *
 * Este singura pagină din site al cărei conținut depinde de ziua curentă:
 * fereastra de înscriere ține primele trei ediții cu dată în viitor. Prerandată
 * la build, ar rămâne pe vecie cu fereastra din ziua deploy-ului. O oră e
 * suficient de des pentru ceva ce se schimbă lunar și suficient de rar cât să
 * nu conteze la trafic.
 *
 * ## De ce o singură pagină pentru toate cele paisprezece
 *
 * Așa a cerut clienta, și se apără: cele paisprezece workshopuri împart același
 * format, aceeași durată, același preț și același public. Paisprezece pagini ar
 * fi însemnat paisprezece adrese cu 80% text identic, care s-ar fi canibalizat
 * în căutări. Aici, fiecare workshop are ancora lui (`#busola-interna`), deci
 * poate fi trimis prin link direct, iar tot textul stă în DOM și când
 * acordeonul e închis, deci motoarele de răspuns îl citesc integral.
 */
export const revalidate = 3600

export default async function WorkshopuriPage() {
  const [workshops, faqs, settings] = await Promise.all([
    getWorkshops(),
    getFaqs('workshopuri'),
    getSiteSettings(),
  ])

  const open = workshops.filter((item) => item.purchasable)
  const price = workshops[0]?.price ?? null
  const currency = workshops[0]?.currency ?? 'RON'

  return (
    <>
      <Breadcrumb trail={TRAIL} />

      <main id="continut">
        <PageHeader
          eyebrow={workshopsPage.eyebrow}
          title={workshopsPage.title}
          lead={workshopsPage.lead}
          image={workshopsPage.image}
          tight
        >
          {/*
            Banda de fapte. Durata, orarul, ce include prețul și investiția
            sunt IDENTICE la toate cele paisprezece workshopuri, deci apar aici
            o singură dată. Repetate pe fiecare card, ar fi însemnat paisprezece
            copii ale aceluiași paragraf pe o singură adresă.
          */}
          <dl className="mt-[clamp(32px,4vw,48px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-x-8 gap-y-6 border-t border-ac-line pt-8">
            <Fact label="Durată">
              {WORKSHOP_COMMON.duration}, {WORKSHOP_COMMON.schedule}
            </Fact>
            <Fact label="Unde">{WORKSHOP_COMMON.location}</Fact>
            <Fact label="Inclus">{WORKSHOP_COMMON.included}</Fact>
            <Fact label="Investiție">
              {price === null ? '—' : `${price} ${currency} / participant`}
            </Fact>
          </dl>
        </PageHeader>

        {/* ---------------------------------------------------------------- */}

        <Section padding="bottom-only" aria-labelledby="serie-titlu">
          <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-col-gap">
            <StickyColumn>
              <Eyebrow content={{ text: 'Cum funcționează seria', ornament: 'line' }} />
              <h2 id="serie-titlu" className="mt-8 max-w-[20ch] font-display text-h2-col font-light">
                Un traseu, parcurs în pași care se pot lua și separat
              </h2>
              <p className="mt-8 max-w-[44ch] text-body text-ac-ink-70">
                {workshopsPage.positioning}
              </p>
            </StickyColumn>

            <div className="grid gap-block">
              <p className="max-w-[62ch] text-body-lg text-ac-ink-70">{workshopsPage.intro}</p>

              <div>
                <h3 className="font-display text-h3 font-normal">Ce diferențiază workshopurile</h3>
                <ul className="mt-6 grid gap-3">
                  {WORKSHOP_COMMON.differentiators.map((item) => (
                    <li key={item} className="max-w-[58ch] text-body text-ac-ink-70">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-display text-h3 font-normal">Cum se desfășoară o zi</h3>
                <p className="mt-6 max-w-[62ch] text-body text-ac-ink-70">
                  {WORKSHOP_COMMON.howItWorks}
                </p>

                {/*
                  `<table>` semantic, nu grilă de div-uri: programul zilei e
                  chiar genul de fragment pe care un motor de răspuns îl preia
                  integral (brief §9.1.5).
                */}
                <div className="mt-8 overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-left">
                    <caption className="ac-sr-only">
                      Programul orientativ al unei zile de workshop
                    </caption>
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="border-b border-ac-line py-[14px] pr-[14px] font-medium text-[11px] tracking-[0.18em] uppercase text-ac-accent-ink"
                        >
                          Interval
                        </th>
                        <th
                          scope="col"
                          className="border-b border-ac-line p-[14px] font-medium text-[11px] tracking-[0.18em] uppercase text-ac-accent-ink"
                        >
                          Structură
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {WORKSHOP_COMMON.agenda.map((row, index) => {
                        const last = index === WORKSHOP_COMMON.agenda.length - 1
                        const border = last ? '' : 'border-b border-ac-line'
                        return (
                          <tr key={row.time}>
                            <th
                              scope="row"
                              className={`py-[14px] pr-[14px] font-medium text-body-sm leading-[normal] whitespace-nowrap ${border}`}
                            >
                              {row.time}
                            </th>
                            <td
                              className={`p-[14px] text-body-sm leading-[1.65] text-ac-ink-70 ${border}`}
                            >
                              {row.body}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-display text-h3 font-normal">Pentru cine sunt potrivite</h3>
                <p className="mt-6 max-w-[62ch] text-body text-ac-ink-70">
                  {WORKSHOP_COMMON.forWho}
                </p>
              </div>
            </div>
          </Shell>
        </Section>

        {/* ---------------------------------------------------------------- */}

        <Section tone="cream" aria-labelledby="catalog-titlu">
          <Shell>
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div>
                <Eyebrow
                  content={{ text: 'Catalogul complet', ornament: 'pulse' }}
                  tone="default"
                />
                <h2
                  id="catalog-titlu"
                  className="mt-8 max-w-[22ch] font-display text-h2-wide font-light"
                >
                  Cele {workshops.length} workshopuri, în ordinea desfășurării
                </h2>
              </div>

              <p className="max-w-[46ch] text-body text-ac-ink-70">
                Sunt deschise pentru înscriere{' '}
                <strong className="font-medium">
                  întotdeauna doar următoarele {PURCHASABLE_WINDOW} ediții programate
                </strong>
                , câte una pe lună. Restul catalogului rămâne vizibil: pentru oricare dintre
                workshopuri îți poți anunța interesul, iar ediția primește dată când se strânge un
                grup.
              </p>
            </div>

            {open.length > 0 && (
              <p className="mt-8 max-w-[70ch] text-body-sm leading-[1.75] text-ac-ink-50">
                Deschise acum:{' '}
                {open.map((item, index) => (
                  <span key={item.slug}>
                    {index > 0 && (index === open.length - 1 ? ' și ' : ', ')}
                    <TextLink href={`#${item.slug}`} className="text-body-sm text-ac-ink-70">
                      {item.title}
                    </TextLink>
                  </span>
                ))}
                .
              </p>
            )}

            <div className="mt-block grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-[clamp(20px,2.4vw,32px)]">
              {workshops.map((workshop, index) => (
                <WorkshopCard key={workshop.slug} workshop={workshop} index={index} />
              ))}
            </div>

            <Rule className="mt-[clamp(48px,6vw,80px)]" />

            <p className="mt-8 max-w-[70ch] text-body-sm leading-[1.75] text-ac-ink-50">
              Cauți ceva mai amplu decât o zi de workshop? Cele trei{' '}
              <TextLink href="/servicii" className="text-body-sm text-ac-ink-70">
                programe individuale
              </TextLink>{' '}
              pornesc de la situația ta concretă și lucrează pe mai multe dimensiuni deodată, pe
              săptămâni sau luni.
            </p>
          </Shell>
        </Section>

        {/* ---------------------------------------------------------------- */}

        {faqs.length > 0 && (
          <Section id="faq" aria-labelledby="faq-workshopuri-titlu">
            <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-col-gap">
              <StickyColumn>
                <Eyebrow content={{ text: 'Înainte să te înscrii', ornament: 'line' }} />
                <h2
                  id="faq-workshopuri-titlu"
                  className="mt-8 max-w-[20ch] font-display text-h2-col font-light"
                >
                  Întrebări frecvente despre workshopuri
                </h2>
              </StickyColumn>

              <FaqList items={faqs} />
            </Shell>
          </Section>
        )}

        <PageCta
          eyebrow={{ text: 'Grupuri și echipe', ornament: 'pulse' }}
          heading="Vrei un workshop pentru echipa ta?"
          body="Oricare dintre cele paisprezece se poate susține intern, pentru o singură echipă, la o dată stabilită împreună și cu exemplele adaptate contextului vostru. Scrie-mi câți oameni sunteți și ce ați vrea să se schimbe după acea zi."
          primary={{ label: 'Cere o ofertă pentru echipă', href: '/contact' }}
          note={settings.responseTime}
        />
      </main>

      <JsonLd
        data={graph([
          collectionPageSchema(
            {
              name: 'Workshopuri de performanță umană',
              description: workshopsPage.metaDescription,
              path: WORKSHOPS_PATH,
              items: workshops.map((workshop) => ({
                name: workshop.title,
                path: `${WORKSHOPS_PATH}#${workshop.slug}`,
              })),
            },
            settings,
          ),
          breadcrumbSchema(TRAIL, settings.url),
          // `Event.organizer` trimite la `#serviciu`. Nodul acela se emitea
          // doar pe homepage, deci referința rămânea suspendată pe pagina
          // asta. Îl emitem și aici: graful fiecărei pagini trebuie să se
          // rezolve singur, fără să depindă de ce a mai crawlat motorul.
          professionalServiceSchema(settings),
          // `Event` doar pentru edițiile care chiar au o dată. Vezi schema.ts.
          ...workshops
            .map((workshop) => workshopEventSchema(workshop, settings, WORKSHOPS_PATH))
            .filter((node): node is NonNullable<typeof node> => node !== null),
          ...(faqs.length > 0 ? [faqSchema(faqs, settings.url, WORKSHOPS_PATH)] : []),
        ])}
      />
    </>
  )
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-medium text-[11px] tracking-[0.2em] uppercase text-ac-accent-ink">
        {label}
      </dt>
      <dd className="mt-2 text-body-sm leading-[1.7] text-ac-ink-70">{children}</dd>
    </div>
  )
}

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { PageHeader } from '@/components/layout/PageHeader'
import { PageCta } from '@/components/sections/PageCta'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FaqList } from '@/components/ui/FaqList'
import { Glyph, GlyphBadge, type GlyphName } from '@/components/ui/Glyph'
import { Reveal } from '@/components/ui/Reveal'
import { Rule, Section, Shell } from '@/components/ui/Section'
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
 *
 * ## Cum e împărțită vizual
 *
 * Prima variantă avea partea comună — ce diferențiază seria, programul zilei,
 * pentru cine e — într-o singură coloană lungă, sub un titlu. Corectă și
 * ilizibilă: pe o pagină care mai are dedesubt paisprezece carduri, un bloc de
 * text de trei ecrane e locul unde omul renunță. Acum sunt patru benzi, cu
 * fundaluri alternate și cu forma potrivită fiecăreia: carduri pentru
 * diferențiatori, tabel pentru orar, bloc întunecat pentru fraza despre public,
 * iar catalogul primește o bară de chipsuri prin care se sare direct la oricare
 * dintre cele paisprezece.
 */
export const revalidate = 3600

/** Semnele benzii de fapte din antet, în ordinea din `dl`. */
const HEADER_FACTS: GlyphName[] = ['clock', 'place', 'layers', 'coin']

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
          <dl className="mt-[clamp(32px,4vw,48px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-x-8 gap-y-7 border-t border-ac-line pt-8">
            <Fact glyph={HEADER_FACTS[0]} label="Durată">
              {WORKSHOP_COMMON.duration}, {WORKSHOP_COMMON.schedule}
            </Fact>
            <Fact glyph={HEADER_FACTS[1]} label="Unde">
              {WORKSHOP_COMMON.location}
            </Fact>
            <Fact glyph={HEADER_FACTS[2]} label="Inclus">
              {WORKSHOP_COMMON.included}
            </Fact>
            <Fact glyph={HEADER_FACTS[3]} label="Investiție">
              {price === null ? '—' : `${price} ${currency} / participant`}
            </Fact>
          </dl>
        </PageHeader>

        {/* ---------------------------------------------------------------- */}
        {/* Cum funcționează seria                                           */}

        <Section tone="cream" padding="body" aria-labelledby="serie-titlu">
          <Shell>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-x-col-gap gap-y-[clamp(24px,3vw,40px)]">
              <div>
                <div className="flex items-center gap-4">
                  <GlyphBadge name="path" />
                  <span className="font-medium text-label uppercase text-ac-accent-ink">
                    Cum funcționează seria
                  </span>
                </div>

                <Reveal
                  as="h2"
                  id="serie-titlu"
                  className="mt-7 max-w-[20ch] font-display text-h2-col font-light"
                >
                  Un traseu, parcurs în pași care se pot lua și separat
                </Reveal>
              </div>

              <div className="grid gap-6">
                <p className="max-w-[62ch] text-body-lg text-ac-ink-70">{workshopsPage.intro}</p>
                <p className="max-w-[62ch] text-body text-ac-ink-70">
                  {workshopsPage.positioning}
                </p>
              </div>
            </div>

            <h3 className="mt-[clamp(40px,5vw,64px)] flex items-center gap-3 font-medium text-label uppercase text-ac-accent-ink">
              <Glyph name="diamond" size="sm" className="text-ac-accent" />
              Ce diferențiază workshopurile
            </h3>

            <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] items-stretch gap-[clamp(16px,1.8vw,24px)]">
              {WORKSHOP_COMMON.differentiators.map((item, index) => (
                <Reveal
                  key={item}
                  start={`${(index % 3) * 3}%`}
                  className="rounded-card border border-ac-line bg-ac-paper p-[clamp(22px,2.2vw,30px)]"
                >
                  <p
                    aria-hidden="true"
                    className="font-display text-numeral-roman font-light text-ac-accent"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-4 text-body-sm leading-[1.75] text-ac-ink-70">{item}</p>
                </Reveal>
              ))}
            </div>
          </Shell>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Ziua de workshop                                                 */}

        <Section padding="body" aria-labelledby="ziua-titlu">
          <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-x-col-gap gap-y-[clamp(28px,3.5vw,44px)]">
            <div>
              <div className="flex items-center gap-4">
                <GlyphBadge name="clock" />
                <span className="font-medium text-label uppercase text-ac-accent-ink">
                  Ziua de workshop
                </span>
              </div>

              <Reveal
                as="h2"
                id="ziua-titlu"
                className="mt-7 max-w-[20ch] font-display text-h2-col font-light"
              >
                Cum se desfășoară o zi
              </Reveal>

              <p className="mt-8 max-w-[52ch] text-body text-ac-ink-70">
                {WORKSHOP_COMMON.howItWorks}
              </p>
            </div>

            {/*
              `<table>` semantic, nu grilă de div-uri: programul zilei e chiar
              genul de fragment pe care un motor de răspuns îl preia integral
              (brief §9.1.5). Ce s-a schimbat e doar cum se vede: modulele de
              lucru au marginea în accent și textul în cerneală, pauzele stau
              retrase. Împărțirea se deduce din text (`Modul …`), nu cere niciun
              câmp nou în conținut.
            */}
            <div className="overflow-x-auto rounded-card border border-ac-line bg-ac-cream-50 p-[clamp(18px,2vw,28px)]">
              <table className="w-full min-w-[440px] border-collapse text-left">
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
                    const isModule = row.body.startsWith('Modul')

                    return (
                      <tr key={row.time}>
                        <th
                          scope="row"
                          className={`py-[14px] pr-[14px] font-medium text-body-sm leading-[normal] whitespace-nowrap ${border} ${
                            isModule ? 'text-ac-ink' : 'text-ac-ink-70'
                          }`}
                        >
                          {row.time}
                        </th>
                        <td
                          className={`p-[14px] text-body-sm leading-[1.65] ${border} ${
                            isModule
                              ? 'border-l border-l-ac-accent text-ac-ink-70'
                              : 'border-l border-l-ac-line text-ac-ink-70'
                          }`}
                        >
                          {row.body}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Shell>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Pentru cine                                                      */}

        <Section tone="ink" padding="body" aria-labelledby="public-titlu">
          <div className="mx-auto max-w-cta px-gutter text-center">
            <h2
              id="public-titlu"
              className="flex items-center justify-center gap-4 font-medium text-label uppercase text-ac-accent"
            >
              <Glyph name="quote" size="sm" />
              Pentru cine sunt potrivite
            </h2>

            <Reveal
              as="p"
              end="34%"
              className="mx-auto mt-[clamp(28px,3.4vw,44px)] max-w-[32ch] font-display text-statement font-light"
            >
              {WORKSHOP_COMMON.forWho}
            </Reveal>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Catalogul                                                        */}

        <Section id="catalog" padding="tight" aria-labelledby="catalog-titlu">
          <Shell>
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div>
                <Eyebrow content={{ text: 'Catalogul complet', ornament: 'pulse' }} />
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

            {/*
              Bara de sărituri. Paisprezece carduri sunt patru–cinci ecrane de
              derulat; chipsurile le fac o listă de citit dintr-o privire, iar
              punctul de accent arată care trei se pot cumpăra chiar acum.
              Înlocuiește fraza „Deschise acum: …" de dinainte, care spunea
              strict mai puțin și tot text era.
            */}
            <nav aria-label="Sari la un workshop" className="mt-[clamp(32px,4vw,52px)]">
              <ol className="flex flex-wrap gap-[10px]">
                {workshops.map((workshop) => (
                  <li key={workshop.slug}>
                    <a
                      href={`#${workshop.slug}`}
                      className={`flex min-h-11 items-center gap-3 rounded-pill border px-[18px] py-2 text-body-sm leading-[normal] transition-colors duration-[220ms] hover:border-ac-ink ${
                        workshop.purchasable
                          ? 'border-ac-accent bg-ac-cream-50 text-ac-ink'
                          : 'border-ac-line text-ac-ink-70'
                      }`}
                    >
                      {workshop.purchasable ? (
                        <span
                          aria-hidden="true"
                          className="block size-[5px] shrink-0 rounded-pill bg-ac-accent"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="font-medium text-label text-ac-accent-ink"
                        >
                          {workshop.numeral}
                        </span>
                      )}
                      {workshop.title}
                    </a>
                  </li>
                ))}
              </ol>

              {open.length > 0 && (
                <p className="mt-5 text-body-sm leading-[1.7] text-ac-ink-50">
                  <span aria-hidden="true" className="mr-2 inline-block size-[5px] rounded-pill bg-ac-accent align-middle" />
                  Punctul auriu marchează cele {open.length} ediții deschise acum la înscriere.
                </p>
              )}
            </nav>

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
          <Section id="faq" tone="cream" padding="tight" aria-labelledby="faq-workshopuri-titlu">
            <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-x-col-gap gap-y-[clamp(28px,3.5vw,44px)]">
              <div>
                <Eyebrow content={{ text: 'Înainte să te înscrii', ornament: 'line' }} />
                <h2
                  id="faq-workshopuri-titlu"
                  className="mt-8 max-w-[20ch] font-display text-h2-col font-light"
                >
                  Întrebări frecvente despre workshopuri
                </h2>
              </div>

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

function Fact({
  glyph,
  label,
  children,
}: {
  glyph: GlyphName | undefined
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <dt className="flex items-center gap-3 font-medium text-[11px] tracking-[0.2em] uppercase text-ac-accent-ink">
        {glyph && <Glyph name={glyph} size="sm" className="text-ac-accent" />}
        {label}
      </dt>
      <dd className="mt-2 text-body-sm leading-[1.7] text-ac-ink-70">{children}</dd>
    </div>
  )
}

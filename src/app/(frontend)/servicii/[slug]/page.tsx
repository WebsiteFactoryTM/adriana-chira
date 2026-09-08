import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { PageCta } from '@/components/sections/PageCta'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { Arrow, Button } from '@/components/ui/Button'
import { CheckoutButton } from '@/components/ui/CheckoutButton'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FaqList } from '@/components/ui/FaqList'
import { PackageBody, packageSectionAnchor } from '@/components/ui/PackageBody'
import { PackageCard } from '@/components/ui/PackageCard'
import { RichText } from '@/components/ui/RichText'
import { Rule, Section, Shell, StickyColumn } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import type { PackageCta, PackageDetail } from '@/content/types'
import { getPackageBySlug, getPackages, getSiteSettings } from '@/lib/content'
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  professionalServiceSchema,
  serviceSchema,
} from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

type Params = { params: Promise<{ slug: string }> }

const FORMAT_LABEL: Record<PackageDetail['format'], string> = {
  online: 'Online',
  'fata-in-fata': 'Față în față, în Timișoara',
  hibrid: 'Online sau față în față, în Timișoara',
}

/**
 * CTA-urile de rezervă.
 *
 * Fiecare dintre cele trei programe își aduce propriile texte din
 * `src/content/packages.ts` — „Aplică pentru programul CLAR™" convertește
 * altfel decât „Cumpără". Lista de mai jos intră doar pentru un pachet creat
 * direct în admin, care n-are încă text redactat: mai bine un buton corect și
 * generic decât unul gol.
 */
const CTA_FALLBACK: PackageCta = {
  buy: 'Rezervă acest program',
  ask: 'Scrie-mi înainte de plată',
  finalEyebrow: 'Primul pas',
  finalHeading: 'Nu trebuie să fii sigur ca să începem.',
  finalBody:
    'Prima discuție este despre situația ta, nu despre programe. Dacă nu este potrivit să lucrăm împreună, îți spun.',
  finalLabel: 'Programează o discuție',
}

/**
 * Rutele se prerandează din pachetele vizibile.
 *
 * De când `getPackages` cade pe textul aprobat din `src/content/packages.ts`,
 * lista nu mai e niciodată goală: cele trei programe au rute și fără bază de
 * date, deci build-ul nu mai depinde de Postgres ca să le producă. Un slug
 * care nu e nici în CMS, nici în textul aprobat dă în continuare 404, corect.
 */
export async function generateStaticParams() {
  const packages = await getPackages()
  return packages.map((pkg) => ({ slug: pkg.slug }))
}

export const revalidate = 3600

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const pkg = await getPackageBySlug(slug)
  if (!pkg) return {}

  const name = pkg.name ?? 'Pachet de consultanță'

  return pageMetadata({
    title: name,
    description:
      pkg.tagline ??
      `${name} — pachet de consultanță în performanță umană. Ce include, cât durează și pentru cine este potrivit.`,
    path: pkg.href,
    seo: pkg.seo,
  })
}

/**
 * Pagina unui program individual.
 *
 * ## Ordinea e gândită pentru telefon, nu pentru desktop
 *
 * Peste 1000px pagina are două coloane, iar caseta de preț stă lipită de titlu,
 * în dreapta. Sub 1000px grila cade pe o coloană — iar dacă am fi lăsat ordinea
 * din DOM așa cum arată desktopul, prețul și butonul ar fi ajuns DUPĂ cele nouă
 * secțiuni de text, adică la câteva mii de pixeli de primul ecran. De aceea
 * caseta e prima în DOM și trece în dreapta abia pe desktop, prin `order`.
 *
 * ## Trei locuri în care se poate cumpăra, nu unul
 *
 * Caseta de sus (decizia luată repede), banda de investiție (decizia luată după
 * citit) și blocul final (decizia luată la capătul paginii). Toate trei duc în
 * același loc și afișează același preț, citit pe server. Documentele clientei
 * cer explicit CTA în cele trei poziții, iar pe o pagină de 9–10 secțiuni un
 * singur buton, sus, se pierde.
 *
 * ## Cuprinsul nu e decor
 *
 * Programele au între opt și zece secțiuni. Cuprinsul le face scanabile pe
 * telefon și dă motoarelor de căutare ancorele pe care le folosesc pentru
 * fragmentele de tip „sari la secțiune". Ancorele se calculează cu aceeași
 * funcție care le pune pe titluri, deci nu pot devia.
 */
export default async function PachetPage({ params }: Params) {
  const { slug } = await params
  const [pkg, settings] = await Promise.all([getPackageBySlug(slug), getSiteSettings()])

  if (!pkg) notFound()

  const all = await getPackages()
  const related = all.filter((item) => item.slug !== pkg.slug).slice(0, 2)
  const name = pkg.name ?? 'Pachet de consultanță'
  const cta = pkg.cta ?? CTA_FALLBACK
  const askHref = `/contact?pachet=${pkg.slug}`

  // Cuprinsul are sens de la patru secțiuni în sus — sub atât, lista ar fi mai
  // lungă decât drumul pe care îl scurtează. Același prag ca la articole.
  const sections = pkg.longDescription ? [] : (pkg.body ?? [])
  const showToc = sections.length >= 4

  const trail: Crumb[] = [
    { label: 'Acasă', href: '/' },
    { label: 'Servicii', href: '/servicii' },
    { label: name, href: pkg.href },
  ]

  return (
    <>
      <Breadcrumb trail={trail} />

      <main id="continut">
        {/* ---------------------------------------------------------------- */}
        {/* Antetul: linia cu expresia căutată, numele programului, promisiunea */}

        <Section padding="none" className="pt-[clamp(28px,3.5vw,48px)]">
          <Shell>
            <Eyebrow
              content={{ text: pkg.kicker ?? `Program ${pkg.numeral}`, ornament: 'line' }}
              className="max-w-[52ch]"
            />

            <h1 className="mt-[clamp(24px,3.2vw,40px)] max-w-[18ch] font-display text-h1 font-light">
              {name}
            </h1>

            {pkg.tagline && (
              <p className="mt-[clamp(24px,3vw,36px)] max-w-[44ch] font-display text-lead font-light text-ac-ink-70">
                {pkg.tagline}
              </p>
            )}

            {/*
              Faptele, într-un singur rând care se rupe singur pe telefon.
              Sunt cifrele din documentul clientei — „3 ore · 20 de atribute ·
              6 dimensiuni" — și fac exact ce trebuie să facă primul ecran al
              unei pagini de vânzare: să spună ce cumperi, înainte de preț.
            */}
            {pkg.highlights && pkg.highlights.length > 0 && (
              <ul className="mt-[clamp(28px,3.4vw,44px)] flex flex-wrap gap-x-8 gap-y-3 border-t border-ac-line pt-7 font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-50">
                {pkg.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </Shell>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Corpul paginii și caseta de achiziție                             */}

        <Section
          padding="none"
          className="pt-[clamp(40px,5vw,72px)] pb-[clamp(48px,7vw,88px)]"
        >
          <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-col-gap">
            {/*
              Caseta de achiziție. Prima în DOM, deci prima pe telefon; pe
              desktop trece în coloana din dreapta prin `order`. Prețul vine
              din `packages.price`, citit pe server — niciodată din client
              (regula 7 din STATUS §2).
            */}
            <StickyColumn className="min-[1000px]:order-2">
              <aside
                aria-labelledby="achizitie-titlu"
                className="rounded-card border border-ac-line p-[clamp(28px,3vw,40px)]"
              >
                <h2 id="achizitie-titlu" className="ac-sr-only">
                  Detalii și achiziție
                </h2>

                <p className="font-display text-price font-light text-ac-ink">
                  {pkg.price === null ? (
                    <span data-placeholder>[ 000 ] {pkg.currency}</span>
                  ) : (
                    <>
                      {pkg.price} {pkg.currency}
                    </>
                  )}
                </p>

                <Rule className="my-7" />

                <dl className="grid gap-5">
                  <Fact label="Durată">
                    {pkg.duration ?? <span data-placeholder>[ x sesiuni · y săptămâni ]</span>}
                  </Fact>
                  <Fact label="Format">{FORMAT_LABEL[pkg.format]}</Fact>
                  <Fact label="Pentru cine">
                    {pkg.forWho ?? <span data-placeholder>[ profilul clientului potrivit ]</span>}
                  </Fact>
                </dl>

                {/*
                  Plata propriu-zisă. `CheckoutButton` este un `<form>`
                  obișnuit către `/api/stripe/checkout`, deci funcționează și
                  fără JavaScript și nu adaugă o a cincea componentă de client.
                  Prețul NU pleacă din pagină: ruta îl citește pe server, din
                  document (regula 7 din STATUS §2).

                  Butonul apare doar dacă pachetul are preț. Un buton de plată
                  pe un pachet fără preț ar duce în gol.
                */}
                {pkg.price === null ? (
                  <Button href={askHref} variant="primary" size="lg" className="mt-9 w-full">
                    Întreabă despre acest program
                    <Arrow />
                  </Button>
                ) : (
                  <CheckoutButton
                    kind="pachet"
                    slug={pkg.slug}
                    label={cta.buy}
                    formClassName="mt-9"
                  />
                )}

                <p className="mt-5 text-body-sm leading-[1.7] text-ac-ink-50">
                  Plata se face securizat, prin Stripe. Preferi factură pe firmă, contract sau
                  plata în tranșe?{' '}
                  <TextLink href={askHref} className="text-body-sm text-ac-ink-70">
                    {cta.ask}
                  </TextLink>
                  . {settings.responseTime}.
                </p>
              </aside>
            </StickyColumn>

            <div className="min-[1000px]:order-1">
              {showToc && (
                <nav
                  aria-labelledby="cuprins-titlu"
                  className="mb-[clamp(40px,5vw,64px)] border-y border-ac-line py-7"
                >
                  <p
                    id="cuprins-titlu"
                    className="font-medium text-[11px] tracking-[0.2em] uppercase text-ac-accent-ink"
                  >
                    Ce găsești pe pagină
                  </p>
                  <ol className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-x-8">
                    {sections.map((section) => (
                      <li key={section.heading} className="text-body-sm text-ac-ink-70">
                        <TextLink
                          href={`#${packageSectionAnchor(section.heading)}`}
                          className="text-body-sm"
                        >
                          {section.heading}
                        </TextLink>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {/*
                Rich text-ul din admin are întâietate. Cât timp nu a fost
                scris — azi, cazul normal — se randează textul aprobat din
                `src/content/packages.ts`. Placeholderul rămâne doar pentru un
                pachet nou, creat în admin și încă necompletat.
              */}
              {pkg.longDescription ? (
                <RichText content={pkg.longDescription} />
              ) : sections.length > 0 ? (
                <PackageBody sections={sections} />
              ) : (
                <p className="max-w-[62ch] text-body-lg text-ac-ink-70">
                  <span data-placeholder>[ Descrierea completă a pachetului ]</span>
                </p>
              )}
            </div>
          </Shell>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Investiția: al doilea punct de decizie, după ce omul a citit      */}

        {pkg.price !== null && (
          <Section id="investitie" tone="cream" aria-labelledby="investitie-titlu">
            <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-col-gap">
              <StickyColumn>
                <Eyebrow content={{ text: 'Investiție', ornament: 'line' }} />

                <h2
                  id="investitie-titlu"
                  className="mt-8 font-display text-h2-col font-light text-ac-ink"
                >
                  {pkg.price} {pkg.currency}
                </h2>

                {pkg.duration && (
                  <p className="mt-5 font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-50">
                    {pkg.duration}
                  </p>
                )}

                <CheckoutButton
                  kind="pachet"
                  slug={pkg.slug}
                  label={cta.buy}
                  formClassName="mt-9 max-w-[420px]"
                />

                <p className="mt-5 max-w-[46ch] text-body-sm leading-[1.7] text-ac-ink-50">
                  <TextLink href={askHref} className="text-body-sm text-ac-ink-70">
                    {cta.ask}
                  </TextLink>{' '}
                  dacă vrei factură pe firmă, contract, plata în tranșe sau pur și simplu ai o
                  întrebare înainte. {settings.responseTime}.
                </p>
              </StickyColumn>

              <div>
                <p className="font-medium text-[11px] tracking-[0.2em] uppercase text-ac-accent-ink">
                  Ce include
                </p>

                {/*
                  Lista integrală, spre deosebire de card, unde `CARD_INCLUDES`
                  o taie la trei rânduri ca să nu rupă grila de pe homepage
                  (STATUS §9.21). Aici nu există grilă de protejat, deci se
                  vede tot ce cumperi.
                */}
                <ul className="mt-5 grid gap-3">
                  {pkg.includes.map((item, index) => (
                    <li
                      key={index}
                      className="max-w-[54ch] border-l border-ac-line pl-5 text-body text-ac-ink-70"
                    >
                      {item ?? <span data-placeholder>[ element ]</span>}
                    </li>
                  ))}
                </ul>

                {pkg.investmentNotes && pkg.investmentNotes.length > 0 && (
                  <div className="mt-9 grid gap-5 border-t border-ac-line pt-8">
                    {pkg.investmentNotes.map((note, index) => (
                      <p key={index} className="max-w-[58ch] text-body-sm leading-[1.75] text-ac-ink-70">
                        {note}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </Shell>
          </Section>
        )}

        {/* ---------------------------------------------------------------- */}

        {pkg.faq.length > 0 && (
          <Section id="intrebari" aria-labelledby="faq-pachet-titlu">
            <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-col-gap">
              <StickyColumn>
                <Eyebrow content={{ text: 'Despre acest program', ornament: 'line' }} />
                <h2
                  id="faq-pachet-titlu"
                  className="mt-8 max-w-[20ch] font-display text-h2-col font-light"
                >
                  Întrebări frecvente
                </h2>
              </StickyColumn>

              <FaqList items={pkg.faq} />
            </Shell>
          </Section>
        )}

        {related.length > 0 && (
          <Section padding="tight" aria-labelledby="conexe-titlu">
            <Shell>
              <Eyebrow content={{ text: 'Celelalte programe', ornament: 'line' }} />

              <h2
                id="conexe-titlu"
                className="mt-8 max-w-[24ch] font-display text-h2-col font-light"
              >
                Celelalte feluri de a începe
              </h2>

              <div className="mt-block grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-stretch gap-[clamp(20px,2.4vw,32px)]">
                {related.map((item, index) => (
                  <PackageCard key={item.slug} pkg={item} index={index} />
                ))}
              </div>
            </Shell>
          </Section>
        )}

        <PageCta
          eyebrow={{ text: cta.finalEyebrow, ornament: 'pulse' }}
          heading={cta.finalHeading}
          body={cta.finalBody}
          primary={{ label: cta.finalLabel, href: askHref }}
          secondary={{ label: 'Vezi toate programele', href: '/servicii' }}
          note={settings.responseTime}
        />
      </main>

      <JsonLd
        data={graph([
          serviceSchema(
            {
              name,
              description: pkg.tagline ?? name,
              path: pkg.href,
              price: pkg.price,
              currency: pkg.currency,
              duration: pkg.duration,
            },
            settings,
          ),
          breadcrumbSchema(trail, settings.url),
          // `Service.provider` trimite la `#serviciu`. Îl emitem și aici, ca
          // graful paginii să se rezolve fără să depindă de homepage.
          professionalServiceSchema(settings),
          ...(pkg.faq.length > 0 ? [faqSchema(pkg.faq, settings.url, pkg.href)] : []),
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
      <dd className="mt-2 text-body-sm leading-[1.75] text-ac-ink-70">{children}</dd>
    </div>
  )
}

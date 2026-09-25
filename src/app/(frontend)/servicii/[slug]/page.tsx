import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { PageCta } from '@/components/sections/PageCta'
import { JsonLd } from '@/components/seo/JsonLd'
import { BackToTop } from '@/components/ui/BackToTop'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { Arrow, Button } from '@/components/ui/Button'
import { CheckoutButton } from '@/components/ui/CheckoutButton'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FaqList } from '@/components/ui/FaqList'
import { Glyph, type GlyphName } from '@/components/ui/Glyph'
import { PackageBody, packageOutline } from '@/components/ui/PackageBody'
import { PackageCard } from '@/components/ui/PackageCard'
import { ProgramMotif } from '@/components/ui/ProgramMotif'
import { Reveal } from '@/components/ui/Reveal'
import { RichText } from '@/components/ui/RichText'
import { Section, Shell } from '@/components/ui/Section'
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
import { quoteHref } from '@/lib/routes'
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
 * ## Cum e construită, de sus în jos
 *
 * 1. **Antet** — linia cu expresia căutată, numele programului, promisiunea,
 *    faptele scanabile, prețul și butonul. În dreapta, un desen care ESTE
 *    structura programului (vezi `ProgramMotif`), nu o ilustrație lipită peste
 *    el. Antetul răspunde la „ce e asta, pentru cine, cât costă" fără nicio
 *    derulare.
 * 2. **Harta paginii** — chipsuri numerotate, una pe bandă. Pe un program cu
 *    zece secțiuni, ele fac diferența dintre „am de citit mult" și „văd unde e
 *    ce mă interesează". Numerele sunt aceleași cu cele de pe benzi, pentru că
 *    vin din aceeași funcție (`packageOutline`).
 * 3. **Benzile de conținut** — fiecare secțiune, cu fundalul și forma ei. Vezi
 *    `PackageBody`.
 * 4. **Investiția** — al doilea punct de decizie, după ce omul a citit.
 * 5. **Întrebări frecvente**, **celelalte programe**, **blocul final**.
 *
 * ## Trei locuri în care se poate cumpăra, nu unul
 *
 * Antetul (decizia luată repede), banda de investiție (decizia luată după
 * citit) și blocul final (decizia luată la capătul paginii). Toate trei duc în
 * același loc și afișează același preț, citit pe server. Documentele clientei
 * cer explicit CTA în cele trei poziții, iar pe o pagină de zece benzi un
 * singur buton, sus, se pierde.
 *
 * ## De ce nu mai există coloana sticky de achiziție
 *
 * Avea sens cât timp corpul paginii era o singură coloană de text. De când
 * fiecare secțiune e o bandă lată, cu fundal propriu, o coloană fixată lângă
 * ele ar tăia benzile în două pe toată înălțimea paginii. Rolul ei — prețul la
 * îndemână — l-a luat antetul, care îl arată înainte de orice derulare, la fel
 * pe telefon și pe desktop.
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
  // Programele la cerere (bifa „Preț la cerere" din admin) nu au preț pe
  // pagină și nu au buton de plată: în toate cele trei puncte de decizie
  // butonul devine „Solicită ofertă" și duce direct la formular.
  const isQuote = pkg.pricing === 'quote'
  const offerHref = quoteHref(pkg.href)

  // Rich text-ul din admin are întâietate. Cât timp nu a fost scris — azi,
  // cazul normal — se randează secțiunile aprobate, ca benzi.
  const sections = pkg.longDescription ? [] : (pkg.body ?? [])
  const outline = packageOutline(sections)

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
        {/* Antetul                                                          */}

        <BackToTop />

        {/*
          Antetul are șapte straturi — fir, linia cu expresia căutată, nume,
          promisiune, fapte, preț + buton, desen — și toate rămân: fiecare
          răspunde la o întrebare pe care omul o are înainte să deruleze.
          Ce se schimbă pe ecranele mici e DENSITATEA, nu conținutul:

          - telefon: firul Ariadnei se reduce la „← Servicii" (`Breadcrumb`),
            linia de deasupra pierde ornamentul și se strânge, numele are o
            scală proprie (numele programelor au trei cuvinte lungi), faptele
            stau pe o coloană strânsă, butonul ia toată lățimea, iar desenul
            dispare: la 340px etichetele lui (`L1`–`L6`, `01`–`06`) ar avea
            ~7px, deci ar rămâne un gol de 300px între buton și conținut,
            iar ce spune el spun deja faptele de deasupra și benzile;
          - laptop de 14" (`short:`): spațiile verticale se strâng și desenul
            se plafonează la înălțimea ecranului, ca prețul și butonul să fie
            în primul ecran.
        */}
        <Section
          padding="none"
          aura="servicii"
          className="pt-[clamp(20px,3vw,44px)] pb-[clamp(44px,6vw,84px)] short:pt-4 short:pb-[clamp(40px,7vh,64px)]"
        >
          <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-x-col-gap gap-y-[clamp(36px,4.5vw,60px)]">
            <div>
              <Eyebrow
                content={{ text: pkg.kicker ?? `Program ${pkg.numeral}`, ornament: 'line' }}
                className="max-w-[46ch] leading-[1.55] max-sm:text-[11px] max-sm:tracking-[0.18em] max-sm:[&>span:first-child]:hidden"
              />

              <h1 className="mt-[clamp(16px,2.6vw,34px)] max-w-[16ch] font-display text-h1 font-light max-sm:text-[clamp(2.15rem,9.6vw,2.6rem)] short:mt-[clamp(14px,2.6vh,24px)]">
                {name}
              </h1>

              {pkg.tagline && (
                <p className="mt-[clamp(16px,2.4vw,30px)] max-w-[42ch] font-display text-lead font-light text-ac-ink-70 short:mt-[clamp(12px,2.2vh,20px)]">
                  {pkg.tagline}
                </p>
              )}

              {/*
                Faptele, ca marcaje scurte. Sunt cifrele din documentul
                clientei — „3 ore · 20 de atribute · 6 dimensiuni" — și fac
                exact ce trebuie să facă primul ecran al unei pagini de
                vânzare: să spună ce cumperi, înainte de preț.
              */}
              {pkg.highlights && pkg.highlights.length > 0 && (
                <ul className="mt-[clamp(20px,3vw,36px)] grid gap-x-[clamp(16px,3vw,32px)] gap-y-2 sm:grid-cols-2 sm:gap-y-[10px] short:mt-[clamp(16px,2.6vh,24px)] short:gap-y-2">
                  {pkg.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-[10px] text-body-sm leading-[1.5] text-ac-ink-70 max-sm:text-[14px]"
                    >
                      <Glyph name="check" size="sm" className="mt-[2px] shrink-0 text-ac-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-[clamp(24px,3.4vw,44px)] flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-ac-line pt-[clamp(20px,3vw,32px)] short:mt-[clamp(18px,3vh,28px)] short:pt-5">
                {isQuote ? (
                  <p className="font-medium text-label uppercase text-ac-accent-ink max-sm:w-full">
                    Ofertă personalizată
                  </p>
                ) : (
                  <p className="font-display text-price font-light text-ac-ink">
                    {pkg.price === null ? (
                      <span data-placeholder>[ 000 ] {pkg.currency}</span>
                    ) : (
                      <>
                        {pkg.price} {pkg.currency}
                      </>
                    )}
                  </p>
                )}

                {/*
                  `CheckoutButton` este un `<form>` obișnuit către
                  `/api/stripe/checkout`, deci funcționează și fără JavaScript
                  și nu adaugă o a cincea componentă de client. Prețul NU pleacă
                  din pagină: ruta îl citește pe server (regula 7, STATUS §2).
                */}
                {isQuote ? (
                  <Button href={offerHref} variant="primary" size="lg" className="max-sm:w-full">
                    Solicită ofertă
                    <Arrow />
                  </Button>
                ) : pkg.price === null ? (
                  <Button href={askHref} variant="primary" size="lg" className="max-sm:w-full">
                    Întreabă despre acest program
                    <Arrow />
                  </Button>
                ) : (
                  <CheckoutButton
                    kind="pachet"
                    slug={pkg.slug}
                    label={cta.buy}
                    size="lg"
                    formClassName="max-sm:w-full"
                  />
                )}
              </div>

              <p className="mt-4 max-w-[48ch] text-body-sm leading-[1.7] text-ac-ink-50">
                {isQuote ? (
                  <>
                    {FORMAT_LABEL[pkg.format]}. Oferta ține cont de obiectivul tău, de format și de
                    cine plătește — tu sau compania. {settings.responseTime}.
                  </>
                ) : (
                  <>
                    {FORMAT_LABEL[pkg.format]}. Preferi factură pe firmă, contract sau plata în
                    tranșe?{' '}
                    <TextLink href={askHref} className="text-body-sm text-ac-ink-70">
                      {cta.ask}
                    </TextLink>
                    .
                  </>
                )}
              </p>
            </div>

            {/*
              Desenul programului. Nu e ilustrație: e chiar structura lui —
              cele șase dimensiuni, cele patru etape, cele șase luni. Vezi
              `ProgramMotif` pentru ce reprezintă fiecare linie.
            */}
            <Reveal className="w-full max-w-[380px] justify-self-center max-sm:hidden min-[1000px]:max-w-[540px] short:max-w-[min(540px,calc((100svh-190px)*1.18))]">
              <ProgramMotif slug={pkg.slug} className="w-full" />
            </Reveal>
          </Shell>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Harta paginii                                                    */}

        {outline.length >= 4 && (
          <Section
            tone="cream"
            padding="none"
            className="py-[clamp(28px,3.2vw,44px)]"
            aria-labelledby="harta-titlu"
          >
            <Shell>
              <h2 id="harta-titlu" className="font-medium text-label uppercase text-ac-accent-ink">
                Ce găsești pe pagină
              </h2>

              {/*
                Pe telefon, zece chipsuri pe rânduri separate făceau un bloc
                de peste 700px între antet și prima bandă — exact „peretele"
                pe care harta trebuia să-l evite. Sub 640px devin un singur
                rând derulat orizontal, lipit de marginile ecranului, ca să
                se vadă că mai continuă.
              */}
              <ol className="mt-5 flex flex-wrap gap-[10px] max-sm:-mx-gutter max-sm:snap-x max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:px-gutter max-sm:pb-1 max-sm:[scrollbar-width:none]">
                {outline.map((entry) => (
                  <li key={entry.anchor} className="max-sm:shrink-0 max-sm:snap-start">
                    <a
                      href={`#${entry.anchor}`}
                      className="flex min-h-11 items-center gap-3 rounded-pill border border-ac-line bg-ac-paper px-[18px] py-2 text-body-sm leading-[normal] text-ac-ink transition-colors duration-[220ms] hover:border-ac-ink max-sm:whitespace-nowrap"
                    >
                      <span
                        aria-hidden="true"
                        className="font-medium text-label text-ac-accent-ink"
                      >
                        {entry.numeral}
                      </span>
                      {entry.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </Shell>
          </Section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Benzile de conținut                                              */}

        {pkg.longDescription ? (
          <Section padding="body">
            <Shell>
              <RichText content={pkg.longDescription} />
            </Shell>
          </Section>
        ) : sections.length > 0 ? (
          <PackageBody sections={sections} />
        ) : (
          <Section padding="body">
            <Shell>
              <p className="max-w-[62ch] text-body-lg text-ac-ink-70">
                <span data-placeholder>[ Descrierea completă a pachetului ]</span>
              </p>
            </Shell>
          </Section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Investiția                                                       */}

        {(pkg.price !== null || isQuote) && (
          <Section
            id="investitie"
            padding="none"
            className="scroll-mt-[132px] py-[clamp(56px,8vw,110px)]"
            aria-labelledby="investitie-titlu"
          >
            <Shell>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-x-col-gap gap-y-[clamp(32px,4vw,52px)] rounded-card border border-ac-accent bg-ac-cream-50 p-[clamp(28px,4vw,64px)]">
                <div>
                  <Eyebrow content={{ text: 'Investiție', ornament: 'line' }} />

                  <h2
                    id="investitie-titlu"
                    className="mt-7 font-display text-h2-col font-light text-ac-ink"
                  >
                    {isQuote ? 'Ofertă personalizată' : `${pkg.price} ${pkg.currency}`}
                  </h2>

                  {/*
                    Cele trei fapte de verificat înainte de plată. Erau, până la
                    redesign, în coloana sticky de achiziție; ea a dispărut
                    odată cu trecerea corpului paginii pe benzi late, iar aici
                    e locul lor firesc — omul le recitește exact în clipa în
                    care decide, nu în timp ce citește.
                  */}
                  <dl className="mt-7 grid gap-4">
                    {pkg.duration && (
                      <Fact glyph="clock" label="Durată">
                        {pkg.duration}
                      </Fact>
                    )}
                    <Fact glyph="screen" label="Format">
                      {FORMAT_LABEL[pkg.format]}
                    </Fact>
                    {pkg.forWho && (
                      <Fact glyph="grid" label="Pentru cine">
                        {pkg.forWho}
                      </Fact>
                    )}
                  </dl>

                  {isQuote ? (
                    <>
                      <Button
                        href={offerHref}
                        variant="primary"
                        size="lg"
                        className="mt-9 w-full max-w-[420px]"
                      >
                        Solicită ofertă
                        <Arrow />
                      </Button>

                      <p className="mt-5 max-w-[44ch] text-body-sm leading-[1.7] text-ac-ink-70">
                        Îmi scrii câteva rânduri despre situația ta și îți trimit personal oferta,
                        cu formatul, calendarul și modul de plată potrivite — inclusiv contract și
                        factură pe firmă. {settings.responseTime}.
                      </p>
                    </>
                  ) : (
                    <>
                      <CheckoutButton
                        kind="pachet"
                        slug={pkg.slug}
                        label={cta.buy}
                        formClassName="mt-9 max-w-[420px]"
                      />

                      <p className="mt-5 max-w-[44ch] text-body-sm leading-[1.7] text-ac-ink-70">
                        Plata se face securizat, prin Stripe.{' '}
                        <TextLink href={askHref} className="text-body-sm text-ac-ink-70">
                          {cta.ask}
                        </TextLink>{' '}
                        dacă vrei factură pe firmă, contract, plata în tranșe sau pur și simplu ai o
                        întrebare înainte. {settings.responseTime}.
                      </p>
                    </>
                  )}
                </div>

                <div>
                  <p className="flex items-center gap-3 font-medium text-label uppercase text-ac-accent-ink">
                    <Glyph name="layers" size="sm" className="text-ac-accent" />
                    Ce include
                  </p>

                  {/*
                    Lista integrală, spre deosebire de card, unde
                    `CARD_INCLUDES` o taie la trei rânduri ca să nu rupă grila
                    de pe homepage (STATUS §9.23). Aici nu există grilă de
                    protejat, deci se vede tot ce cumperi.
                  */}
                  <ul className="mt-5 grid">
                    {pkg.includes.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-4 border-t border-ac-line py-[14px] text-body text-ac-ink-70 last:border-b"
                      >
                        <Glyph name="check" size="sm" className="mt-[7px] text-ac-accent" />
                        <span className="max-w-[46ch]">
                          {item ?? <span data-placeholder>[ element ]</span>}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {pkg.investmentNotes && pkg.investmentNotes.length > 0 && (
                    <div className="mt-8 grid gap-4">
                      {pkg.investmentNotes.map((note, index) => (
                        <p
                          key={index}
                          className="max-w-[54ch] text-body-sm leading-[1.75] text-ac-ink-70"
                        >
                          {note}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Shell>
          </Section>
        )}

        {/* ---------------------------------------------------------------- */}

        {pkg.faq.length > 0 && (
          <Section
            id="intrebari"
            tone="cream"
            padding="tight"
            aria-labelledby="faq-pachet-titlu"
            className="scroll-mt-[132px]"
          >
            <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-x-col-gap gap-y-[clamp(28px,3.5vw,44px)]">
              <div>
                <Eyebrow content={{ text: 'Despre acest program', ornament: 'line' }} />
                <h2
                  id="faq-pachet-titlu"
                  className="mt-8 max-w-[20ch] font-display text-h2-col font-light"
                >
                  Întrebări frecvente
                </h2>
              </div>

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
          primary={{ label: cta.finalLabel, href: isQuote ? offerHref : askHref }}
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

/** Un fapt de verificat înainte de plată: eticheta versală, semnul, valoarea. */
function Fact({
  glyph,
  label,
  children,
}: {
  glyph: GlyphName
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <dt className="flex items-center gap-3 font-medium text-[11px] tracking-[0.2em] uppercase text-ac-accent-ink">
        <Glyph name={glyph} size="sm" className="text-ac-accent" />
        {label}
      </dt>
      <dd className="mt-2 max-w-[44ch] text-body-sm leading-[1.7] text-ac-ink-70">{children}</dd>
    </div>
  )
}

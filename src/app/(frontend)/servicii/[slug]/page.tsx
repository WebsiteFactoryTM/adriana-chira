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
import { PackageBody } from '@/components/ui/PackageBody'
import { PackageCard } from '@/components/ui/PackageCard'
import { RichText } from '@/components/ui/RichText'
import { Rule, Section, Shell, StickyColumn } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import type { PackageDetail } from '@/content/types'
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
  hibrid: 'Online sau față în față',
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

export default async function PachetPage({ params }: Params) {
  const { slug } = await params
  const [pkg, settings] = await Promise.all([getPackageBySlug(slug), getSiteSettings()])

  if (!pkg) notFound()

  const all = await getPackages()
  const related = all.filter((item) => item.slug !== pkg.slug).slice(0, 2)
  const name = pkg.name ?? 'Pachet de consultanță'

  const trail: Crumb[] = [
    { label: 'Acasă', href: '/' },
    { label: 'Servicii', href: '/servicii' },
    { label: name, href: pkg.href },
  ]

  return (
    <>
      <Breadcrumb trail={trail} />

      <main id="continut">
        <Section padding="none" className="pt-[clamp(28px,3.5vw,48px)] pb-[clamp(48px,7vw,88px)]">
          <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-col-gap">
            <div>
              <Eyebrow content={{ text: `Pachet ${pkg.numeral}`, ornament: 'line' }} />

              <h1 className="mt-[clamp(24px,3.2vw,40px)] max-w-[18ch] font-display text-h1 font-light">
                {name}
              </h1>

              {pkg.tagline && (
                <p className="mt-[clamp(24px,3vw,36px)] max-w-[44ch] font-display text-lead font-light text-ac-ink-70">
                  {pkg.tagline}
                </p>
              )}

              {/*
                Rich text-ul din admin are întâietate. Cât timp nu a fost
                scris — azi, cazul normal — se randează textul aprobat din
                `src/content/packages.ts`. Placeholderul rămâne doar pentru un
                pachet nou, creat în admin și încă necompletat.
              */}
              {pkg.longDescription ? (
                <RichText content={pkg.longDescription} className="mt-[clamp(40px,5vw,64px)]" />
              ) : pkg.body && pkg.body.length > 0 ? (
                <div className="mt-[clamp(40px,5vw,64px)]">
                  <PackageBody sections={pkg.body} />
                </div>
              ) : (
                <p className="mt-[clamp(40px,5vw,64px)] max-w-[62ch] text-body-lg text-ac-ink-70">
                  <span data-placeholder>[ Descrierea completă a pachetului ]</span>
                </p>
              )}
            </div>

            {/*
              Coloana de achiziție. Prețul vine din `packages.price`, citit pe
              server — niciodată din client (regula 7 din STATUS §2).
            */}
            <StickyColumn>
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

                <Rule className="my-7" />

                <div>
                  <p className="font-medium text-[11px] tracking-[0.2em] uppercase text-ac-accent-ink">
                    Ce include
                  </p>
                  <ul className="mt-3 grid gap-2">
                    {pkg.includes.map((item, index) => (
                      <li key={index} className="text-body-sm leading-[1.7] text-ac-ink-70">
                        {item ?? <span data-placeholder>[ element ]</span>}
                      </li>
                    ))}
                  </ul>
                </div>

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
                  <Button
                    href={`/contact?pachet=${pkg.slug}`}
                    variant="primary"
                    size="lg"
                    className="mt-9 w-full"
                  >
                    Întreabă despre acest pachet
                    <Arrow />
                  </Button>
                ) : (
                  <CheckoutButton
                    kind="pachet"
                    slug={pkg.slug}
                    label="Cumpără acest program"
                    formClassName="mt-9"
                  />
                )}

                <p className="mt-5 text-body-sm leading-[1.7] text-ac-ink-50">
                  Plata se face securizat, prin Stripe. Preferi factură pe firmă, contract sau
                  plata în tranșe?{' '}
                  <TextLink
                    href={`/contact?pachet=${pkg.slug}`}
                    className="text-body-sm text-ac-ink-70"
                  >
                    Scrie-mi înainte de plată
                  </TextLink>
                  . {settings.responseTime}.
                </p>
              </aside>
            </StickyColumn>
          </Shell>
        </Section>

        {pkg.faq.length > 0 && (
          <Section id="faq" tone="cream" aria-labelledby="faq-pachet-titlu">
            <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-col-gap">
              <StickyColumn>
                <Eyebrow content={{ text: 'Despre acest pachet', ornament: 'line' }} />
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
          <Section aria-labelledby="conexe-titlu">
            <Shell>
              <h2 id="conexe-titlu" className="font-display text-h2-col font-light">
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
          eyebrow={{ text: 'Primul pas', ornament: 'pulse' }}
          heading="Nu trebuie să fii sigur ca să începem."
          body="Prima discuție este despre situația ta, nu despre pachete. Dacă nu este potrivit să lucrăm împreună, îți spun."
          primary={{ label: 'Programează o discuție', href: '/contact' }}
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

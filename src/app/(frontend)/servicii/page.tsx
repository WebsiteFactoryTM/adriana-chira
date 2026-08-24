import type { Metadata } from 'next'

import { PageHeader } from '@/components/layout/PageHeader'
import { PageCta } from '@/components/sections/PageCta'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FaqList } from '@/components/ui/FaqList'
import { PackageCard } from '@/components/ui/PackageCard'
import { Section, Shell, StickyColumn } from '@/components/ui/Section'
import { homeContent } from '@/content/home'
import { serviciiPage } from '@/content/pages'
import type { PackagePreview } from '@/content/types'
import { getFaqs, getPackages, getSiteSettings } from '@/lib/content'
import { breadcrumbSchema, collectionPageSchema, faqSchema, graph } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

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
  const [packages, faqs, settings] = await Promise.all([
    getPackages(),
    getFaqs('servicii'),
    getSiteSettings(),
  ])

  const cards: PackagePreview[] =
    packages.length > 0 ? packages : homeContent.servicii.packages

  return (
    <>
      <Breadcrumb trail={TRAIL} />

      <main id="continut">
        <PageHeader
          eyebrow={serviciiPage.eyebrow}
          title={serviciiPage.title}
          lead={serviciiPage.lead}
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
              // Doar pachetele reale intră în ItemList. Placeholderele din
              // design nu sunt oferte și n-au ce căuta în marcaj.
              items: packages.map((pkg) => ({
                name: pkg.name ?? 'Pachet',
                path: pkg.href,
              })),
            },
            settings,
          ),
          breadcrumbSchema(TRAIL, settings.url),
          ...(faqs.length > 0 ? [faqSchema(faqs, settings.url, '/servicii')] : []),
        ])}
      />
    </>
  )
}

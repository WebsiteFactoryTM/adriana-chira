import type { Metadata } from 'next'

import { ContactForm } from '@/components/contact/ContactForm'
import { PageHeader } from '@/components/layout/PageHeader'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { Arrow, Button } from '@/components/ui/Button'
import { Rule, Section, Shell } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import { contactPage } from '@/content/pages'
import { getPackageBySlug, getSiteSettings } from '@/lib/content'
import { breadcrumbSchema, contactPageSchema, graph } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

type Props = { searchParams: Promise<{ pachet?: string }> }

const TRAIL: Crumb[] = [
  { label: 'Acasă', href: '/' },
  { label: 'Contact', href: '/contact' },
]

const PRIVACY_HREF = '/politica-de-confidentialitate'

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description:
    'Scrie-mi despre situația ta. Răspund personal, în maximum 24 de ore lucrătoare. Timișoara și online.',
  path: '/contact',
})

/**
 * Pagina de contact.
 *
 * `searchParams` face ruta dinamică — necesar pentru `?pachet=`, prin care
 * pagina unui pachet precompletează mesajul. Nu e o pierdere: pagina n-are ce
 * cache-ui, iar formularul e oricum interactiv.
 */
export default async function ContactPage({ searchParams }: Props) {
  const [{ pachet }, settings] = await Promise.all([searchParams, getSiteSettings()])

  const pkg = pachet ? await getPackageBySlug(pachet) : null
  const initialMessage = pkg?.name ? contactPage.packagePrefill(pkg.name) : ''

  return (
    <>
      <Breadcrumb trail={TRAIL} />

      <main id="continut">
        <PageHeader
          eyebrow={contactPage.eyebrow}
          title={contactPage.title}
          lead={contactPage.lead}
          tight
        />

        <Section padding="bottom-only">
          <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-col-gap">
            <section aria-labelledby="formular-titlu">
              <h2 id="formular-titlu" className="font-display text-h3 font-normal">
                Trimite-mi un mesaj
              </h2>
              <p className="mt-4 mb-9 max-w-[46ch] text-body text-ac-ink-70">
                {contactPage.formIntro}
              </p>

              <ContactForm initialMessage={initialMessage} privacyHref={PRIVACY_HREF} />
            </section>

            <aside aria-labelledby="date-contact-titlu">
              <h2 id="date-contact-titlu" className="font-display text-h3 font-normal">
                Sau direct
              </h2>

              <ul className="mt-7 grid gap-4 text-body">
                <li>
                  {settings.email ? (
                    <TextLink href={`mailto:${settings.email}`}>{settings.email}</TextLink>
                  ) : (
                    <span data-placeholder>[ email ]</span>
                  )}
                </li>
                <li>
                  {settings.phone ? (
                    <TextLink href={`tel:${settings.phone.replace(/\s/g, '')}`}>
                      {settings.phone}
                    </TextLink>
                  ) : (
                    <span data-placeholder>[ telefon ]</span>
                  )}
                </li>
                <li className="text-ac-ink-70">
                  {settings.city}, {settings.country}
                </li>
              </ul>

              <Rule className="my-9" />

              <p className="font-medium text-label uppercase text-ac-accent-ink">Timp de răspuns</p>
              <p className="mt-3 text-body text-ac-ink-70">{settings.responseTime}</p>

              <Rule className="my-9" />

              {/*
                Programarea directă. Widgetul de calendar NU se încarcă în
                pagină: e un link către pagina furnizorului, deschisă la click.
                Adică exact cerința „se încarcă doar la click" (brief §10.2),
                fără script terț și fără al patrulea component de client.
              */}
              <p className="font-medium text-label uppercase text-ac-accent-ink">Programare</p>
              <p className="mt-3 max-w-[40ch] text-body-sm leading-[1.7] text-ac-ink-70">
                {contactPage.bookingIntro}
              </p>

              {settings.bookingUrl ? (
                <Button
                  href={settings.bookingUrl}
                  variant="outline"
                  size="md"
                  className="mt-6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vezi intervalele libere
                  <Arrow />
                </Button>
              ) : (
                <p className="mt-6 text-body-sm text-ac-ink-50">
                  <span data-placeholder>[ link de programare ]</span>
                </p>
              )}

              <Rule className="my-9" />

              <p className="max-w-[40ch] text-body-sm leading-[1.7] text-ac-ink-50">
                {contactPage.privacyNote}{' '}
                <TextLink href={PRIVACY_HREF} className="text-body-sm text-ac-ink-50">
                  Politica de confidențialitate
                </TextLink>
                .
              </p>
            </aside>
          </Shell>
        </Section>
      </main>

      <JsonLd
        data={graph([contactPageSchema(settings, '/contact'), breadcrumbSchema(TRAIL, settings.url)])}
      />
    </>
  )
}

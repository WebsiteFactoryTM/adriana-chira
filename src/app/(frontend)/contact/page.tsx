import type { Metadata } from 'next'

import { ContactForm } from '@/components/contact/ContactForm'
import { PageHeader } from '@/components/layout/PageHeader'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { Arrow, Button } from '@/components/ui/Button'
import { Rule, Section, Shell } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import { contactPage } from '@/content/pages'
import { getPackageBySlug, getSiteSettings, getWorkshopBySlug } from '@/lib/content'
import { breadcrumbSchema, contactPageSchema, graph } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { formatSessionDate } from '@/lib/workshops'

type Props = {
  searchParams: Promise<{ pachet?: string; workshop?: string; motiv?: string; cerere?: string }>
}

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
 * `searchParams` face ruta dinamică — necesar pentru `?pachet=` și
 * `?workshop=`, prin care pagina unui produs precompletează mesajul. Nu e o
 * pierdere: pagina n-are ce cache-ui, iar formularul e oricum interactiv.
 *
 * ## Calea de rezervare fără plată online
 *
 * Pagina asta este și a doua cale de cumpărare, nu doar un formular de
 * întrebări. Ajung aici trei feluri de oameni: cine plătește prin transfer
 * bancar, cine își anunță interesul pentru un workshop neprogramat, și
 * cine a apăsat pe plată, dar Stripe n-a putut porni sesiunea. Fiecare
 * primește alt text precompletat, ca Adriana să nu ghicească despre ce e vorba.
 *
 * `motiv` vine din ruta de plată și NU se afișează ca atare: din el se alege un
 * mesaj scris pentru om. Un cod de eroare într-o pagină publică e o notă
 * pentru dezvoltator lipită pe ușa clientului.
 */
export default async function ContactPage({ searchParams }: Props) {
  const [{ pachet, workshop: workshopSlug, motiv, cerere }, settings] = await Promise.all([
    searchParams,
    getSiteSettings(),
  ])

  const [pkg, workshop] = await Promise.all([
    pachet ? getPackageBySlug(pachet) : null,
    workshopSlug ? getWorkshopBySlug(workshopSlug) : null,
  ])

  // Cererea de ofertă vine de pe programele cu preț la cerere (`quoteHref`).
  // Fără pachet recunoscut, `cerere` nu înseamnă nimic și e ignorat.
  const wantsQuote = cerere === 'oferta' && Boolean(pkg?.name)

  const initialMessage = workshop
    ? workshop.purchasable
      ? contactPage.workshopPrefill(
          workshop.title,
          workshop.sessionDate ? formatSessionDate(workshop.sessionDate) : null,
        )
      : contactPage.waitlistPrefill(workshop.title)
    : pkg?.name
      ? wantsQuote
        ? contactPage.quotePrefill(pkg.name)
        : contactPage.packagePrefill(pkg.name)
      : ''

  // Doar motivele care chiar vin dinspre plată. Orice altă valoare din URL e
  // ignorată: pagina nu are de ce să repete ce i-a scris cineva în adresă.
  const checkoutFailed =
    motiv === 'plata-indisponibila' || motiv === 'fara-pret' || motiv === 'inchis'

  return (
    <>
      <Breadcrumb trail={TRAIL} />

      <main id="continut">
        <PageHeader
          eyebrow={contactPage.eyebrow}
          title={contactPage.title}
          lead={contactPage.lead}
          image={contactPage.image}
          tight
        >
          {/*
            CTA-ul din antet coboară la formular. Pe un laptop de 14" și pe
            telefon, fotografia din antet împinge formularul sub primul ecran;
            fără butonul ăsta, omul care a venit să scrie trebuie să ghicească
            că formularul e mai jos. `<a href="#formular">` simplu: derularea
            lină vine din `scroll-behavior` pe `html`, fără JavaScript.
          */}
          <div className="mt-[clamp(28px,3.4vw,44px)] flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button href="#formular" variant="primary" size="lg">
              {wantsQuote ? contactPage.quoteFormTitle : contactPage.heroCta}
              <span aria-hidden="true">↓</span>
            </Button>
            <p className="max-w-[34ch] text-body-sm leading-[1.6] text-ac-ink-70">
              {contactPage.heroCtaNote}
            </p>
          </div>
        </PageHeader>

        {/*
          Formularul stă pe o bandă crem, într-o cartelă de hârtie cu margine
          în accent: e singurul lucru din pagină care cere o acțiune, deci
          trebuie să se vadă din prima privire, nu să fie încă un bloc de text.
          Pe crem, textul secundar e `ink-70` — `ink-50` ar pica AA (4.24:1).
        */}
        <Section tone="cream" padding="none" className="py-[clamp(48px,7vw,104px)]">
          <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-x-col-gap gap-y-[clamp(40px,5vw,64px)] min-[1000px]:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            {/* Ținta CTA-ului din antet și a lui „Solicită ofertă": cartela,
                nu banda, ca derularea să se oprească pe titlul formularului
                (antetul sticky e scăzut de `scroll-padding-top` pe `html`). */}
            <section
              id="formular"
              aria-labelledby="formular-titlu"
              className="rounded-card border border-ac-accent bg-ac-paper p-[clamp(24px,3.6vw,52px)]"
            >
              <h2 id="formular-titlu" className="font-display text-h3-lg font-light">
                {wantsQuote ? contactPage.quoteFormTitle : 'Trimite-mi un mesaj'}
              </h2>
              <p className="mt-4 max-w-[52ch] text-body text-ac-ink-70">
                {contactPage.formIntro}
              </p>

              {checkoutFailed && (
                <p
                  role="status"
                  className="mt-7 max-w-[46ch] border-l-2 border-ac-accent bg-ac-cream-50 p-5 text-body-sm leading-[1.75] text-ac-ink-70"
                >
                  {motiv === 'inchis'
                    ? 'Ediția aceasta nu mai este deschisă la înscriere. Scrie-mi aici și te anunț imediat ce se programează următoarea.'
                    : contactPage.checkoutFallbackNote}
                </p>
              )}

              <div className="mt-9">
                <ContactForm initialMessage={initialMessage} privacyHref={PRIVACY_HREF} />
              </div>
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
                <p className="mt-6 text-body-sm text-ac-ink-70">
                  <span data-placeholder>[ link de programare ]</span>
                </p>
              )}

              <Rule className="my-9" />

              <p className="max-w-[40ch] text-body-sm leading-[1.7] text-ac-ink-70">
                {contactPage.privacyNote}{' '}
                <TextLink href={PRIVACY_HREF} className="text-body-sm text-ac-ink-70">
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

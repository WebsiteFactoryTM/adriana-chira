import { PageHeader } from '@/components/layout/PageHeader'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { Section, Shell, StickyColumn } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import { LEGAL_DRAFT } from '@/content/pages'
import type { SiteSettings, StaticPage } from '@/content/types'
import { formatDateRo } from '@/lib/content'
import { breadcrumbSchema, graph } from '@/lib/schema'

/**
 * O pagină legală.
 *
 * Toate patru au aceeași structură, deci același component: antet, cuprins
 * lateral, secțiuni numerotate, datele de identificare ale vânzătorului.
 *
 * Cuprinsul lateral nu e ornament: pe un text legal, cititorul caută o anume
 * secțiune, nu citește de la cap la coadă.
 */
type Props = {
  page: StaticPage
  settings: SiteSettings
}

export function LegalDocument({ page, settings }: Props) {
  const trail: Crumb[] = [
    { label: 'Acasă', href: '/' },
    { label: page.eyebrow.text, href: `/${page.slug}` },
  ]

  const anchors = page.sections.map((section, index) => ({
    id: `sectiunea-${index + 1}`,
    heading: section.heading,
  }))

  const company = [
    settings.company.legalName,
    settings.company.cui ? `CUI ${settings.company.cui}` : null,
    settings.company.regCom,
    settings.company.registeredAddress,
  ].filter((value): value is string => Boolean(value))

  return (
    <>
      <Breadcrumb trail={trail} />

      <main id="continut">
        <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead} tight>
          {page.updatedAt && (
            <p className="mt-9 font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-50">
              Ultima actualizare:{' '}
              <time dateTime={page.updatedAt}>{formatDateRo(page.updatedAt)}</time>
            </p>
          )}

          {LEGAL_DRAFT && (
            /*
              Blocaj §7.10 din STATUS.md: textul este un draft, redactat pentru
              situația reală a site-ului, dar nevalidat juridic. Nota se scoate
              dintr-un singur loc — `LEGAL_DRAFT` în `src/content/pages.ts` —
              când juristul confirmă.
            */
            <p
              role="note"
              className="mt-7 max-w-[56ch] rounded-card border border-ac-accent bg-ac-cream-50 px-6 py-5 text-body-sm leading-[1.7] text-ac-ink-70"
            >
              <strong className="font-medium text-ac-ink">Document în lucru.</strong> Textul
              acoperă cerințele legale aplicabile, dar așteaptă validarea unui jurist și
              completarea datelor de identificare ale firmei. Până atunci are caracter
              informativ.
            </p>
          )}
        </PageHeader>

        <Section padding="bottom-only">
          <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] items-start gap-col-gap min-[1000px]:grid-cols-[280px_minmax(0,1fr)]">
            <StickyColumn>
              <nav aria-labelledby="cuprins-legal">
                <h2
                  id="cuprins-legal"
                  className="font-medium text-label uppercase text-ac-accent-ink"
                >
                  Cuprins
                </h2>
                <ol className="mt-6 grid gap-3">
                  {anchors.map((anchor, index) => (
                    <li key={anchor.id} className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="font-medium text-[11px] tracking-[0.18em] text-ac-accent"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <a
                        href={`#${anchor.id}`}
                        className="ac-underline text-body-sm leading-[normal]"
                      >
                        {anchor.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </StickyColumn>

            <div className="max-w-[68ch]">
              {page.sections.map((section, index) => (
                <section
                  key={anchors[index]?.id ?? section.heading}
                  id={anchors[index]?.id}
                  className={index === 0 ? '' : 'mt-[clamp(48px,6vw,72px)]'}
                >
                  <h2 className="font-display text-h3 font-normal scroll-mt-[120px]">
                    {section.heading}
                  </h2>

                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="mt-5 text-body-lg leading-[1.75] text-ac-ink-70"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.list && (
                    <ul className="mt-6 grid gap-3">
                      {section.list.map((item) => (
                        <li
                          key={item.slice(0, 40)}
                          className="relative pl-6 text-body leading-[1.75] text-ac-ink-70 before:absolute before:top-[0.75em] before:left-0 before:block before:h-px before:w-[14px] before:bg-ac-accent before:content-['']"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {/* Datele vânzătorului. Obligatorii pentru vânzare online (brief §11.4). */}
              <section className="mt-[clamp(48px,6vw,72px)] border-t border-ac-line pt-8">
                <h2 className="font-medium text-label uppercase text-ac-accent-ink">
                  Date de identificare
                </h2>

                {company.length > 0 ? (
                  <ul className="mt-5 grid gap-2 text-body text-ac-ink-70">
                    {company.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-body text-ac-ink-70">
                    <span data-placeholder>[ Denumire firmă · CUI · Reg. Com. · Sediu ]</span>
                  </p>
                )}

                <p className="mt-5 text-body text-ac-ink-70">
                  {settings.city}, {settings.country} ·{' '}
                  {settings.email ? (
                    <TextLink href={`mailto:${settings.email}`}>{settings.email}</TextLink>
                  ) : (
                    <span data-placeholder>[ email ]</span>
                  )}
                </p>

                <p className="mt-7 text-body-sm leading-[1.7] text-ac-ink-50">
                  Ai o întrebare despre acest document?{' '}
                  <TextLink href="/contact" className="text-body-sm text-ac-ink-50">
                    Scrie-mi
                  </TextLink>
                  .
                </p>
              </section>
            </div>
          </Shell>
        </Section>
      </main>

      <JsonLd data={graph([breadcrumbSchema(trail, settings.url)])} />
    </>
  )
}

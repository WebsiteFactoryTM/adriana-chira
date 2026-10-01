import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/layout/PageHeader'
import { JsonLd } from '@/components/seo/JsonLd'
import { Arrow } from '@/components/ui/Button'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { ResourceForm } from '@/components/ui/ResourceForm'
import { Section, Shell } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import { getResourceBySlug, getSiteSettings } from '@/lib/content'
import { resourceFileHref } from '@/lib/resources'
import { breadcrumbSchema, graph } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ eroare?: string }>
}

/**
 * Pagina unei resurse descărcabile.
 *
 * Are trei roluri: adresă de sine stătătoare (se poate da pe LinkedIn sau într-un
 * email, fără articol), locul în care se întoarce formularul când ceva n-a
 * mers (`?eroare=`), și pagina la care trimite un link de descărcare expirat.
 *
 * Mesajele de eroare sunt scrise pentru om. Datele lui nu sunt în adresă,
 * deci nu le putem reafișa în câmpuri — de aceea validarea nativă din browser
 * oprește greșelile obișnuite ÎNAINTE de trimitere, iar aici ajung doar
 * cazurile rare.
 */
const ERRORS: Record<string, string> = {
  date: 'Unele câmpuri nu sunt completate corect. Verifică-le și trimite din nou.',
  limita: 'Formularul a fost trimis de prea multe ori într-un timp scurt. Încearcă din nou peste câteva minute.',
  server: 'Formularul nu a putut fi trimis acum. Încearcă din nou peste câteva momente.',
  expirat: 'Linkul de descărcare a expirat sau nu mai este valid. Completează din nou formularul și primești unul nou.',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const found = await getResourceBySlug(slug)
  if (!found) return {}

  return pageMetadata({
    title: found.resource.title,
    description:
      found.resource.description ??
      `${found.resource.title} — resursă gratuită de la Adriana Chira, consultant în performanță umană.`,
    path: found.resource.href,
  })
}

export default async function ResursaPage({ params, searchParams }: Props) {
  const [{ slug }, { eroare }, settings] = await Promise.all([params, searchParams, getSiteSettings()])
  const found = await getResourceBySlug(slug)
  if (!found) notFound()

  const { resource, posts } = found
  const error = eroare ? (ERRORS[eroare] ?? ERRORS.server) : null

  const trail: Crumb[] = [
    { label: 'Acasă', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: resource.title, href: resource.href },
  ]

  return (
    <>
      <Breadcrumb trail={trail} />

      <main id="continut">
        <PageHeader
          eyebrow={{ text: 'Resursă gratuită', ornament: 'line' }}
          title={resource.title}
          lead={resource.description}
          tight
        >
          <p className="mt-7 font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-50">
            {resource.meta}
          </p>
        </PageHeader>

        <Section tone="cream" padding="body">
          <Shell>
            <div
              id="formular"
              className="mx-auto max-w-[760px] scroll-mt-[120px] rounded-card border border-ac-accent bg-ac-paper p-[clamp(28px,4vw,52px)]"
            >
              {resource.access === 'free' ? (
                <>
                  <h2 className="font-display text-h3 font-normal">Documentul se descarcă direct.</h2>
                  <p className="mt-3 text-body text-ac-ink-70">Fără formular, fără cont.</p>
                  <a
                    href={resourceFileHref(resource.slug)}
                    download
                    className="mt-7 inline-flex min-h-11 items-center justify-center gap-[10px] rounded-pill border border-ac-ink bg-ac-ink px-[34px] py-[18px] font-medium text-nav uppercase tracking-[0.06em] text-ac-paper transition-[background-color,translate] duration-[320ms] ease-ac hover:-translate-y-[2px] hover:bg-black"
                  >
                    Descarcă <Arrow />
                  </a>
                </>
              ) : (
                <>
                  <h2 className="font-display text-h3 font-normal">Unde îți trimit documentul?</h2>
                  <p className="mt-3 mb-8 max-w-[56ch] text-body text-ac-ink-70">
                    Completezi câmpurile, iar documentul se descarcă imediat. Îți trimit linkul și pe
                    email, ca să îl găsești și mai târziu.
                  </p>
                  <ResourceForm resourceSlug={resource.slug} error={error} />
                </>
              )}
            </div>
          </Shell>
        </Section>

        {posts.length > 0 && (
          <Section padding="body" aria-labelledby="apare-in-titlu">
            <Shell>
              <div className="mx-auto max-w-[760px]">
                <h2 id="apare-in-titlu" className="font-medium text-label uppercase text-ac-accent-ink">
                  De citit împreună cu documentul
                </h2>
                <ul className="mt-5 grid gap-3">
                  {posts.map((post) => (
                    <li key={post.slug}>
                      <TextLink href={post.href} className="text-body" arrow>
                        {post.title}
                      </TextLink>
                    </li>
                  ))}
                </ul>
              </div>
            </Shell>
          </Section>
        )}
      </main>

      <JsonLd data={graph([breadcrumbSchema(trail, settings.url)])} />
    </>
  )
}

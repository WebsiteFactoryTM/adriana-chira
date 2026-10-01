import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/layout/PageHeader'
import { PageCta } from '@/components/sections/PageCta'
import { Arrow } from '@/components/ui/Button'
import { Section, Shell } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import { getResourceBySlug, getSiteSettings } from '@/lib/content'
import { getPayloadClientSafe } from '@/lib/payload'
import { DOWNLOAD_TOKEN_DAYS, resourceFileHref, verifyDownloadToken } from '@/lib/resources'
import { pageMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ t?: string }>
}

export const metadata: Metadata = pageMetadata({
  title: 'Documentul tău',
  description: 'Descărcarea documentului cerut.',
  path: '/resurse',
  // Pagină personală, cu jeton în adresă: nu are ce căuta în index.
  noIndex: true,
})

/**
 * După formular: mulțumirea și butonul de descărcare.
 *
 * Jetonul se verifică AICI, nu doar la descărcare: o pagină care spune
 * „mulțumesc, Ana" pentru un jeton expirat sau fabricat ar minți. Cu jeton
 * invalid, omul primește drumul înapoi spre formular.
 *
 * Descărcarea nu pornește singură: ar cere JavaScript sau un `meta refresh`,
 * iar un fișier care apare fără click e tocmai ce învață browserele să
 * blocheze. Un buton mare, primul lucru din pagină, face aceeași treabă.
 */
export default async function DescarcaPage({ params, searchParams }: Props) {
  const [{ slug }, { t }, settings] = await Promise.all([params, searchParams, getSiteSettings()])
  const found = await getResourceBySlug(slug)
  if (!found) notFound()

  const { resource, posts } = found
  const verified = verifyDownloadToken(t)
  // Un jeton valid, dar pentru ALTĂ resursă, nu deschide aceasta.
  const token = verified && verified.resourceId === found.id ? verified : null
  const firstName = token ? await requesterName(token.requestId) : null
  const valid = token !== null && firstName !== null

  return (
    <main id="continut">
      <PageHeader
        eyebrow={{ text: valid ? 'Documentul tău' : 'Link expirat', ornament: 'line' }}
        title={valid ? `Mulțumesc, ${firstName}.` : 'Linkul nu mai este valid.'}
        lead={
          valid
            ? `„${resource.title}" e gata de descărcat. Ți-am trimis linkul și pe email; este valabil ${DOWNLOAD_TOKEN_DAYS} zile.`
            : 'Linkurile de descărcare expiră după câteva zile. Completează din nou formularul și primești unul nou, imediat.'
        }
        tight
      >
        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
          {valid && t ? (
            <a
              href={resourceFileHref(resource.slug, t)}
              download
              className="inline-flex min-h-11 items-center justify-center gap-[10px] rounded-pill border border-ac-ink bg-ac-ink px-[34px] py-[18px] font-medium text-nav uppercase tracking-[0.06em] text-ac-paper transition-[background-color,translate] duration-[320ms] ease-ac hover:-translate-y-[2px] hover:bg-black"
            >
              Descarcă documentul <Arrow />
            </a>
          ) : (
            <a
              href={`${resource.href}#formular`}
              className="inline-flex min-h-11 items-center justify-center gap-[10px] rounded-pill border border-ac-ink px-[34px] py-[18px] font-medium text-nav uppercase tracking-[0.06em] text-ac-ink transition-[background-color,color] duration-[320ms] ease-ac hover:bg-ac-ink hover:text-ac-paper"
            >
              Înapoi la formular <Arrow />
            </a>
          )}
          <p className="font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-50">
            {resource.meta}
          </p>
        </div>
      </PageHeader>

      {valid && posts.length > 0 && (
        <Section padding="bottom-only" aria-labelledby="mai-departe-titlu">
          <Shell>
            <h2 id="mai-departe-titlu" className="font-medium text-label uppercase text-ac-accent-ink">
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
          </Shell>
        </Section>
      )}

      <PageCta
        eyebrow={{ text: 'Primul pas', ornament: 'pulse' }}
        heading="Dacă documentul ți-a pus o întrebare, hai să vorbim despre ea."
        body="Prima discuție este despre situația ta, nu despre pachete. La final știi clar care este pasul potrivit pentru tine."
        primary={{ label: 'Programează o discuție', href: '/contact' }}
        secondary={{ label: 'Vezi serviciile', href: '/servicii' }}
        note={settings.responseTime}
      />
    </main>
  )
}

/** Prenumele din solicitare. `null` dacă solicitarea nu (mai) există. */
async function requesterName(requestId: number): Promise<string | null> {
  const payload = await getPayloadClientSafe()
  if (!payload) return null
  try {
    const request = await payload.findByID({ collection: 'resource-requests', id: requestId, depth: 0 })
    return request.firstName
  } catch {
    return null
  }
}

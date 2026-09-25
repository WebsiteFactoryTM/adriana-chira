import type { Metadata } from 'next'

import { PageHeader } from '@/components/layout/PageHeader'
import { Arrow, Button } from '@/components/ui/Button'
import { Section, Shell } from '@/components/ui/Section'
import { canceledPage } from '@/content/pages'
import { getPackageBySlug, getWorkshopBySlug } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import { WORKSHOPS_PATH } from '@/lib/workshops'

type Props = { searchParams: Promise<{ pachet?: string; workshop?: string }> }

export const metadata: Metadata = pageMetadata({
  title: 'Comanda nu a fost finalizată',
  description: 'Comanda a fost întreruptă. Nu s-a debitat nimic.',
  path: '/comanda-anulata',
  noIndex: true,
})

/**
 * Comandă întreruptă.
 *
 * Mesaj scurt, fără reproș (prompt §5.3). Cine renunță la plată a avut un
 * motiv; pagina nu îl întreabă care. Dacă știm de la ce pachet a plecat,
 * primul buton îl duce înapoi exact acolo, nu în lista generală.
 */
export default async function ComandaAnulataPage({ searchParams }: Props) {
  const { pachet, workshop: workshopSlug } = await searchParams

  const [pkg, workshop] = await Promise.all([
    pachet ? getPackageBySlug(pachet) : null,
    workshopSlug ? getWorkshopBySlug(workshopSlug) : null,
  ])

  // De unde a plecat, acolo se întoarce. Workshopurile trăiesc pe o pagină
  // comună, deci întoarcerea e la ancora lor, nu la începutul catalogului.
  const back = workshop
    ? { href: `${WORKSHOPS_PATH}#${workshop.slug}`, label: `Înapoi la ${workshop.title}` }
    : pkg
      ? { href: pkg.href, label: `Înapoi la ${pkg.name ?? 'pachet'}` }
      : null

  return (
    <main id="continut">
      <PageHeader
        eyebrow={canceledPage.eyebrow}
        title={canceledPage.title}
        lead={canceledPage.lead}
      />

      <Section padding="bottom-only">
        <Shell>
          <div className="flex flex-wrap gap-4">
            {back ? (
              <Button href={back.href} variant="primary" size="lg">
                {back.label}
                <Arrow />
              </Button>
            ) : (
              <Button href="/servicii" variant="primary" size="lg">
                Vezi serviciile
                <Arrow />
              </Button>
            )}

            <Button
              href={
                workshop
                  ? `/contact?workshop=${workshop.slug}`
                  : pkg
                    ? `/contact?pachet=${pkg.slug}`
                    : '/contact'
              }
              variant="soft"
              size="lg"
            >
              Prefer să vorbim întâi
            </Button>
          </div>
        </Shell>
      </Section>
    </main>
  )
}

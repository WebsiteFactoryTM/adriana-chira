import type { Metadata } from 'next'

import { PageHeader } from '@/components/layout/PageHeader'
import { Arrow, Button } from '@/components/ui/Button'
import { Section, Shell } from '@/components/ui/Section'
import { canceledPage } from '@/content/pages'
import { getPackageBySlug } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

type Props = { searchParams: Promise<{ pachet?: string }> }

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
  const { pachet } = await searchParams
  const pkg = pachet ? await getPackageBySlug(pachet) : null

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
            {pkg ? (
              <Button href={pkg.href} variant="primary" size="lg">
                Înapoi la {pkg.name ?? 'pachet'}
                <Arrow />
              </Button>
            ) : (
              <Button href="/servicii" variant="primary" size="lg">
                Vezi pachetele
                <Arrow />
              </Button>
            )}

            <Button href="/contact" variant="soft" size="lg">
              Prefer să vorbim întâi
            </Button>
          </div>
        </Shell>
      </Section>
    </main>
  )
}

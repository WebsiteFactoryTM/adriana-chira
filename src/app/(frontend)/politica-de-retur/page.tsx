import type { Metadata } from 'next'

import { LegalDocument } from '@/components/sections/LegalDocument'
import { refundPage } from '@/content/pages'
import { getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Politica de retur',
  description:
    'Dreptul de retragere în 14 zile și cum se aplică în cazul unui serviciu de consultanță.',
  path: '/politica-de-retur',
})

/** Structura e comună celor patru pagini legale; textul vine din `src/content/pages.ts`. */
export default async function PoliticaRetur() {
  const settings = await getSiteSettings()
  return <LegalDocument page={refundPage} settings={settings} />
}

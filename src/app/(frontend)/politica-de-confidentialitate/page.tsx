import type { Metadata } from 'next'

import { LegalDocument } from '@/components/sections/LegalDocument'
import { privacyPage } from '@/content/pages'
import { getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Politica de confidențialitate',
  description:
    'Ce date personale colectez prin acest site, pe ce temei, cât timp le păstrez și ce drepturi ai asupra lor.',
  path: '/politica-de-confidentialitate',
})

/** Structura e comună celor patru pagini legale; textul vine din `src/content/pages.ts`. */
export default async function PoliticaConfidentialitatePage() {
  const settings = await getSiteSettings()
  return <LegalDocument page={privacyPage} settings={settings} />
}

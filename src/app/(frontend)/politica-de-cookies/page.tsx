import type { Metadata } from 'next'

import { LegalDocument } from '@/components/sections/LegalDocument'
import { cookiesPage } from '@/content/pages'
import { getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Politica de cookie-uri',
  description:
    'Ce cookie-uri folosește site-ul, când se instalează și cum îți schimbi alegerea oricând.',
  path: '/politica-de-cookies',
})

/** Structura e comună celor patru pagini legale; textul vine din `src/content/pages.ts`. */
export default async function PoliticaCookiesPage() {
  const settings = await getSiteSettings()
  return <LegalDocument page={cookiesPage} settings={settings} />
}

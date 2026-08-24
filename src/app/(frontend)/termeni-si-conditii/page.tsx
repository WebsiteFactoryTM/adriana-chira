import type { Metadata } from 'next'

import { LegalDocument } from '@/components/sections/LegalDocument'
import { termsPage } from '@/content/pages'
import { getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Termeni și condiții',
  description:
    'Condițiile în care se achiziționează și se prestează serviciile de consultanță de pe acest site.',
  path: '/termeni-si-conditii',
})

/** Structura e comună celor patru pagini legale; textul vine din `src/content/pages.ts`. */
export default async function TermeniPage() {
  const settings = await getSiteSettings()
  return <LegalDocument page={termsPage} settings={settings} />
}

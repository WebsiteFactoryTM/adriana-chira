import type { Metadata } from 'next'

import type { SeoOverrides } from '@/content/types'

/**
 * Metadata unei pagini interioare.
 *
 * Un singur loc care știe regula: valorile scrise în admin au întâietate, iar
 * unde nu s-a scris nimic se folosesc titlul și descrierea documentului. Fără
 * asta, fiecare `generateMetadata` ar reimplementa aceeași îmbinare — și una
 * dintre ele ar uita `noindex`.
 *
 * `title` intră în șablonul din layout (`%s · Adriana Chira`). Un `metaTitle`
 * scris de mână îl ocolește: dacă cineva a formulat titlul explicit pentru
 * Google, nu i-l mai completăm noi.
 */
type Args = {
  title: string
  description: string
  path: string
  seo?: SeoOverrides
  /** Imaginea de partajare, dacă pagina are una proprie. */
  image?: string | null
  type?: 'website' | 'article' | 'profile'
  /** Paginile de confirmare nu au ce căuta în index. */
  noIndex?: boolean
}

export function pageMetadata({
  title,
  description,
  path,
  seo,
  image,
  type = 'website',
  noIndex = false,
}: Args): Metadata {
  const finalTitle = seo?.metaTitle ?? title
  const finalDescription = seo?.metaDescription ?? description
  const finalImage = seo?.ogImage ?? image ?? undefined
  const hidden = noIndex || seo?.noIndex === true

  return {
    title: seo?.metaTitle ? { absolute: seo.metaTitle } : finalTitle,
    description: finalDescription,
    alternates: { canonical: path },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: path,
      type: type === 'profile' ? 'profile' : type,
      ...(finalImage ? { images: [{ url: finalImage }] } : {}),
    },
    ...(finalImage ? { twitter: { card: 'summary_large_image', images: [finalImage] } } : {}),
    ...(hidden
      ? { robots: { index: false, follow: true, googleBot: { index: false, follow: true } } }
      : {}),
  }
}

/**
 * Adresele calculate ale site-ului.
 *
 * Paginile Next nu au voie să exporte decât un set fix de simboluri (`default`,
 * `metadata`, `revalidate`, …), deci ajutoarele de rutare stau aici. În plus,
 * regula „prima pagină nu are sufix" trebuie scrisă o singură dată: e folosită
 * și de paginare, și de canonical, și de sitemap.
 */

export const blogHref = (page: number): string => (page === 1 ? '/blog' : `/blog/pagina/${page}`)

export const categoryHref = (slug: string, page: number): string =>
  page === 1 ? `/blog/categorie/${slug}` : `/blog/categorie/${slug}/pagina/${page}`

/**
 * Cererea de ofertă pentru un program cu preț la cerere.
 *
 * Duce direct la formular (`#formular`), cu mesajul precompletat pentru
 * ofertă (`cerere=oferta`), ca omul să nu mai caute formularul și Adriana să
 * nu mai ghicească ce i se cere. Primește adresa pachetului, nu slug-ul:
 * cardurile au doar adresa.
 */
export const quoteHref = (packageHref: string): string => {
  const slug = packageHref.split('/').filter(Boolean).pop() ?? ''
  return `/contact?pachet=${encodeURIComponent(slug)}&cerere=oferta#formular`
}

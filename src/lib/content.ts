import { homeContent } from '@/content/home'
import { siteSettings } from '@/content/site'
import type { HomeContent, SiteSettings } from '@/content/types'

/**
 * Stratul de acces la conținut.
 *
 * Singurul loc din aplicație care știe DE UNDE vine conținutul. Componentele
 * apelează doar aceste funcții. Când intră Payload (faza 2), corpul devine:
 *
 *   const payload = await getPayload({ config })
 *   const home = await payload.findGlobal({ slug: 'home-page' })
 *   return mergeWithFallback(home, homeContent)
 *
 * Funcțiile sunt `async` de la început tocmai ca semnătura să nu se schimbe.
 */

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings
}

export async function getHomeContent(): Promise<HomeContent> {
  return homeContent
}

/** Formatează o dată ISO în forma folosită în design: „12 august 2026". */
const MONTHS_RO = [
  'ianuarie',
  'februarie',
  'martie',
  'aprilie',
  'mai',
  'iunie',
  'iulie',
  'august',
  'septembrie',
  'octombrie',
  'noiembrie',
  'decembrie',
] as const

export function formatDateRo(iso: string): string {
  const date = new Date(iso)
  const month = MONTHS_RO[date.getUTCMonth()] ?? ''
  return `${date.getUTCDate()} ${month} ${date.getUTCFullYear()}`
}

/** Construiește un URL absolut pornind de la `NEXT_PUBLIC_SITE_URL`. */
export function absoluteUrl(path: string, base: string): string {
  return new URL(path, base).toString()
}

import { PURCHASABLE_WINDOW, WORKSHOP_CURRENCY, WORKSHOP_PRICE } from '@/content/workshops'
import type { Workshop, WorkshopEntry } from '@/content/types'

/**
 * Ordonarea catalogului și fereastra de înscriere.
 *
 * Funcții pure, fără acces la bază de date: primesc lista și data de referință,
 * întorc lista pregătită de randat. Sunt separate de `lib/content.ts` tocmai
 * pentru că regula de mai jos e singura din site care depinde de ziua curentă
 * și merită citită dintr-un singur loc.
 *
 * ## Cele două reguli
 *
 * 1. **Ordinea din pagină e ordinea desfășurării.** Întâi edițiile cu dată în
 *    viitor, în ordine cronologică. După ele, restul catalogului, în ordinea
 *    logică a seriei — autocunoaștere, autoreglare, gândire și decizie,
 *    adaptare, relaționare, leadership, performanță sustenabilă.
 *
 * 2. **Se pot cumpăra doar următoarele trei ediții programate.** Nu „primele
 *    trei din catalog": primele trei CU DATĂ ÎN VIITOR. Fereastra se mută
 *    singură pe măsură ce trec datele, fără ca nimeni să bifeze ceva în admin.
 *    Adriana pune o dată nouă pe un workshop, iar acesta intră la rând.
 *
 * ## De ce edițiile trecute nu dispar
 *
 * Un workshop căruia i-a trecut data nu iese din pagină: coboară în lista fără
 * dată, exact ca unul neprogramat încă. Workshopul există în continuare — doar
 * ediția s-a consumat. Dacă l-am scoate, catalogul s-ar subția lună de lună,
 * iar paginile care se golesc singure sunt cel mai bun mod de a pierde poziții
 * în căutări pe termeni pe care îi acopereai.
 */

/**
 * Adresa paginii de catalog.
 *
 * Este cea recomandată explicit în documentul clientei. E mai lungă decât
 * restul rutelor site-ului, dar poartă chiar expresia pe care o căutăm, iar
 * schimbarea ei după indexare ar costa mai mult decât câștigă.
 */
export const WORKSHOPS_PATH = '/workshopuri-performanta-umana'

/** Ziua de azi la Timișoara, ca `AAAA-LL-ZZ`. */
export function todayInBucharest(now: Date = new Date()): string {
  // `en-CA` produce chiar formatul ISO, deci nu mai trebuie recompus din bucăți.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Bucharest',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

/**
 * Pregătește catalogul pentru randare.
 *
 * Comparația de date se face pe șiruri ISO, nu pe obiecte `Date`, și e
 * intenționat: `AAAA-LL-ZZ` se ordonează lexicografic exact ca și cronologic,
 * iar comparația scapă complet de fusuri orare și de ora de vară. O ediție
 * este „azi sau mai încolo" dacă șirul ei este `>=` ziua curentă — deci ziua
 * workshopului rămâne deschisă la înscriere până la capăt.
 */
export function prepareWorkshops(
  entries: WorkshopEntry[],
  options: { today?: string; price?: number; currency?: string } = {},
): Workshop[] {
  const today = options.today ?? todayInBucharest()
  const price = options.price ?? WORKSHOP_PRICE
  const currency = options.currency ?? WORKSHOP_CURRENCY

  const upcoming: WorkshopEntry[] = []
  const rest: WorkshopEntry[] = []

  for (const entry of entries) {
    if (entry.sessionDate !== null && entry.sessionDate >= today) upcoming.push(entry)
    else rest.push(entry)
  }

  upcoming.sort((a, b) => (a.sessionDate ?? '').localeCompare(b.sessionDate ?? ''))

  // Fereastra se aplică DUPĂ sortare: contează cine e primul în timp, nu cine
  // a fost scris primul în catalog.
  const openSlugs = new Set(upcoming.slice(0, PURCHASABLE_WINDOW).map((entry) => entry.slug))

  return [...upcoming, ...rest].map((entry, index) => ({
    ...entry,
    // Numărul este poziția din pagină, nu un identificator al workshopului.
    // Lista se citește de sus în jos, deci orice altă numerotare ar sări.
    numeral: String(index + 1).padStart(2, '0'),
    href: `${WORKSHOPS_PATH}#${entry.slug}`,
    price,
    currency,
    purchasable: openSlugs.has(entry.slug),
    scheduled: entry.sessionDate !== null && entry.sessionDate >= today,
  }))
}

/** Data ediției, scrisă pentru om: „17 octombrie 2026". */
export function formatSessionDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  const index = Number(month) - 1
  const name = MONTHS[index] ?? ''
  return name ? `${Number(day)} ${name} ${year}` : iso
}

/** Data ediției, scurtă, pentru insigna de pe card: „17 oct 2026". */
export function formatSessionDateShort(iso: string): string {
  const [year, month, day] = iso.split('-')
  const index = Number(month) - 1
  const name = MONTHS_SHORT[index] ?? ''
  return name ? `${Number(day)} ${name} ${year}` : iso
}

/**
 * Lunile, scrise de mână.
 *
 * `Intl.DateTimeFormat('ro-RO')` le-ar da singur, dar rezultatul depinde de
 * versiunea de ICU din runtime — pe unele build-uri de Node lunile românești
 * ies cu sedilă în loc de virgulă dedesubt, ceea ce ar strica exact regula 10
 * din STATUS.md §2 fără ca `grep`-ul pe `src/` să prindă ceva.
 */
const MONTHS = [
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

const MONTHS_SHORT = [
  'ian',
  'feb',
  'mar',
  'apr',
  'mai',
  'iun',
  'iul',
  'aug',
  'sep',
  'oct',
  'noi',
  'dec',
] as const

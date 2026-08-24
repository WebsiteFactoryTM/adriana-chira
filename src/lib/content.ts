import { cache } from 'react'

import { homeContent } from '@/content/home'
import { siteSettings } from '@/content/site'
import type {
  BlogContent,
  CitatContent,
  CtaContent,
  DespreContent,
  Eyebrow,
  FaqContent,
  FaqItem,
  HomeContent,
  MetodaContent,
  NavItem,
  PackagePreview,
  PentruCineContent,
  ProblemaContent,
  ServiciiContent,
  SiteSettings,
  UniversContent,
  ValoriContent,
} from '@/content/types'
import { getPayloadClientSafe } from '@/lib/payload'
import type { Faq, HomePage, Media, Package, SiteSetting } from '@/payload-types'

/**
 * Stratul de acces la conținut.
 *
 * Singurul loc din aplicație care știe DE UNDE vine conținutul. Componentele
 * apelează doar aceste funcții și primesc mereu tipurile din
 * `src/content/types.ts` — contractul nu s-a schimbat la intrarea Payload.
 *
 * ## Regula de îmbinare
 *
 * CMS-ul are întâietate, dar numai unde chiar a fost completat. Orice câmp gol,
 * `null` sau listă goală cade pe valoarea din `src/content/`, adică pe textul
 * verificat nod-cu-nod față de designul aprobat (STATUS.md §6).
 *
 * Nu e o precauție teoretică: globalurile Payload creează documentul cu toate
 * câmpurile `null` din prima clipă, iar o secțiune pe care nimeni n-a atins-o
 * ar goli pagina. Cu regula asta, cel mai rău caz — baza de date oprită, CMS
 * necompletat, migrare pe jumătate — dă exact pagina din design.
 *
 * ## De ce nu aruncă niciodată
 *
 * `getPayloadClientSafe()` întoarce `null` dacă baza de date nu răspunde.
 * Homepage-ul este prerandat la build; dacă build-ul ar cădea fără Postgres,
 * CMS-ul ar deveni o dependență dură a livrării.
 */

/* -------------------------------------------------------------------------- */
/* Îmbinare                                                                    */
/* -------------------------------------------------------------------------- */

/** Text din CMS dacă există și nu e gol, altfel valoarea din design. */
function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

/** Ca `text`, dar păstrează `null` — pentru câmpurile încă neconfirmate. */
function nullableText(value: unknown, fallback: string | null): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

/** Listă din CMS dacă are cel puțin un element, altfel cea din design. */
function list<TSource, TResult>(
  value: TSource[] | null | undefined,
  map: (item: TSource, index: number) => TResult,
  fallback: TResult[],
): TResult[] {
  if (!Array.isArray(value) || value.length === 0) return fallback
  return value.map(map)
}

/** Eticheta de secțiune: text și ornament din CMS, restul din design. */
function eyebrow(value: unknown, fallback: Eyebrow): Eyebrow {
  const source = value as { text?: string | null; ornament?: Eyebrow['ornament'] | null } | null
  return {
    text: text(source?.text, fallback.text),
    ornament: source?.ornament ?? fallback.ornament,
  }
}

/** Link cu etichetă și țintă. Un link fără una dintre ele nu e folosibil. */
function link(value: unknown, fallback: NavItem): NavItem {
  const source = value as { label?: string | null; href?: string | null } | null
  return {
    label: text(source?.label, fallback.label),
    href: text(source?.href, fallback.href),
  }
}

/** URL-ul unui fișier încărcat, dacă relația a fost populată. */
function mediaUrl(value: number | Media | null | undefined): string | null {
  if (!value || typeof value === 'number') return null
  return typeof value.url === 'string' ? value.url : null
}

function mediaAlt(value: number | Media | null | undefined, fallback: string): string {
  if (!value || typeof value === 'number') return fallback
  return typeof value.alt === 'string' && value.alt.length > 0 ? value.alt : fallback
}

/* -------------------------------------------------------------------------- */
/* Setările site-ului                                                          */
/* -------------------------------------------------------------------------- */

function mergeSiteSettings(cms: SiteSetting | null): SiteSettings {
  const fallback = siteSettings
  if (!cms) return fallback

  const social = list(
    cms.socialLinks,
    (item) => ({ label: item.platform, href: item.url, pending: false }),
    fallback.social,
  )

  return {
    ...fallback,
    siteName: text(cms.siteName, fallback.siteName),
    role: text(cms.role, fallback.role),
    tagline: text(cms.tagline, fallback.tagline),
    email: nullableText(cms.email, fallback.email),
    phone: nullableText(cms.phone, fallback.phone),
    city: text(cms.city, fallback.city),
    region: text(cms.region, fallback.region),
    country: text(cms.country, fallback.country),
    social,
    company: {
      legalName: nullableText(cms.companyLegalName, fallback.company.legalName),
      cui: nullableText(cms.cui, fallback.company.cui),
      regCom: nullableText(cms.regCom, fallback.company.regCom),
      registeredAddress: nullableText(
        cms.registeredAddress,
        fallback.company.registeredAddress,
      ),
    },
    bookingUrl: nullableText(cms.bookingUrl, fallback.bookingUrl),
    // GA4 din CMS are întâietate față de variabila de mediu: clienta trebuie să
    // îl poată schimba singură, fără redeploy (prompt §10).
    ga4MeasurementId: nullableText(cms.ga4MeasurementId, fallback.ga4MeasurementId),
    responseTime: text(cms.responseTime, fallback.responseTime),
    availability: text(cms.availability, fallback.availability),
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const payload = await getPayloadClientSafe()
  if (!payload) return siteSettings

  try {
    const cms = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
    return mergeSiteSettings(cms)
  } catch {
    return siteSettings
  }
}

/* -------------------------------------------------------------------------- */
/* Homepage                                                                    */
/* -------------------------------------------------------------------------- */

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'] as const

/**
 * Pachetele.
 *
 * Cât timp niciun pachet nu e vizibil, cardurile rămân placeholderele din
 * designul aprobat — `[ Nume pachet ]`, `[ 000 ] EUR`. Numerotarea romană e
 * parte din design și se recalculează după ordinea reală, nu se ia din CMS.
 */
function mergePackages(docs: Package[], fallback: PackagePreview[]): PackagePreview[] {
  if (docs.length === 0) return fallback

  return docs.map((doc, index) => ({
    numeral: ROMAN[index] ?? String(index + 1),
    name: nullableText(doc.name, null),
    tagline: nullableText(doc.tagline, null),
    forWho: nullableText(doc.forWho, null),
    includes:
      Array.isArray(doc.includes) && doc.includes.length > 0
        ? doc.includes.map((entry) => nullableText(entry.item, null))
        : [null, null, null],
    duration: nullableText(doc.duration, null),
    price: typeof doc.price === 'number' ? doc.price : null,
    currency: 'EUR',
    href: `/servicii/${doc.slug}`,
    featured: doc.featured === true,
  }))
}

function mergeFaqItems(docs: Faq[], fallback: FaqItem[]): FaqItem[] {
  if (docs.length === 0) return fallback

  return docs.map((doc) => {
    const table = doc.comparisonTable
    const columns = table?.columns?.map((column) => column.label) ?? []
    const rows =
      table?.rows?.map((row) => ({
        label: row.label,
        cells: row.cells?.map((cell) => cell.value) ?? [],
      })) ?? []

    // Un tabel cu rânduri incomplete ar strica antetele. Îl afișăm doar dacă
    // are titlu, coloane și fiecare rând completat pe toate coloanele.
    const hasTable =
      typeof table?.caption === 'string' &&
      table.caption.length > 0 &&
      columns.length > 0 &&
      rows.length > 0 &&
      rows.every((row) => row.cells.length === columns.length)

    return {
      question: doc.question,
      answer: doc.answer,
      ...(hasTable
        ? { table: { caption: table.caption as string, columns, rows } }
        : {}),
    }
  })
}

function mergeHome(
  cms: HomePage | null,
  collections: { faqs: Faq[]; packages: Package[] },
): HomeContent {
  const fallback = homeContent
  if (!cms) {
    return {
      ...fallback,
      servicii: {
        ...fallback.servicii,
        packages: mergePackages(collections.packages, fallback.servicii.packages),
      },
      faq: { ...fallback.faq, items: mergeFaqItems(collections.faqs, fallback.faq.items) },
    }
  }

  // Numărul de rânduri e fixat de design (trei), iar globalul îl impune prin
  // minRows/maxRows. Dacă lista ajunge totuși goală, cade pe design.
  const heroLines = list(cms.heroHeadline, (line) => line.text, fallback.hero.headlineLines)

  const hero: HomeContent['hero'] = {
    eyebrow: {
      text: text(cms.heroEyebrow, fallback.hero.eyebrow.text),
      ornament: fallback.hero.eyebrow.ornament,
    },
    headlineLines: heroLines,
    lead: text(cms.heroLead, fallback.hero.lead),
    intro: text(cms.heroIntro, fallback.hero.intro),
    primaryCta: link(cms.heroPrimaryCta, fallback.hero.primaryCta),
    secondaryCta: link(cms.heroSecondaryCta, fallback.hero.secondaryCta),
    badges: list(cms.heroBadges, (badge) => badge.text, fallback.hero.badges),
    portrait: {
      ...fallback.hero.portrait,
      src: mediaUrl(cms.heroImage) ?? fallback.hero.portrait.src,
      alt: mediaAlt(cms.heroImage, fallback.hero.portrait.alt),
    },
  }

  const problema: ProblemaContent = {
    eyebrow: eyebrow(cms.problema?.eyebrow, fallback.problema.eyebrow),
    heading: text(cms.problema?.heading, fallback.problema.heading),
    body: text(cms.problema?.body, fallback.problema.body),
    signs: list(
      cms.problema?.signs,
      (sign) => ({
        index: sign.index,
        title: sign.title ?? undefined,
        body: sign.body ?? undefined,
      }),
      fallback.problema.signs,
    ),
  }

  const metoda: MetodaContent = {
    eyebrow: eyebrow(cms.metoda?.eyebrow, fallback.metoda.eyebrow),
    heading: text(cms.metoda?.heading, fallback.metoda.heading),
    body: text(cms.metoda?.body, fallback.metoda.body),
    steps: list(
      cms.metoda?.steps,
      (step) => ({
        index: step.index,
        title: step.title ?? undefined,
        body: step.body ?? undefined,
      }),
      fallback.metoda.steps,
    ),
  }

  const pentruCine: PentruCineContent = {
    eyebrow: eyebrow(cms.pentruCine?.eyebrow, fallback.pentruCine.eyebrow),
    heading: text(cms.pentruCine?.heading, fallback.pentruCine.heading),
    aside: text(cms.pentruCine?.aside, fallback.pentruCine.aside),
    segments: list(
      cms.pentruCine?.segments,
      (segment) => ({ title: segment.title, body: segment.body ?? '' }),
      fallback.pentruCine.segments,
    ),
  }

  const univers: UniversContent = {
    eyebrow: eyebrow(cms.univers?.eyebrow, fallback.univers.eyebrow),
    heading: text(cms.univers?.heading, fallback.univers.heading),
    body: text(cms.univers?.body, fallback.univers.body),
    note: text(cms.univers?.note, fallback.univers.note),
    items: list(
      cms.univers?.items,
      (item) => ({
        numeral: item.numeral,
        title: item.title,
        trademark: item.trademark ?? false,
        body: item.body ?? '',
      }),
      fallback.univers.items,
    ),
  }

  const despre: DespreContent = {
    eyebrow: eyebrow(cms.despre?.eyebrow, fallback.despre.eyebrow),
    heading: text(cms.despre?.heading, fallback.despre.heading),
    paragraphs: list(
      cms.despre?.paragraphs,
      (paragraph) => paragraph.text,
      fallback.despre.paragraphs,
    ),
    credentials: list(
      cms.despre?.credentials,
      (credential) => credential.text,
      fallback.despre.credentials,
    ),
    link: link(cms.despre?.link, fallback.despre.link),
    portrait: {
      ...fallback.despre.portrait,
      src: mediaUrl(cms.despre?.portrait) ?? fallback.despre.portrait.src,
      alt: mediaAlt(cms.despre?.portrait, fallback.despre.portrait.alt),
    },
  }

  const valori: ValoriContent = {
    eyebrow: eyebrow(cms.valori?.eyebrow, fallback.valori.eyebrow),
    values: list(
      cms.valori?.values,
      (value) => ({ index: value.index, title: value.title, body: value.body ?? '' }),
      fallback.valori.values,
    ),
  }

  const citat: CitatContent = {
    lines: list(cms.citat?.lines, (line) => line.text, fallback.citat.lines),
    attribution: text(cms.citat?.attribution, fallback.citat.attribution),
  }

  const servicii: ServiciiContent = {
    eyebrow: eyebrow(cms.servicii?.eyebrow, fallback.servicii.eyebrow),
    heading: text(cms.servicii?.heading, fallback.servicii.heading),
    intro: text(cms.servicii?.intro, fallback.servicii.intro),
    packages: mergePackages(collections.packages, fallback.servicii.packages),
    reassurance: list(
      cms.servicii?.reassurance,
      (item) => item.text,
      fallback.servicii.reassurance,
    ),
    footerLink: link(cms.servicii?.footerLink, fallback.servicii.footerLink),
  }

  const blog: BlogContent = {
    eyebrow: eyebrow(cms.blog?.eyebrow, fallback.blog.eyebrow),
    heading: text(cms.blog?.heading, fallback.blog.heading),
    link: link(cms.blog?.link, fallback.blog.link),
    // Articolele intră la faza 3b, odată cu paginile de blog. Până atunci,
    // cardurile rămân cele din designul aprobat.
    posts: fallback.blog.posts,
  }

  const faq: FaqContent = {
    eyebrow: eyebrow(cms.faq?.eyebrow, fallback.faq.eyebrow),
    heading: text(cms.faq?.heading, fallback.faq.heading),
    items: mergeFaqItems(collections.faqs, fallback.faq.items),
  }

  const cta: CtaContent = {
    eyebrow: eyebrow(cms.cta?.eyebrow, fallback.cta.eyebrow),
    heading: text(cms.cta?.heading, fallback.cta.heading),
    body: text(cms.cta?.body, fallback.cta.body),
    cta: link(cms.cta?.ctaLink, fallback.cta.cta),
    note: text(cms.cta?.note, fallback.cta.note),
  }

  return { hero, problema, metoda, pentruCine, univers, despre, valori, citat, servicii, blog, faq, cta }
}

/**
 * Globalul `home-page`, citit o singură dată per cerere.
 *
 * `cache` din React deduplică apelurile în interiorul aceleiași randări:
 * homepage-ul cere și conținutul, și lista secțiunilor ascunse, iar fără
 * memorare ar fi două interogări identice pentru același document.
 */
const fetchHomeGlobal = cache(async (): Promise<HomePage | null> => {
  const payload = await getPayloadClientSafe()
  if (!payload) return null

  try {
    return await payload.findGlobal({ slug: 'home-page', depth: 1 })
  } catch {
    return null
  }
})

export async function getHomeContent(): Promise<HomeContent> {
  const payload = await getPayloadClientSafe()
  if (!payload) return homeContent

  try {
    const [cms, faqs, packages] = await Promise.all([
      fetchHomeGlobal(),
      payload.find({
        collection: 'faqs',
        where: { page: { in: ['homepage', 'ambele'] } },
        sort: 'order',
        limit: 20,
        depth: 0,
      }),
      payload.find({
        collection: 'packages',
        where: { active: { equals: true } },
        sort: 'order',
        limit: 6,
        depth: 0,
      }),
    ])

    return mergeHome(cms, { faqs: faqs.docs, packages: packages.docs })
  } catch {
    return homeContent
  }
}

/**
 * Secțiunile ascunse din CMS.
 *
 * Ordinea secțiunilor este fixată de designul aprobat, deci nu se citește de
 * nicăieri; ce se poate citi este dacă o secțiune a fost ascunsă. Homepage-ul
 * filtrează cu asta, fără să știe de unde vine informația.
 */
export async function getHiddenSections(): Promise<Set<string>> {
  const cms = await fetchHomeGlobal()
  const hidden = new Set<string>()
  if (!cms) return hidden

  const sections: [string, { visible?: boolean | null } | null | undefined][] = [
    ['problema', cms.problema],
    ['metoda', cms.metoda],
    ['pentru-cine', cms.pentruCine],
    ['univers', cms.univers],
    ['despre', cms.despre],
    ['valori', cms.valori],
    ['citat', cms.citat],
    ['servicii', cms.servicii],
    ['blog', cms.blog],
    ['faq', cms.faq],
    ['cta', cms.cta],
  ]

  for (const [id, section] of sections) {
    if (section?.visible === false) hidden.add(id)
  }

  return hidden
}

/* -------------------------------------------------------------------------- */
/* Formatare                                                                   */
/* -------------------------------------------------------------------------- */

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

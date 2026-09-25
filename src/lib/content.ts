import { cache } from 'react'

import { homeContent } from '@/content/home'
import { aboutFallback } from '@/content/pages'
import { CARD_INCLUDES, packagesFallback, publicPackagesFallback } from '@/content/packages'
import { siteSettings } from '@/content/site'
import { testimonials } from '@/content/testimonials'
import { workshopEntries, workshopsPage } from '@/content/workshops'
import type {
  AboutContent,
  BlogContent,
  CategorySummary,
  CitatContent,
  CtaContent,
  DespreContent,
  Eyebrow,
  FaqContent,
  FaqItem,
  HomeContent,
  ImageSlotContent,
  MetodaContent,
  NavItem,
  PackageDetail,
  PackagePreview,
  PentruCineContent,
  PostDetail,
  PostSummary,
  ProblemaContent,
  RichTextDocument,
  SeoOverrides,
  ServiciiContent,
  SiteSettings,
  Testimonial,
  UniversContent,
  ValoriContent,
  Workshop,
  WorkshopEntry,
} from '@/content/types'
import { getPayloadClientSafe } from '@/lib/payload'
import { prepareWorkshops } from '@/lib/workshops'
import type {
  AboutPage,
  Category,
  Faq,
  HomePage,
  Media,
  Package,
  Post,
  SiteSetting,
} from '@/payload-types'

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
 * Moneda afișată. Toate prețurile clientei sunt în lei.
 *
 * Scris o singură dată: aceeași valoare merge și pe card, și pe pagina de
 * pachet, și în `Offer`-ul din datele structurate, și în sesiunea de plată.
 * Codul ISO, nu simbolul — este ce cere `priceCurrency` din schema.org.
 */
const CURRENCY = 'RON'

/**
 * Pachetele.
 *
 * Fără pachete vizibile în CMS, cardurile cad pe cele trei programe reale din
 * `src/content/packages.ts`. Numerotarea romană e parte din design și se
 * recalculează după ordinea reală, nu se ia din CMS.
 *
 * `CARD_INCLUDES` taie lista „Ce include" la trei rânduri, cât are cardul din
 * designul aprobat. Restul elementelor nu se pierd: apar integral pe pagina
 * pachetului.
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
        ? doc.includes.slice(0, CARD_INCLUDES).map((entry) => nullableText(entry.item, null))
        : [null, null, null],
    duration: nullableText(doc.duration, null),
    // Programele la cerere nu își trimit prețul spre pagini — vezi `publicPackage`.
    price: doc.priceOnRequest !== true && typeof doc.price === 'number' ? doc.price : null,
    pricing: doc.priceOnRequest === true ? 'quote' : 'fixed',
    currency: CURRENCY,
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

/** Un articol publicat, în forma cerută de cardul de pe homepage. */
function toPostPreview(doc: Post) {
  const category = categoryOf(doc.category)
  return {
    title: doc.title,
    href: `/blog/${doc.slug}`,
    category: category?.name ?? '',
    ...(category ? { categoryHref: `/blog/categorie/${category.slug}` } : {}),
    excerpt: doc.excerpt,
    publishedAt: doc.publishedAt,
    readingTime: typeof doc.readingTime === 'number' ? doc.readingTime : 1,
    cover: coverSlot(doc.cover),
  }
}

function mergeHome(
  cms: HomePage | null,
  collections: { faqs: Faq[]; packages: Package[]; posts: Post[] },
): HomeContent {
  const fallback = homeContent
  if (!cms) {
    return {
      ...fallback,
      servicii: {
        ...fallback.servicii,
        packages: mergePackages(collections.packages, fallback.servicii.packages),
      },
      blog: {
        ...fallback.blog,
        posts:
          collections.posts.length > 0
            ? collections.posts.slice(0, 3).map(toPostPreview)
            : fallback.blog.posts,
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
    // Cele mai recente trei articole PUBLICATE. Cât timp toate sunt ciorne —
    // titlurile există, textul nu (STATUS §7.12) — lista e goală și secțiunea
    // rămâne cea din designul aprobat.
    posts:
      collections.posts.length > 0
        ? collections.posts.slice(0, 3).map(toPostPreview)
        : fallback.blog.posts,
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
    const [cms, faqs, packages, posts] = await Promise.all([
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
      payload.find({
        collection: 'posts',
        // Vezi nota despre `overrideAccess` de la §„Paginile interioare":
        // filtrul e singurul lucru care ține ciornele în afara homepage-ului.
        where: { _status: { equals: 'published' } },
        sort: '-publishedAt',
        limit: 3,
        depth: 1,
      }),
    ])

    return mergeHome(cms, { faqs: faqs.docs, packages: packages.docs, posts: posts.docs })
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

/* ========================================================================== */
/* PAGINILE INTERIOARE (faza 3b)                                              */
/* ========================================================================== */

/**
 * O notă despre acces.
 *
 * API-ul local al Payload rulează implicit cu `overrideAccess: true`, adică
 * IGNORĂ regulile din `src/access/`. Filtrele `_status: 'published'` și
 * `active: true` de mai jos nu sunt redundante cu acele reguli — sunt singurul
 * lucru care ține ciornele și pachetele ascunse în afara paginilor publice.
 * Nu le scoate.
 */

/** Suprascrierile de SEO ale unui document. */
function seoOf(value: unknown): SeoOverrides {
  const source = value as
    | {
        metaTitle?: string | null
        metaDescription?: string | null
        ogImage?: number | Media | null
        noIndex?: boolean | null
      }
    | null
    | undefined

  return {
    metaTitle: nullableText(source?.metaTitle, null),
    metaDescription: nullableText(source?.metaDescription, null),
    ogImage: mediaUrl(source?.ogImage),
    noIndex: source?.noIndex === true,
  }
}

/** Coperta unui articol. Fără fișier, rămâne placeholderul crem din design. */
function coverSlot(value: number | Media | null | undefined): ImageSlotContent {
  const url = mediaUrl(value)
  const media = value && typeof value !== 'number' ? value : null

  return {
    slot: 'post-cover',
    src: url,
    alt: url ? mediaAlt(value, '') : '',
    width: typeof media?.width === 'number' ? media.width : 1200,
    height: typeof media?.height === 'number' ? media.height : 900,
    placeholderLabel: 'Articol',
  }
}

/** Categoria unui articol, dacă relația a fost populată (`depth >= 1`). */
function categoryOf(value: number | Category | null | undefined) {
  if (!value || typeof value === 'number') return null
  return { name: value.name, slug: value.slug }
}

function toPostSummary(doc: Post): PostSummary {
  return {
    title: doc.title,
    slug: doc.slug,
    href: `/blog/${doc.slug}`,
    excerpt: doc.excerpt,
    category: categoryOf(doc.category),
    publishedAt: doc.publishedAt,
    readingTime: typeof doc.readingTime === 'number' ? doc.readingTime : 1,
    cover: coverSlot(doc.cover),
  }
}

/* -------------------------------------------------------------------------- */
/* Despre mine                                                                 */
/* -------------------------------------------------------------------------- */

function mergeAbout(cms: AboutPage | null): AboutContent {
  const fallback = aboutFallback
  if (!cms) return fallback

  return {
    eyebrow: fallback.eyebrow,
    title: text(cms.title, fallback.title),
    lead: text(cms.lead, fallback.lead),
    // Narațiunea din CMS ÎNLOCUIEȘTE paragrafele din design, nu se adaugă la
    // ele: altfel pagina ar spune același lucru de două ori. Cât timp e goală,
    // se randează `paragraphs`, adică textul aprobat.
    narrative: hasRichText(cms.narrative) ? cms.narrative : null,
    paragraphs: fallback.paragraphs,
    portrait: {
      ...fallback.portrait,
      src: mediaUrl(cms.portrait) ?? fallback.portrait.src,
      alt: mediaAlt(cms.portrait, fallback.portrait.alt),
    },
    credentials: list(
      cms.credentials,
      (item) => ({ text: item.text, detail: item.detail ?? null }),
      fallback.credentials,
    ),
    principles: list(
      cms.principles,
      // Numerotarea e parte din design și se recalculează după ordinea reală.
      (item, index) => ({
        index: String(index + 1).padStart(2, '0'),
        title: item.title,
        body: item.body,
      }),
      fallback.principles,
    ),
    seo: seoOf(cms.seo),
  }
}

/** Un document Lexical are conținut dacă rădăcina lui are cel puțin un copil. */
function hasRichText(value: unknown): value is RichTextDocument {
  const root = (value as { root?: { children?: unknown } } | null)?.root
  return Array.isArray(root?.children) && root.children.length > 0
}

export async function getAboutContent(): Promise<AboutContent> {
  const payload = await getPayloadClientSafe()
  if (!payload) return aboutFallback

  try {
    const cms = await payload.findGlobal({ slug: 'about-page', depth: 1 })
    return mergeAbout(cms)
  } catch {
    return aboutFallback
  }
}

/* -------------------------------------------------------------------------- */
/* Pachete                                                                     */
/* -------------------------------------------------------------------------- */

function toPackageDetail(doc: Package, index: number): PackageDetail {
  /**
   * Textul aprobat al aceluiași pachet, dacă îl avem.
   *
   * Cât timp nimeni n-a scris descrierea lungă în admin, pagina pachetului
   * randează secțiunile verificate din `src/content/packages.ts` în loc să
   * arate un placeholder. Potrivirea se face pe slug, nu pe poziție: o
   * reordonare în admin nu are voie să mute descrierea de la un program la
   * altul.
   */
  const approved = packagesFallback.find((item) => item.slug === doc.slug)

  return {
    numeral: ROMAN[index] ?? String(index + 1),
    slug: doc.slug,
    href: `/servicii/${doc.slug}`,
    name: nullableText(doc.name, null),
    /*
      Linia de deasupra titlului, faptele scanabile, notele de investiție și
      textele butoanelor vin exclusiv din textul aprobat, exact ca `body`: sunt
      redactare de pagină de vânzare, nu date pe care cineva să le țină
      sincronizate în admin. Un pachet creat direct în CMS rămâne fără ele, iar
      pagina cade pe variantele generice — vezi `servicii/[slug]/page.tsx`.
    */
    kicker: approved?.kicker,
    tagline: nullableText(doc.tagline, null),
    highlights: approved?.highlights,
    investmentNotes: approved?.investmentNotes,
    cta: approved?.cta,
    forWho: nullableText(doc.forWho, null),
    includes:
      Array.isArray(doc.includes) && doc.includes.length > 0
        ? doc.includes.map((entry) => nullableText(entry.item, null))
        : (approved?.includes ?? [null, null, null]),
    duration: nullableText(doc.duration, null),
    format: doc.format ?? 'hibrid',
    price: doc.priceOnRequest !== true && typeof doc.price === 'number' ? doc.price : null,
    pricing: doc.priceOnRequest === true ? 'quote' : 'fixed',
    currency: CURRENCY,
    featured: doc.featured === true,
    longDescription: hasRichText(doc.longDescription) ? doc.longDescription : null,
    body: approved?.body,
    faq: list(
      doc.faq,
      (item) => ({ question: item.question, answer: item.answer }),
      approved?.faq ?? [],
    ),
    seo: seoOf(doc.seo),
  }
}

/**
 * Pachetele vizibile, în ordinea din admin.
 *
 * Fără CMS — bază de date oprită, colecție goală, toate pachetele ascunse —
 * se întorc cele trei programe aprobate din `src/content/packages.ts`. Este
 * aceeași regulă de îmbinare ca peste tot: CMS-ul are întâietate, dar numai
 * unde chiar a fost completat.
 *
 * Consecința importantă: `/servicii/[slug]` are rute și fără bază de date,
 * deci build-ul nu mai depinde de Postgres ca să producă paginile de pachet.
 */
export async function getPackages(): Promise<PackageDetail[]> {
  const payload = await getPayloadClientSafe()
  if (!payload) return publicPackagesFallback

  try {
    const result = await payload.find({
      collection: 'packages',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 12,
      depth: 1,
    })
    if (result.docs.length === 0) return publicPackagesFallback
    return result.docs.map(toPackageDetail)
  } catch {
    return publicPackagesFallback
  }
}

/* -------------------------------------------------------------------------- */
/* Workshopuri                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Catalogul de workshopuri, gata de randat.
 *
 * Ordinea și fereastra de înscriere NU se decid aici: `prepareWorkshops` le
 * calculează din date, iar regula e explicată o singură dată, în
 * `src/lib/workshops.ts`. Aici rămâne doar traducerea din documentul Payload
 * în tipul de conținut.
 */
export async function getWorkshops(): Promise<Workshop[]> {
  const payload = await getPayloadClientSafe()
  if (!payload) return prepareWorkshops(workshopEntries)

  try {
    const result = await payload.find({
      collection: 'workshops',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 50,
      depth: 0,
    })

    if (result.docs.length === 0) return prepareWorkshops(workshopEntries)

    const entries: WorkshopEntry[] = result.docs.map((doc) => ({
      slug: doc.slug,
      title: doc.title,
      subtitle: nullableText(doc.subtitle, '') ?? '',
      sessionDate: toIsoDay(doc.sessionDate),
      summary: nullableText(doc.summary, '') ?? '',
      what: nullableText(doc.what, '') ?? '',
      problems: nullableText(doc.problems, '') ?? '',
      workMethod: nullableText(doc.workMethod, '') ?? '',
      outcomes: list(doc.outcomes, (item) => item.item, []),
      keywords: list(doc.keywords, (item) => item.item, []),
    }))

    // Prețul rămâne per document: dacă Adriana schimbă prețul unui singur
    // workshop, cardul lui trebuie să îl arate pe al lui, nu pe cel comun.
    const prepared = prepareWorkshops(entries)
    const priceBySlug = new Map(
      result.docs.map((doc) => [doc.slug, typeof doc.price === 'number' ? doc.price : null]),
    )

    return prepared.map((workshop) => ({
      ...workshop,
      price: priceBySlug.get(workshop.slug) ?? workshop.price,
    }))
  } catch {
    return prepareWorkshops(workshopEntries)
  }
}

/**
 * Un workshop după slug, cu tot cu starea lui de înscriere.
 *
 * Trece prin `getWorkshops` intenționat: `purchasable` depinde de POZIȚIA
 * ediției față de celelalte, deci nu poate fi calculat dintr-un document
 * singur. Ruta de plată se bazează pe asta ca să refuze o ediție închisă.
 */
export async function getWorkshopBySlug(slug: string): Promise<Workshop | null> {
  const workshops = await getWorkshops()
  return workshops.find((item) => item.slug === slug) ?? null
}

/**
 * Data unei ediții, ca `AAAA-LL-ZZ`.
 *
 * Payload păstrează câmpurile `date` ca timestamp, chiar și când selectorul
 * arată doar ziua. Tăiem partea de oră din forma ISO în UTC — aceeași parte pe
 * care o scrie și selectorul, deci ziua se citește înapoi neschimbată.
 */
function toIsoDay(value: unknown): string | null {
  if (typeof value !== 'string' || value.length === 0) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString().slice(0, 10)
}

/* -------------------------------------------------------------------------- */
/* Recomandări                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Recomandările vizibile.
 *
 * `featured` filtrează doar secțiunea de pe homepage; pagina `/testimoniale`
 * le cere pe toate. Filtrarea se face aici, nu în interogare, pentru că sunt
 * trei documente — o a doua interogare ar costa mai mult decât filtrul.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const payload = await getPayloadClientSafe()
  if (!payload) return testimonials

  try {
    const result = await payload.find({
      collection: 'testimonials',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 30,
      depth: 0,
    })

    if (result.docs.length === 0) return testimonials

    return result.docs.map((doc, index) => ({
      slug: doc.slug,
      author: doc.author,
      role: nullableText(doc.role, null),
      context: nullableText(doc.context, null),
      excerpt: nullableText(doc.excerpt, '') ?? '',
      paragraphs: list(doc.paragraphs, (item) => item.text, []),
      featured: doc.featured !== false,
      order: typeof doc.order === 'number' ? doc.order : index,
    }))
  } catch {
    return testimonials
  }
}

/**
 * Un program după slug.
 *
 * Trece prin `getPackages` intenționat, ca `getWorkshopBySlug`: numerotarea
 * romană din design vine din POZIȚIA pachetului în listă, nu din document, iar
 * pagina de detaliu trebuie să arate același numeral ca homepage-ul.
 *
 * **Nu se pune aici o ieșire scurtă pe `getPayloadClientSafe()`.** A existat
 * una — `if (!payload) return null` — și era un 404 tăcut: `generateStaticParams`
 * producea cele trei rute din textul aprobat, iar funcția asta le refuza pe
 * toate imediat ce baza de date nu răspundea. Adică exact scenariul pe care
 * regula de îmbinare îl protejează peste tot altundeva. `getPackages` știe
 * deja să cadă pe `src/content/packages.ts`; aici nu mai e nimic de decis.
 */
export async function getPackageBySlug(slug: string): Promise<PackageDetail | null> {
  const packages = await getPackages()
  return packages.find((item) => item.slug === slug) ?? null
}

/**
 * Întrebările frecvente ale unei pagini.
 *
 * `ambele` înseamnă „și pe homepage, și pe servicii", deci intră în ambele
 * liste. Fără CMS, homepage-ul are întrebările din design, pagina de
 * workshopuri le are pe cele din catalog, iar pagina de servicii rămâne fără
 * secțiunea de FAQ — nu inventăm întrebări comerciale.
 */
export type FaqPage = 'homepage' | 'servicii' | 'workshopuri'

const faqFallback = (page: FaqPage): FaqItem[] => {
  if (page === 'homepage') return homeContent.faq.items
  if (page === 'workshopuri') return workshopsPage.faq
  return []
}

export async function getFaqs(page: FaqPage): Promise<FaqItem[]> {
  const payload = await getPayloadClientSafe()
  if (!payload) return faqFallback(page)

  try {
    const result = await payload.find({
      collection: 'faqs',
      where: { page: { in: [page, 'ambele'] } },
      sort: 'order',
      limit: 30,
      depth: 0,
    })

    if (result.docs.length === 0) return faqFallback(page)
    return mergeFaqItems(result.docs, [])
  } catch {
    return faqFallback(page)
  }
}

/* -------------------------------------------------------------------------- */
/* Articole                                                                    */
/* -------------------------------------------------------------------------- */

const PUBLISHED = { _status: { equals: 'published' } } as const

export type PostsPage = {
  posts: PostSummary[]
  total: number
  page: number
  totalPages: number
}

export async function getPosts({
  page = 1,
  perPage = 9,
  categorySlug,
}: { page?: number; perPage?: number; categorySlug?: string } = {}): Promise<PostsPage> {
  const empty: PostsPage = { posts: [], total: 0, page: 1, totalPages: 0 }

  const payload = await getPayloadClientSafe()
  if (!payload) return empty

  try {
    const result = await payload.find({
      collection: 'posts',
      where: categorySlug
        ? { and: [PUBLISHED, { 'category.slug': { equals: categorySlug } }] }
        : PUBLISHED,
      sort: '-publishedAt',
      page,
      limit: perPage,
      depth: 1,
    })

    return {
      posts: result.docs.map(toPostSummary),
      total: result.totalDocs,
      page: result.page ?? 1,
      totalPages: result.totalPages,
    }
  } catch {
    return empty
  }
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const payload = await getPayloadClientSafe()
  if (!payload) return null

  try {
    const result = await payload.find({
      collection: 'posts',
      where: { and: [PUBLISHED, { slug: { equals: slug } }] },
      limit: 1,
      // depth 2: articolele conexe au nevoie și de categoria lor, pentru card.
      depth: 2,
    })

    const doc = result.docs[0]
    if (!doc) return null

    return {
      ...toPostSummary(doc),
      content: doc.content,
      updatedAt: doc.updatedAt,
      faq: list(doc.faq, (item) => ({ question: item.question, answer: item.answer }), []),
      related: await relatedPosts(payload, doc),
      seo: seoOf(doc.seo),
    }
  } catch {
    return null
  }
}

/**
 * Cele trei articole conexe.
 *
 * Întâi cele alese manual; dacă nu ajung la trei, se completează din aceeași
 * categorie, cele mai recente. Un articol fără conexe ar rămâne o fundătură —
 * exact opusul a ce cere brief-ul de la blog.
 */
async function relatedPosts(
  payload: NonNullable<Awaited<ReturnType<typeof getPayloadClientSafe>>>,
  doc: Post,
): Promise<PostSummary[]> {
  const manual = (doc.relatedPosts ?? [])
    .filter((item): item is Post => typeof item === 'object' && item !== null)
    .filter((item) => item._status === 'published')
    .map(toPostSummary)

  if (manual.length >= 3) return manual.slice(0, 3)

  const categoryId = typeof doc.category === 'object' ? doc.category.id : doc.category

  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [
        PUBLISHED,
        { category: { equals: categoryId } },
        { id: { not_equals: doc.id } },
        { slug: { not_in: manual.map((item) => item.slug) } },
      ],
    },
    sort: '-publishedAt',
    limit: 3 - manual.length,
    depth: 1,
  })

  return [...manual, ...result.docs.map(toPostSummary)].slice(0, 3)
}

/** Slug-urile articolelor publicate — pentru `generateStaticParams`. */
export async function getPostSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  const payload = await getPayloadClientSafe()
  if (!payload) return []

  try {
    const result = await payload.find({
      collection: 'posts',
      where: PUBLISHED,
      sort: '-publishedAt',
      limit: 500,
      depth: 0,
    })
    return result.docs.map((doc) => ({ slug: doc.slug, updatedAt: doc.updatedAt }))
  } catch {
    return []
  }
}

/* -------------------------------------------------------------------------- */
/* Categorii                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Categoriile, cu numărul de articole publicate în fiecare.
 *
 * Numărătoarea se face cu `limit: 0` și se citește `totalDocs`: aduce cifra
 * fără să transfere documentele. Categoriile goale nu apar în filtre — un
 * filtru care duce la o pagină goală e o promisiune încălcată.
 */
export async function getCategories(): Promise<CategorySummary[]> {
  const payload = await getPayloadClientSafe()
  if (!payload) return []

  try {
    const result = await payload.find({
      collection: 'categories',
      sort: 'name',
      limit: 50,
      depth: 0,
    })

    const counted = await Promise.all(
      result.docs.map(async (doc) => {
        const posts = await payload.count({
          collection: 'posts',
          where: { and: [PUBLISHED, { 'category.slug': { equals: doc.slug } }] },
        })
        return {
          name: doc.name,
          slug: doc.slug,
          description: nullableText(doc.description, null),
          count: posts.totalDocs,
        }
      }),
    )

    return counted.filter((item) => item.count > 0)
  } catch {
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategorySummary | null> {
  const payload = await getPayloadClientSafe()
  if (!payload) return null

  try {
    const result = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })

    const doc = result.docs[0]
    if (!doc) return null

    const posts = await payload.count({
      collection: 'posts',
      where: { and: [PUBLISHED, { 'category.slug': { equals: slug } }] },
    })

    return {
      name: doc.name,
      slug: doc.slug,
      description: nullableText(doc.description, null),
      count: posts.totalDocs,
    }
  } catch {
    return null
  }
}

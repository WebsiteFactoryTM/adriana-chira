import type { FaqItem, SiteSettings, Testimonial, Workshop } from '@/content/types'

/**
 * Generatoare de date structurate.
 *
 * Regulă absolută (brief §8.3): marcajul reflectă exact ce vede utilizatorul.
 * Fără Q&A ascunse doar pentru schema — este penalizabil.
 */

type JsonLdObject = Record<string, unknown>

const PERSON_ID = '#adriana-chira'
const ORG_ID = '#serviciu'
const SITE_ID = '#site'

export function personSchema(settings: SiteSettings, portraitUrl?: string): JsonLdObject {
  const sameAs = settings.social.filter((item) => !item.pending).map((item) => item.href)

  return {
    '@type': 'Person',
    '@id': `${settings.url}/${PERSON_ID}`,
    name: settings.siteName,
    jobTitle: settings.role,
    url: settings.url,
    ...(portraitUrl ? { image: new URL(portraitUrl, settings.url).toString() } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    knowsAbout: [
      'performanță umană',
      'consultanță pentru antreprenori',
      'psihologie aplicată în business',
      'management strategic',
      'procese de decizie',
      'afaceri de familie',
    ],
    knowsLanguage: ['ro', 'en'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.city,
      addressRegion: settings.region,
      addressCountry: 'RO',
    },
  }
}

export function professionalServiceSchema(settings: SiteSettings): JsonLdObject {
  return {
    '@type': 'ProfessionalService',
    '@id': `${settings.url}/${ORG_ID}`,
    name: `${settings.siteName} — ${settings.role}`,
    url: settings.url,
    description:
      'Consultanță în performanță umană pentru antreprenori, profesioniști independenți, lideri și afaceri de familie: claritate, analiză comportamentală și decizii asumate.',
    areaServed: { '@type': 'Country', name: 'România' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.city,
      addressRegion: settings.region,
      addressCountry: 'RO',
    },
    founder: { '@id': `${settings.url}/${PERSON_ID}` },
    provider: { '@id': `${settings.url}/${PERSON_ID}` },
    availableLanguage: 'ro',
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
  }
}

export function websiteSchema(settings: SiteSettings): JsonLdObject {
  return {
    '@type': 'WebSite',
    '@id': `${settings.url}/${SITE_ID}`,
    name: settings.siteName,
    url: settings.url,
    inLanguage: 'ro-RO',
    publisher: { '@id': `${settings.url}/${PERSON_ID}` },
  }
}

/**
 * FAQPage. Textul răspunsurilor este identic cu cel vizibil în `<details>`,
 * inclusiv tabelul comparativ, care rămâne vizibil în pagină și nu este
 * duplicat aici — schema descrie doar textul, nu îl înlocuiește.
 */
export function faqSchema(items: FaqItem[], siteUrl: string, path = '/'): JsonLdObject {
  return {
    '@type': 'FAQPage',
    '@id': `${new URL(path, siteUrl).toString()}#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

/** Împachetează mai multe entități într-un singur `@graph`. */
export function graph(nodes: JsonLdObject[]): JsonLdObject {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

/* -------------------------------------------------------------------------- */
/* Paginile interioare (faza 3b)                                               */
/* -------------------------------------------------------------------------- */

/**
 * `BreadcrumbList`.
 *
 * Se construiește din ACEEAȘI listă care randează firul Ariadnei vizibil
 * (`<Breadcrumb>`), nu dintr-una paralelă — regula din brief §8.3: marcajul
 * reflectă exact ce vede utilizatorul.
 */
export function breadcrumbSchema(
  trail: { label: string; href: string }[],
  siteUrl: string,
): JsonLdObject {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: new URL(crumb.href, siteUrl).toString(),
    })),
  }
}

/** Pagina „Despre mine" — `ProfilePage`, cu `Person` ca subiect principal. */
export function profilePageSchema(settings: SiteSettings, path: string): JsonLdObject {
  return {
    '@type': 'ProfilePage',
    '@id': new URL(path, settings.url).toString(),
    url: new URL(path, settings.url).toString(),
    name: `Despre ${settings.siteName}`,
    inLanguage: 'ro-RO',
    mainEntity: { '@id': `${settings.url}/${PERSON_ID}` },
    isPartOf: { '@id': `${settings.url}/${SITE_ID}` },
  }
}

/**
 * `Article`.
 *
 * `dateModified` vine din `updatedAt`-ul real al documentului, nu din data
 * publicării: un articol corectat trebuie să spună că a fost corectat, altfel
 * marcajul minte. Autorul e mereu aceeași `Person`, prin referință.
 */
export function articleSchema(
  article: {
    title: string
    description: string
    path: string
    publishedAt: string
    updatedAt: string
    image?: string | null
    section?: string | null
    readingTime?: number
  },
  settings: SiteSettings,
): JsonLdObject {
  const url = new URL(article.path, settings.url).toString()

  return {
    '@type': 'Article',
    '@id': url,
    headline: article.title,
    description: article.description,
    url,
    inLanguage: 'ro-RO',
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@id': `${settings.url}/${PERSON_ID}` },
    publisher: { '@id': `${settings.url}/${PERSON_ID}` },
    isPartOf: { '@id': `${settings.url}/${SITE_ID}` },
    mainEntityOfPage: url,
    ...(article.image ? { image: new URL(article.image, settings.url).toString() } : {}),
    ...(article.section ? { articleSection: article.section } : {}),
    ...(article.readingTime
      ? { timeRequired: `PT${article.readingTime}M`, wordCount: article.readingTime * 200 }
      : {}),
  }
}

/**
 * `Service` pentru un pachet.
 *
 * Oferta se marchează DOAR dacă pachetul are preț real. Un `Offer` cu preț zero
 * sau lipsă e mai rău decât niciun `Offer`: Google îl arată în rezultate.
 */
export function serviceSchema(
  pkg: {
    name: string
    description: string
    path: string
    price: number | null
    currency: string
    duration?: string | null
  },
  settings: SiteSettings,
): JsonLdObject {
  const url = new URL(pkg.path, settings.url).toString()

  return {
    '@type': 'Service',
    '@id': url,
    name: pkg.name,
    description: pkg.description,
    url,
    serviceType: 'Consultanță în performanță umană',
    provider: { '@id': `${settings.url}/${ORG_ID}` },
    areaServed: { '@type': 'Country', name: 'România' },
    availableLanguage: 'ro',
    ...(pkg.price !== null
      ? {
          offers: {
            '@type': 'Offer',
            price: pkg.price,
            priceCurrency: pkg.currency,
            url,
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  }
}

/* -------------------------------------------------------------------------- */
/* Workshopuri                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * `Event` pentru o ediție de workshop.
 *
 * Se emite DOAR pentru edițiile cu dată. Un `Event` fără `startDate` este
 * invalid, iar unul cu o dată inventată („peste trei luni") ar fi mai rău:
 * Google afișează evenimentele în rezultate, cu ziua lor, iar o zi greșită
 * ajunge în calendarul cuiva.
 *
 * `offers` apare numai pe edițiile deschise la înscriere. Restul catalogului
 * primește `availability: PreOrder`, care descrie exact situația reală: ediția
 * există, dar încă nu se poate cumpăra un loc la ea.
 *
 * Orele sunt cele din catalog — 09:00–17:00, ora României. Ofsetul e scris
 * explicit, nu dedus din fusul serverului, care pe Vercel e UTC.
 */
export function workshopEventSchema(
  workshop: Workshop,
  settings: SiteSettings,
  path: string,
): JsonLdObject | null {
  if (!workshop.sessionDate) return null

  const url = new URL(`${path}#${workshop.slug}`, settings.url).toString()
  // România e pe +03:00 din ultima duminică din martie până în ultima din
  // octombrie, +02:00 în rest. Workshopurile încep la 09:00, ora locală.
  const offset = isSummerTime(workshop.sessionDate) ? '+03:00' : '+02:00'

  return {
    '@type': 'Event',
    '@id': url,
    name: `${workshop.title} — ${workshop.subtitle}`,
    description: workshop.summary,
    url,
    startDate: `${workshop.sessionDate}T09:00:00${offset}`,
    endDate: `${workshop.sessionDate}T17:00:00${offset}`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    inLanguage: 'ro-RO',
    location: {
      '@type': 'Place',
      name: `Workshop în ${settings.city}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: settings.city,
        addressRegion: settings.region,
        addressCountry: 'RO',
      },
    },
    organizer: { '@id': `${settings.url}/${ORG_ID}` },
    performer: { '@id': `${settings.url}/${PERSON_ID}` },
    offers: {
      '@type': 'Offer',
      price: workshop.price,
      priceCurrency: workshop.currency,
      url,
      availability: workshop.purchasable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
    },
  }
}

/**
 * Ora de vară a României, pentru o zi dată.
 *
 * Se calculează, nu se citește dintr-o bibliotecă de fusuri: ne trebuie o
 * singură regulă, iar cea europeană e fixă — de la ultima duminică din martie,
 * ora 01:00 UTC, până la ultima duminică din octombrie.
 */
function isSummerTime(isoDay: string): boolean {
  const date = new Date(`${isoDay}T12:00:00Z`)
  const year = date.getUTCFullYear()
  const lastSunday = (month: number): Date => {
    // Ziua 0 a lunii următoare = ultima zi a lunii cerute.
    const last = new Date(Date.UTC(year, month + 1, 0, 1))
    last.setUTCDate(last.getUTCDate() - last.getUTCDay())
    return last
  }
  return date >= lastSunday(2) && date < lastSunday(9)
}

/* -------------------------------------------------------------------------- */
/* Recomandări                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * `Review`, câte unul pentru fiecare recomandare AFIȘATĂ pe pagina curentă.
 *
 * **Fără `reviewRating` și fără `aggregateRating`, deliberat.** Niciunul dintre
 * cei trei oameni nu a fost rugat să dea o notă, deci orice cifră ar fi
 * inventată de noi. `Review` fără rating este perfect valid în schema.org;
 * un `aggregateRating` fabricat este exact motivul pentru care Google dă
 * penalizări manuale pe date structurate înșelătoare.
 *
 * `reviewBody` primește FRAZA VIZIBILĂ pe pagina care emite marcajul, nu
 * textul integral — regula din brief §8.3: marcajul descrie ce vede omul.
 */
export function reviewSchemas(
  items: Testimonial[],
  settings: SiteSettings,
  path: string,
  options: { full?: boolean } = {},
): JsonLdObject[] {
  return items.map((item) => ({
    '@type': 'Review',
    '@id': new URL(`${path}#${item.slug}`, settings.url).toString(),
    itemReviewed: { '@id': `${settings.url}/${ORG_ID}` },
    author: {
      '@type': 'Person',
      name: item.author,
      ...(item.role ? { jobTitle: item.role } : {}),
    },
    reviewBody: options.full ? item.paragraphs.join('\n\n') : item.excerpt,
    inLanguage: 'ro-RO',
    publisher: { '@id': `${settings.url}/${PERSON_ID}` },
  }))
}

/** Pagina de contact. */
export function contactPageSchema(settings: SiteSettings, path: string): JsonLdObject {
  const url = new URL(path, settings.url).toString()

  return {
    '@type': 'ContactPage',
    '@id': url,
    url,
    name: `Contact — ${settings.siteName}`,
    inLanguage: 'ro-RO',
    isPartOf: { '@id': `${settings.url}/${SITE_ID}` },
    mainEntity: { '@id': `${settings.url}/${PERSON_ID}` },
  }
}

/**
 * O pagină de listă: blogul, o categorie, lista de servicii.
 *
 * `ItemList` conține exact articolele randate pe pagina curentă, în ordinea în
 * care apar. O listă care ar promite mai mult decât se vede ar fi tot o
 * neconcordanță între marcaj și pagină.
 */
export function collectionPageSchema(
  page: {
    name: string
    description: string
    path: string
    items: { name: string; path: string }[]
  },
  settings: SiteSettings,
): JsonLdObject {
  const url = new URL(page.path, settings.url).toString()

  return {
    '@type': 'CollectionPage',
    '@id': url,
    url,
    name: page.name,
    description: page.description,
    inLanguage: 'ro-RO',
    isPartOf: { '@id': `${settings.url}/${SITE_ID}` },
    ...(page.items.length > 0
      ? {
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: page.items.length,
            itemListElement: page.items.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              url: new URL(item.path, settings.url).toString(),
            })),
          },
        }
      : {}),
  }
}

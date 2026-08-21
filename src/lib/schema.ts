import type { FaqItem, SiteSettings } from '@/content/types'

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
export function faqSchema(items: FaqItem[], siteUrl: string): JsonLdObject {
  return {
    '@type': 'FAQPage',
    '@id': `${siteUrl}/#faq`,
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

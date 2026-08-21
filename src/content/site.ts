import type { SiteSettings } from './types'

/**
 * Setările site-ului. Migrează în globalul Payload `site-settings` (faza 2).
 *
 * Valorile marcate `null` sunt cele care blochează lansarea (brief §13):
 * email, telefon, date de firmă, conturi sociale. UI-ul le tratează explicit
 * ca placeholdere — nu inventăm date de contact.
 */
export const siteSettings: SiteSettings = {
  siteName: 'Adriana Chira',
  role: 'Consultant în Performanță Umană',
  tagline: 'Claritate înainte de decizie.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://adrianachira.ro',
  locale: 'ro-RO',

  email: null, // [ DE CONFIRMAT ] brief §13.4
  phone: null, // [ DE CONFIRMAT ] brief §13.4
  city: 'Timișoara',
  region: 'Timiș',
  country: 'România',

  /**
   * NOTĂ DESIGN: header-ul din demo scrie „Perspective", dar footerul aceluiași
   * demo și brief §4.3 impun „Blog" în navigație și în rute (cerință de proiect
   * + SEO). Am păstrat „Blog", forma consecventă. Se schimbă dintr-un singur loc.
   *
   * NOTĂ RUTARE: demo-ul aprobat este o pagină unică, deci țintele sunt ancore
   * pe homepage. La intrarea paginilor interioare (faza 3) se înlocuiesc cu
   * `/despre`, `/servicii`, `/blog`, `/contact` — tot de aici, dintr-un loc.
   */
  nav: [
    { label: 'Despre mine', href: '#despre' },
    { label: 'Servicii', href: '#servicii' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#cta' },
  ],

  mobileNav: [
    { label: 'Despre mine', href: '#despre' },
    { label: 'Servicii', href: '#servicii' },
    { label: 'Blog', href: '#blog' },
    { label: 'Întrebări frecvente', href: '#faq' },
  ],

  footerNav: [
    { label: 'Acasă', href: '#hero' },
    { label: 'Despre mine', href: '#despre' },
    { label: 'Servicii', href: '#servicii' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#cta' },
  ],

  legalNav: [
    { label: 'Politica de confidențialitate', href: '/politica-de-confidentialitate' },
    { label: 'Politica de cookie-uri', href: '/politica-de-cookies' },
    { label: 'Termeni și condiții', href: '/termeni-si-conditii' },
    { label: 'Politica de retur', href: '/politica-de-retur' },
  ],

  social: [
    { label: 'LinkedIn', href: '#', pending: true },
    { label: 'Instagram', href: '#', pending: true },
    { label: 'Facebook', href: '#', pending: true },
  ],

  company: {
    legalName: null, // [ DE CONFIRMAT ] brief §13.6
    cui: null,
    regCom: null,
    registeredAddress: null,
  },

  bookingUrl: null, // Cal.com / Calendly — se încarcă doar la click (brief §10.2)
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_ID ?? null,

  responseTime: 'Răspund în maximum 24 de ore lucrătoare',
  availability: 'Timișoara și online · Răspund în 24 h',
}

/** Ancorele secțiunilor de pe homepage. Ordinea este cea din designul aprobat. */
export const HOME_SECTION_IDS = [
  'hero',
  'problema',
  'metoda',
  'pentru-cine',
  'univers',
  'despre',
  'valori',
  'citat',
  'servicii',
  'blog',
  'faq',
  'cta',
] as const

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number]

import { SITE_URL } from '@/lib/site-url'
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
  url: SITE_URL,
  locale: 'ro-RO',

  // Confirmate de clientă pe 1 octombrie 2026. Din admin (`site-settings`) se
  // pot suprascrie fără deploy; câmpurile goale acolo cad pe acestea.
  email: 'contact@adrianachira.ro',
  phone: '+40 723 573 123',
  city: 'Timișoara',
  region: 'Timiș',
  country: 'România',

  /**
   * NOTĂ DESIGN: header-ul din demo scrie „Perspective", dar footerul aceluiași
   * demo și brief §4.3 impun „Blog" în navigație și în rute (cerință de proiect
   * + SEO). Am păstrat „Blog", forma consecventă. Se schimbă dintr-un singur loc.
   *
   * NOTĂ RUTARE: până la faza 3b, demo-ul aprobat era o pagină unică și
   * țintele erau ancore pe homepage. Odată cu paginile interioare, navigația
   * duce la rute reale — tot de aici, dintr-un singur loc. Întrebările
   * frecvente rămân ancoră: trăiesc pe homepage, n-au pagină proprie.
   */
  /**
   * NOTĂ DESIGN: „Workshopuri" este a cincea intrare din navigație, iar
   * designul aprobat are patru. Nu contrazice designul — îl extinde: la
   * momentul aprobării, workshopurile nu existau ca ofertă. Sunt al doilea
   * lucru vandabil din site, cu pagină și preț propriu, iar o linie de produs
   * care nu apare în navigație nu se vinde. Măsurat la 1000px, pragul la care
   * apare navigația pe desktop, cele cinci intrări plus butonul de programare
   * încap fără să se rupă rândul.
   *
   * Eticheta e scurtă, deși adresa e lungă: adresa poartă expresia căutată în
   * Google, meniul poartă cuvântul pe care îl caută omul cu ochiul.
   */
  nav: [
    { label: 'Despre mine', href: '/despre' },
    { label: 'Servicii', href: '/servicii' },
    { label: 'Workshopuri', href: '/workshopuri-performanta-umana' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],

  mobileNav: [
    { label: 'Despre mine', href: '/despre' },
    { label: 'Servicii', href: '/servicii' },
    { label: 'Workshopuri', href: '/workshopuri-performanta-umana' },
    { label: 'Recomandări', href: '/testimoniale' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'Întrebări frecvente', href: '/#faq' },
  ],

  footerNav: [
    { label: 'Acasă', href: '/' },
    { label: 'Despre mine', href: '/despre' },
    { label: 'Servicii', href: '/servicii' },
    { label: 'Workshopuri', href: '/workshopuri-performanta-umana' },
    { label: 'Recomandări', href: '/testimoniale' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
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

  /**
   * Operatorul de date și vânzătorul. Denumirea și sediul vin din modelul de
   * politică de confidențialitate trimis de clientă pe 1 octombrie 2026 (același
   * telefon ca al Adrianei). CUI-ul și nr. de înregistrare NU apar acolo și nu
   * se ghicesc: rămân placeholdere vizibile până se completează în admin
   * (blocaj §7.6 din STATUS.md).
   */
  company: {
    legalName: 'Adrenalin Mirific Concept SRL',
    cui: null, // [ DE CONFIRMAT ] brief §13.6
    regCom: null, // [ DE CONFIRMAT ] brief §13.6
    registeredAddress: 'Str. Nicolae Titulescu nr. 62, Vulcan, jud. Hunedoara',
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
  // A treisprezecea secțiune, adăugată pe 7 septembrie 2026 la cererea
  // clientei. Nu există în designul aprobat — vezi `sections/Testimoniale.tsx`.
  // Se ascunde singură când nu există recomandări marcate pentru prima pagină,
  // deci nu are nevoie de comutator propriu în CMS.
  'testimoniale',
  'servicii',
  'blog',
  'faq',
  'cta',
] as const

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number]

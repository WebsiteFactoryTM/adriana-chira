/**
 * Contractul de conținut al site-ului.
 *
 * Componentele consumă EXCLUSIV aceste tipuri, niciodată o sursă concretă.
 * Astăzi datele vin din `src/content/*.ts`. Când intră Payload (faza 2),
 * se schimbă doar resolverele din `src/lib/content.ts` — zero atingeri în UI.
 */

export type NavItem = {
  label: string
  href: string
}

export type SocialLink = {
  label: string
  href: string
  /** Marchează valorile care încă așteaptă confirmarea clientei. */
  pending?: boolean
}

export type SiteSettings = {
  siteName: string
  role: string
  tagline: string
  url: string
  locale: string
  email: string | null
  phone: string | null
  city: string
  region: string
  country: string
  nav: NavItem[]
  /** Meniul mobil are o listă proprie în designul aprobat (include FAQ). */
  mobileNav: NavItem[]
  footerNav: NavItem[]
  legalNav: NavItem[]
  social: SocialLink[]
  company: {
    legalName: string | null
    cui: string | null
    regCom: string | null
    registeredAddress: string | null
  }
  bookingUrl: string | null
  ga4MeasurementId: string | null
  responseTime: string
  availability: string
}

export type Eyebrow = {
  text: string
  /** `line` = liniuță statică; `pulse` = punct pulsant + fascicul (design v3). */
  ornament: 'line' | 'pulse' | 'none'
}

export type HeroContent = {
  eyebrow: Eyebrow
  /** Fiecare rând se animează separat, cu decalaj de 110ms. */
  headlineLines: string[]
  lead: string
  intro: string
  primaryCta: NavItem
  secondaryCta: NavItem
  badges: string[]
  portrait: ImageSlotContent
}

export type ImageSlotContent = {
  slot: 'hero-portrait' | 'about-portrait' | 'post-cover'
  src: string | null
  alt: string
  width: number
  height: number
  /** Etichetă afișată în placeholder cât timp nu există fotografie. */
  placeholderLabel: string
  objectPosition?: string
  caption?: string
  captionLead?: string
}

export type NumberedItem = {
  index: string
  title?: string
  body?: string
}

export type ProblemaContent = {
  eyebrow: Eyebrow
  heading: string
  body: string
  signs: NumberedItem[]
}

export type MetodaContent = {
  eyebrow: Eyebrow
  heading: string
  body: string
  steps: NumberedItem[]
}

export type PentruCineContent = {
  eyebrow: Eyebrow
  heading: string
  aside: string
  segments: { title: string; body: string }[]
}

export type UniversContent = {
  eyebrow: Eyebrow
  heading: string
  body: string
  note: string
  items: { numeral: string; title: string; trademark?: boolean; body: string }[]
}

export type DespreContent = {
  eyebrow: Eyebrow
  heading: string
  paragraphs: string[]
  credentials: string[]
  link: NavItem
  portrait: ImageSlotContent
}

export type ValoriContent = {
  eyebrow: Eyebrow
  values: { index: string; title: string; body: string }[]
}

export type CitatContent = {
  lines: string[]
  attribution: string
}

export type PackagePreview = {
  numeral: string
  name: string | null
  tagline: string | null
  forWho: string | null
  includes: (string | null)[]
  duration: string | null
  price: number | null
  currency: string
  href: string
  featured: boolean
}

export type ServiciiContent = {
  eyebrow: Eyebrow
  heading: string
  intro: string
  packages: PackagePreview[]
  reassurance: string[]
  footerLink: NavItem
}

export type PostPreview = {
  title: string
  href: string
  category: string
  excerpt: string
  publishedAt: string
  readingTime: number
  cover: ImageSlotContent
}

export type BlogContent = {
  eyebrow: Eyebrow
  heading: string
  link: NavItem
  posts: PostPreview[]
}

export type ComparisonTable = {
  caption: string
  columns: string[]
  rows: { label: string; cells: string[] }[]
}

export type FaqItem = {
  question: string
  answer: string
  defaultOpen?: boolean
  table?: ComparisonTable
}

export type FaqContent = {
  eyebrow: Eyebrow
  heading: string
  items: FaqItem[]
}

export type CtaContent = {
  eyebrow: Eyebrow
  heading: string
  body: string
  cta: NavItem
  note: string
}

export type HomeContent = {
  hero: HeroContent
  problema: ProblemaContent
  metoda: MetodaContent
  pentruCine: PentruCineContent
  univers: UniversContent
  despre: DespreContent
  valori: ValoriContent
  citat: CitatContent
  servicii: ServiciiContent
  blog: BlogContent
  faq: FaqContent
  cta: CtaContent
}

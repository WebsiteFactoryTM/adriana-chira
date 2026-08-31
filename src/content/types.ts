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
  slot: 'hero-portrait' | 'about-portrait' | 'post-cover' | 'page-portrait' | 'page-wide'
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
  /**
   * Ruta categoriei. Lipsește pe cardurile din designul aprobat — demo-ul nu
   * are pagini de categorie — și apare pe cele venite din CMS.
   */
  categoryHref?: string
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

/* -------------------------------------------------------------------------- */
/* Paginile interioare (faza 3b)                                               */
/* -------------------------------------------------------------------------- */

/**
 * Conținut Lexical, așa cum îl livrează Payload.
 *
 * `unknown` intenționat: `RichText` parcurge arborele defensiv, iar contractul
 * de conținut nu trebuie să depindă de forma internă a editorului — s-a
 * schimbat deja între versiuni de Lexical.
 */
export type RichTextDocument = { root?: unknown } | null

/** Suprascrierile de SEO per document. Gol = se folosesc titlul și rezumatul. */
export type SeoOverrides = {
  metaTitle: string | null
  metaDescription: string | null
  ogImage: string | null
  noIndex: boolean
}

export type Credential = {
  text: string
  detail: string | null
}

export type Principle = {
  index: string
  title: string
  body: string
}

export type AboutContent = {
  eyebrow: Eyebrow
  title: string
  lead: string
  /** Narațiunea din CMS. Lipsă → se randează `paragraphs`, textul din design. */
  narrative: RichTextDocument
  paragraphs: string[]
  portrait: ImageSlotContent
  credentials: Credential[]
  principles: Principle[]
  seo: SeoOverrides
}

export type CategorySummary = {
  name: string
  slug: string
  description: string | null
  /** Câte articole publicate are. Categoriile goale nu se afișează în filtre. */
  count: number
}

export type PostSummary = {
  title: string
  slug: string
  href: string
  excerpt: string
  category: { name: string; slug: string } | null
  publishedAt: string
  readingTime: number
  cover: ImageSlotContent
}

export type QaItem = {
  question: string
  answer: string
}

export type PostDetail = PostSummary & {
  content: RichTextDocument
  updatedAt: string
  faq: QaItem[]
  related: PostSummary[]
  seo: SeoOverrides
}

export type PackageDetail = {
  numeral: string
  slug: string
  href: string
  name: string | null
  tagline: string | null
  forWho: string | null
  includes: (string | null)[]
  duration: string | null
  format: 'online' | 'fata-in-fata' | 'hibrid'
  price: number | null
  currency: string
  featured: boolean
  longDescription: RichTextDocument
  faq: QaItem[]
  seo: SeoOverrides
}

/** O pagină cu text fix: legalele, mulțumirile, comanda anulată. */
export type StaticPage = {
  slug: string
  eyebrow: Eyebrow
  title: string
  lead: string
  /** Data ultimei revizuiri, afișată pe paginile legale. */
  updatedAt: string | null
  sections: { heading: string; paragraphs: string[]; list?: string[] }[]
}

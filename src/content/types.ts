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
  /**
   * Submeniul intrării, în antet și în meniul mobil.
   *
   * NU se scrie în `src/content/site.ts`: cele două submeniuri existente —
   * programele și workshopurile — sunt conținut viu (un program nou în admin,
   * o ediție căreia i s-a pus dată) și se atașează pe server, în
   * `src/lib/nav.ts`. Navigația statică rămâne lista de rute; submeniul e
   * derivat din ce se vinde astăzi.
   */
  children?: NavItem[]
  /** Rândul mic de sub etichetă, în submeniu: durata, prețul, data ediției. */
  detail?: string
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

/**
 * O secțiune din descrierea lungă a unui pachet, în forma de rezervă.
 *
 * Există pentru că `longDescription` este rich text venit din Payload, iar un
 * document Lexical scris de mână în TypeScript e nelizibil și imposibil de
 * corectat. Textul aprobat al celor trei programe stă deci structurat, în
 * `src/content/packages.ts`, iar pagina randează rich text-ul din CMS doar
 * atunci când chiar există.
 */
/**
 * Cum se vede o secțiune din descrierea lungă.
 *
 * Nu e o preferință de stil, ci o afirmație despre conținut — de aceea stă în
 * `src/content/`, lângă text, și nu în componentă. O listă de simptome în care
 * cititorul se caută pe sine (`checklist`) și o listă de rezultate pe care le
 * primește (`outcomes`) se citesc complet diferit, chiar dacă amândouă sunt
 * `string[]`. Randate identic — cum erau —, pagina devine documentul Word din
 * care a venit textul.
 *
 * | Fel | Ce e | Cum arată |
 * |---|---|---|
 * | `prose` | narațiune | o coloană îngustă, ritmul de articol |
 * | `checklist` | situații în care te recunoști | grilă de rânduri cu bifă |
 * | `cards` | lucruri care stau alături, nu în ordine | carduri, 2–3 pe rând |
 * | `steps` | etape parcurse în ordine | proces vertical, numerotat |
 * | `outcomes` | ce primești la final | rânduri numerotate, cu romb |
 * | `split` | aceeași întrebare, două răspunsuri | două coloane opuse |
 * | `statement` | promisiune, principiu | citat pe bloc întunecat |
 */
export type PackageSectionKind =
  | 'prose'
  | 'checklist'
  | 'cards'
  | 'steps'
  | 'outcomes'
  | 'split'
  | 'statement'

export type PackageSection = {
  heading: string
  /** Implicit `prose`, ca secțiunile vechi să rămână valide fără atingere. */
  kind?: PackageSectionKind
  /**
   * Fundalul benzii. Lipsă = alternanță automată hârtie / crem.
   *
   * Se scrie doar când banda trebuie să iasă din alternanță — de obicei
   * niciodată: alternanța există tocmai ca nimeni să nu numere secțiunile.
   */
  tone?: 'paper' | 'cream'
  paragraphs?: string[]
  list?: string[]
  /**
   * Etichetele celor două coloane la `split`. Prima e cazul favorabil.
   *
   * Sunt singurul text pe care îl adaugă prezentarea, și adaugă doar un nume
   * pentru ceva ce paragraful spunea deja în prima frază.
   */
  splitLabels?: [string, string]
  /** Blocuri numerotate: metoda CLAR, dimensiunile HPA, etapele procesului. */
  steps?: { index: string; title: string; body: string }[]
}

/**
 * CTA-urile paginii unui program.
 *
 * Fiecare document livrat de clientă își numește singur butoanele — „Aplică
 * pentru programul CLAR™", „Programează Strategic Performance Assessment™",
 * „Rezervă-ți locul" — și nu sunt interschimbabile: un buton care spune ce
 * urmează („aplici", „programezi", „rezervi") convertește altfel decât unul
 * generic. De aceea textele stau în conținut, lângă program, nu în componentă.
 */
export type PackageCta = {
  /** Butonul de plată, în coloana de achiziție și în banda de investiție. */
  buy: string
  /** Calea fără plată online, de sub buton. */
  ask: string
  /** Blocul final al paginii. */
  finalEyebrow: string
  finalHeading: string
  finalBody: string
  finalLabel: string
}

export type PackageDetail = {
  numeral: string
  slug: string
  href: string
  name: string | null
  /**
   * Linia de deasupra titlului. Poartă expresia căutată în Google, în timp ce
   * `h1` rămâne numele programului — adică termenul de brand pe care oamenii
   * îl caută după ce l-au auzit o dată.
   */
  kicker?: string
  tagline: string | null
  /** Faptele scanabile de sub lead: durată, format, ce primești la final. */
  highlights?: string[]
  forWho: string | null
  includes: (string | null)[]
  duration: string | null
  format: 'online' | 'fata-in-fata' | 'hibrid'
  price: number | null
  currency: string
  /** Ce acoperă prețul, tranșele, factura pe firmă. Banda de investiție. */
  investmentNotes?: string[]
  cta?: PackageCta
  featured: boolean
  longDescription: RichTextDocument
  /** Descrierea aprobată, folosită când CMS-ul n-a primit încă rich text. */
  body?: PackageSection[]
  faq: QaItem[]
  seo: SeoOverrides
}

/* -------------------------------------------------------------------------- */
/* Workshopuri                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Un workshop, așa cum e scris în catalog sau în CMS.
 *
 * Ce NU e aici: durata, programul zilei, prețul, „Cum se desfășoară" și
 * „Pentru cine" — sunt identice la toate cele 14 și stau o singură dată, în
 * `WORKSHOP_COMMON` (vezi `src/content/workshops.ts`).
 */
export type WorkshopEntry = {
  slug: string
  /** Titlul creativ. Devine `h3` pe card. */
  title: string
  /** Competența căutată în Google. Devine subtitlul de sub titlu. */
  subtitle: string
  /** Data ediției, ISO `AAAA-LL-ZZ`. `null` = încă neprogramat. */
  sessionDate: string | null
  /** Una-două fraze pe card, înainte de „Citește tot programul". */
  summary: string
  what: string
  problems: string
  /** Fraza proprie despre ce se lucrează efectiv în ziua respectivă. */
  workMethod: string
  outcomes: string[]
  /** Expresiile-cheie recomandate de clientă. Nu se randează în pagină. */
  keywords: string[]
}

/**
 * Un workshop pregătit pentru randare.
 *
 * `purchasable` NU vine din CMS: se calculează din dată, în `lib/workshops.ts`.
 * Sunt de vânzare întotdeauna doar următoarele trei ediții programate.
 */
export type Workshop = WorkshopEntry & {
  numeral: string
  href: string
  price: number
  currency: string
  purchasable: boolean
  /** Ediția are dată, dar nu a intrat (încă) în fereastra de înscriere. */
  scheduled: boolean
}

export type WorkshopAgendaRow = { time: string; body: string }

export type WorkshopsPageContent = {
  eyebrow: Eyebrow
  title: string
  lead: string
  intro: string
  positioning: string
  image: ImageSlotContent
  metaTitle: string
  metaDescription: string
  faq: FaqItem[]
}

/* -------------------------------------------------------------------------- */
/* Recomandări                                                                 */
/* -------------------------------------------------------------------------- */

export type Testimonial = {
  slug: string
  author: string
  /**
   * Funcția și organizația. `null` când autorul nu și-a trecut una.
   *
   * Nu e o scăpare de modelare: nu toate recomandările vin semnate cu o
   * funcție, iar a completa noi una ar însemna să atribuim unui om real o
   * poziție pe care nu a declarat-o. Cardul și pagina o omit pur și simplu.
   */
  role: string | null
  /** În ce context a lucrat autorul cu Adriana. Scurt, factual. */
  context: string | null
  /** Fraza scoasă în evidență. COPIATĂ din `paragraphs`, nu rezumată. */
  excerpt: string
  paragraphs: string[]
  /** Apare în secțiunea de pe homepage. */
  featured: boolean
  order: number
}

export type TestimonialsPageContent = {
  eyebrow: Eyebrow
  title: string
  lead: string
  metaDescription: string
  note: string
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

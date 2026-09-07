import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { homeContent } from '@/content/home'
import { packagesFallback } from '@/content/packages'
import { aboutFallback } from '@/content/pages'
import { siteSettings } from '@/content/site'
import { testimonials } from '@/content/testimonials'
import { WORKSHOP_PRICE, workshopEntries, workshopsPage } from '@/content/workshops'
import { slugify } from '@/fields/slug'

/**
 * Popularea inițială a bazei de date.
 *
 * Rulează cu `pnpm seed`. Este IDEMPOTENT: a doua rulare nu duplică nimic și nu
 * suprascrie textele pe care le-a schimbat cineva în admin — actualizează doar
 * documentele pe care le-a creat tot el, identificate după slug.
 *
 * Textele NU sunt scrise aici. Vin din `src/content/home.ts` și
 * `src/content/site.ts`, adică exact valorile verificate nod-cu-nod față de
 * `design/homepage-approved.html` (STATUS.md §6). Dacă seed-ul și-ar ține
 * propria copie a textelor, cele două ar diverge la prima corectură.
 *
 * Ce NU populează, și de ce:
 *
 * - **Corpul articolelor.** Designul aprobat conține titlurile, rezumatele și
 *   categoriile a trei articole; textul lor nu a fost livrat. Le creăm ca
 *   CIORNE, ca Adriana să le găsească începute în admin. Ciornele nu sunt
 *   publice, deci homepage-ul continuă să arate exact ca în design.
 * - **Descrierea lungă a pachetelor** (`longDescription`, rich text). Rămâne
 *   goală intenționat, ca pagina să randeze secțiunile structurate din
 *   `src/content/packages.ts`. Motivul complet e la `seedPackages`.
 * - **Datele de contact reale.** Sunt `null` în `src/content/site.ts` și rămân
 *   `null` aici. Nu inventăm date de client (regula 11 din STATUS.md §2).
 *
 * Ce populează, din septembrie 2026: cele trei programe individuale VIZIBILE, cu
 * preț real în lei; cele 14 workshopuri, dintre care trei cu dată; cele trei
 * recomandări. Blocajul §7.1 s-a ridicat — pachetele nu mai sunt placeholdere.
 */

type SeedStats = { create: number; update: number; skip: number }

const stats: Record<string, SeedStats> = {}

function record(bucket: string, action: keyof SeedStats): void {
  const entry = (stats[bucket] ??= { create: 0, update: 0, skip: 0 })
  entry[action] += 1
}

/**
 * Creează documentul dacă nu există, altfel îl actualizează.
 *
 * Cheia de identificare este un câmp unic (`slug` peste tot, `question` la
 * întrebările frecvente). Fără o astfel de cheie, „idempotent" ar însemna
 * „compară toate câmpurile", ceea ce ar rescrie la fiecare rulare exact ce a
 * editat clienta.
 */
async function upsert(
  payload: Payload,
  args: {
    collection: 'categories' | 'faqs' | 'packages' | 'posts' | 'testimonials' | 'workshops'
    keyField: string
    keyValue: string
    data: Record<string, unknown>
    /** Câmpuri actualizate doar la creare — restul rămân ale editorului. */
    createOnly?: boolean
    draft?: boolean
  },
): Promise<{ id: number | string }> {
  const { collection, keyField, keyValue, data, createOnly, draft } = args

  const existing = await payload.find({
    collection,
    where: { [keyField]: { equals: keyValue } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    ...(collection === 'posts' ? { draft: true } : {}),
  })

  const first = existing.docs[0]

  if (first) {
    if (createOnly) {
      record(collection, 'skip')
      return { id: first.id }
    }
    const updated = await payload.update({
      collection,
      id: first.id,
      data,
      overrideAccess: true,
      depth: 0,
      ...(draft === undefined ? {} : { draft }),
    })
    record(collection, 'update')
    return { id: updated.id }
  }

  const created = await payload.create({
    collection,
    data: data as never,
    overrideAccess: true,
    depth: 0,
    ...(draft === undefined ? {} : { draft }),
  })
  record(collection, 'create')
  return { id: created.id }
}

/* -------------------------------------------------------------------------- */
/* Utilizatorul administrator                                                  */
/* -------------------------------------------------------------------------- */

async function seedAdminUser(payload: Payload): Promise<void> {
  const existing = await payload.find({
    collection: 'users',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.totalDocs > 0) {
    record('users', 'skip')
    return
  }

  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@adrianachira.ro'
  const provided = process.env.SEED_ADMIN_PASSWORD

  // Fără parolă în mediu generăm una aleatoare și o afișăm o singură dată.
  // O parolă implicită scrisă în cod ar ajunge, mai devreme sau mai târziu,
  // într-un mediu accesibil din afară.
  const password = provided ?? `ac-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`

  await payload.create({
    collection: 'users',
    data: { email, password, name: 'Administrator', role: 'admin' },
    overrideAccess: true,
  })
  record('users', 'create')

  console.log('\n  Cont de administrator creat:')
  console.log(`    email:  ${email}`)
  console.log(`    parolă: ${provided ? '(din SEED_ADMIN_PASSWORD)' : password}`)
  if (!provided) console.log('    Notează-o acum — nu se mai afișează.\n')
}

/* -------------------------------------------------------------------------- */
/* Categorii                                                                   */
/* -------------------------------------------------------------------------- */

const CATEGORIES = [
  {
    name: 'Performanță',
    description:
      'Ce înseamnă performanța la nivel de om: potențial, execuție și distanța dintre ele.',
  },
  {
    name: 'Decizie',
    description: 'Cum se iau deciziile sub presiune și ce le strică fără să observăm.',
  },
  {
    name: 'Perspectivă',
    description: 'Texte despre felul în care privim situațiile și despre ce se schimbă când îl mutăm.',
  },
  {
    name: 'Mindset',
    description: 'Tiparele mentale care susțin sau blochează rezultatul.',
  },
] as const

async function seedCategories(payload: Payload): Promise<Map<string, number | string>> {
  const ids = new Map<string, number | string>()

  for (const category of CATEGORIES) {
    const slug = slugify(category.name)
    const { id } = await upsert(payload, {
      collection: 'categories',
      keyField: 'slug',
      keyValue: slug,
      data: { name: category.name, slug, description: category.description },
    })
    ids.set(category.name, id)
  }

  return ids
}

/* -------------------------------------------------------------------------- */
/* Întrebări frecvente — cele 6 din designul aprobat, cu textul identic         */
/* -------------------------------------------------------------------------- */

async function seedFaqs(payload: Payload): Promise<void> {
  const items = homeContent.faq.items

  for (const [index, item] of items.entries()) {
    const comparisonTable = item.table
      ? {
          caption: item.table.caption,
          columns: item.table.columns.map((label) => ({ label })),
          rows: item.table.rows.map((row) => ({
            label: row.label,
            cells: row.cells.map((value) => ({ value })),
          })),
        }
      : { caption: null, columns: [], rows: [] }

    await upsert(payload, {
      collection: 'faqs',
      keyField: 'question',
      keyValue: item.question,
      data: {
        question: item.question,
        answer: item.answer,
        page: 'homepage',
        order: index,
        comparisonTable,
      },
    })
  }

  // Întrebările paginii de workshopuri. Nu au tabel comparativ, dar trec prin
  // același `upsert`, cheia fiind tot întrebarea.
  for (const [index, item] of workshopsPage.faq.entries()) {
    await upsert(payload, {
      collection: 'faqs',
      keyField: 'question',
      keyValue: item.question,
      data: {
        question: item.question,
        answer: item.answer,
        page: 'workshopuri',
        order: index,
        comparisonTable: { caption: null, columns: [], rows: [] },
      },
    })
  }
}

/* -------------------------------------------------------------------------- */
/* Pachete — cele trei programe individuale                                    */
/* -------------------------------------------------------------------------- */

/** Marcajul pentru textul care încă nu a fost livrat de clientă. */
const TODO = '[ DE COMPLETAT ]'

/**
 * Cele trei programe, cu textul aprobat.
 *
 * `createOnly`: dacă cineva a început să corecteze un program în admin, a doua
 * rulare a seed-ului nu are voie să îi șteargă munca.
 *
 * **`longDescription` rămâne NECOMPLETAT, intenționat.** Descrierea lungă a
 * celor trei programe are titluri, liste și blocuri numerotate (metoda CLAR,
 * cele șase dimensiuni HPA). Scrisă ca document Lexical în seed, ar fi devenit
 * o pădure de noduri pe care nimeni nu o mai corectează, iar randarea ei ar fi
 * fost mai săracă decât cea structurată. Cât timp câmpul e gol, pagina
 * randează secțiunile din `src/content/packages.ts`, cu tot cu numerotare.
 * Dacă Adriana scrie rich text în admin, acela are întâietate — regula de
 * îmbinare, neschimbată.
 *
 * ATENȚIE la o rulare pe o bază veche: acolo există deja trei pachete cu
 * slug-urile `pachet-i`, `pachet-ii`, `pachet-iii` și text `[ DE COMPLETAT ]`.
 * Au alte slug-uri decât cele de aici, deci NU sunt atinse și rămân ascunse
 * (`active: false`). Se pot șterge din admin, când e sigur că nu au comenzi.
 */
async function seedPackages(payload: Payload): Promise<void> {
  for (const [index, pkg] of packagesFallback.entries()) {
    await upsert(payload, {
      collection: 'packages',
      keyField: 'slug',
      keyValue: pkg.slug,
      createOnly: true,
      data: {
        name: pkg.name,
        slug: pkg.slug,
        tagline: pkg.tagline,
        forWho: pkg.forWho,
        includes: pkg.includes
          .filter((item): item is string => typeof item === 'string')
          .map((item) => ({ item })),
        duration: pkg.duration,
        format: pkg.format,
        price: pkg.price,
        order: index,
        featured: pkg.featured,
        active: true,
        faq: pkg.faq.map(({ question, answer }) => ({ question, answer })),
        seo: {
          metaTitle: pkg.seo.metaTitle,
          metaDescription: pkg.seo.metaDescription,
          noIndex: pkg.seo.noIndex,
        },
      },
    })
  }
}

/* -------------------------------------------------------------------------- */
/* Workshopuri                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Cele 14 workshopuri.
 *
 * `order` este poziția din firul logic al seriei — autocunoaștere, autoreglare,
 * gândire și decizie, adaptare, relaționare, leadership, performanță
 * sustenabilă. NU este ordinea din pagină: acolo urcă întâi edițiile cu dată,
 * cronologic. Vezi `src/lib/workshops.ts`.
 *
 * Datele celor trei ediții programate intră ca atare. Restul rămân fără dată,
 * deci apar în catalog fără buton de plată — exact regula clientei: se pot
 * cumpăra întotdeauna doar următoarele trei ediții programate.
 */
async function seedWorkshops(payload: Payload): Promise<void> {
  for (const [index, workshop] of workshopEntries.entries()) {
    await upsert(payload, {
      collection: 'workshops',
      keyField: 'slug',
      keyValue: workshop.slug,
      createOnly: true,
      data: {
        title: workshop.title,
        slug: workshop.slug,
        subtitle: workshop.subtitle,
        summary: workshop.summary,
        // Payload păstrează câmpurile `date` ca timestamp. Fixăm prânzul UTC,
        // ca ziua să se citească înapoi la fel în orice fus — inclusiv pe
        // Vercel, unde serverul rulează pe UTC.
        sessionDate: workshop.sessionDate ? `${workshop.sessionDate}T12:00:00.000Z` : null,
        price: WORKSHOP_PRICE,
        order: index,
        active: true,
        what: workshop.what,
        problems: workshop.problems,
        workMethod: workshop.workMethod,
        outcomes: workshop.outcomes.map((item) => ({ item })),
        keywords: workshop.keywords.map((item) => ({ item })),
      },
    })
  }
}

/* -------------------------------------------------------------------------- */
/* Recomandări                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Cele trei recomandări.
 *
 * `createOnly`, ca peste tot, dar aici motivul e mai tare decât de obicei: sunt
 * cuvintele unor oameni reali. O rulare de seed nu are voie să rescrie peste o
 * corectură pe care a cerut-o chiar autorul recomandării.
 */
async function seedTestimonials(payload: Payload): Promise<void> {
  for (const testimonial of testimonials) {
    await upsert(payload, {
      collection: 'testimonials',
      keyField: 'slug',
      keyValue: testimonial.slug,
      createOnly: true,
      data: {
        author: testimonial.author,
        slug: testimonial.slug,
        role: testimonial.role,
        context: testimonial.context,
        excerpt: testimonial.excerpt,
        paragraphs: testimonial.paragraphs.map((text) => ({ text })),
        featured: testimonial.featured,
        order: testimonial.order,
        active: true,
      },
    })
  }
}

/* -------------------------------------------------------------------------- */
/* Articole — titlurile din design, ca ciorne                                  */
/* -------------------------------------------------------------------------- */

/** Document Lexical minim, cu un singur paragraf. */
function lexicalParagraph(text: string) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'paragraph',
          format: '' as const,
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          textFormat: 0,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

async function seedPosts(payload: Payload, categories: Map<string, number | string>): Promise<void> {
  for (const post of homeContent.blog.posts) {
    const slug = post.href.replace('/blog/', '')
    const category = categories.get(post.category)

    if (!category) {
      console.warn(`  ! Categoria „${post.category}" lipsește; articolul „${post.title}" a fost sărit.`)
      record('posts', 'skip')
      continue
    }

    await upsert(payload, {
      collection: 'posts',
      keyField: 'slug',
      keyValue: slug,
      createOnly: true,
      draft: true,
      data: {
        title: post.title,
        slug,
        excerpt: post.excerpt,
        category,
        publishedAt: new Date(`${post.publishedAt}T09:00:00.000Z`).toISOString(),
        content: lexicalParagraph(`${TODO} Textul articolului nu a fost încă livrat de clientă.`),
        _status: 'draft',
      },
    })
  }
}

/* -------------------------------------------------------------------------- */
/* Globals                                                                     */
/* -------------------------------------------------------------------------- */

async function seedSiteSettings(payload: Payload): Promise<void> {
  const s = siteSettings

  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    depth: 0,
    data: {
      siteName: s.siteName,
      role: s.role,
      tagline: s.tagline,
      email: s.email,
      phone: s.phone,
      city: s.city,
      region: s.region,
      country: s.country,
      responseTime: s.responseTime,
      availability: s.availability,
      bookingUrl: s.bookingUrl,
      companyLegalName: s.company.legalName,
      cui: s.company.cui,
      regCom: s.company.regCom,
      registeredAddress: s.company.registeredAddress,
      ga4MeasurementId: s.ga4MeasurementId,
      // Conturile sociale sunt încă `href: '#'` — nu are rost să intre așa în
      // `sameAs`. Rămân goale până când clienta trimite adresele reale.
      socialLinks: [],
    },
  })
  record('site-settings', 'update')
}

async function seedHomePage(payload: Payload): Promise<void> {
  const h = homeContent
  const texts = (items: readonly string[]) => items.map((text) => ({ text }))

  await payload.updateGlobal({
    slug: 'home-page',
    overrideAccess: true,
    depth: 0,
    data: {
      heroEyebrow: h.hero.eyebrow.text,
      heroHeadline: texts(h.hero.headlineLines),
      heroLead: h.hero.lead,
      heroIntro: h.hero.intro,
      heroPrimaryCta: h.hero.primaryCta,
      heroSecondaryCta: h.hero.secondaryCta,
      heroBadges: texts(h.hero.badges),

      problema: {
        visible: true,
        eyebrow: h.problema.eyebrow,
        heading: h.problema.heading,
        body: h.problema.body,
        signs: h.problema.signs.map((sign) => ({
          index: sign.index,
          title: sign.title ?? null,
          body: sign.body ?? null,
        })),
      },

      metoda: {
        visible: true,
        eyebrow: h.metoda.eyebrow,
        heading: h.metoda.heading,
        body: h.metoda.body,
        steps: h.metoda.steps.map((step) => ({
          index: step.index,
          title: step.title ?? null,
          body: step.body ?? null,
        })),
      },

      pentruCine: {
        visible: true,
        eyebrow: h.pentruCine.eyebrow,
        heading: h.pentruCine.heading,
        aside: h.pentruCine.aside,
        segments: h.pentruCine.segments.map((segment) => ({ ...segment })),
      },

      univers: {
        visible: true,
        eyebrow: h.univers.eyebrow,
        heading: h.univers.heading,
        body: h.univers.body,
        note: h.univers.note,
        items: h.univers.items.map((item) => ({
          numeral: item.numeral,
          title: item.title,
          trademark: item.trademark ?? false,
          body: item.body,
        })),
      },

      despre: {
        visible: true,
        eyebrow: h.despre.eyebrow,
        heading: h.despre.heading,
        paragraphs: texts(h.despre.paragraphs),
        credentials: texts(h.despre.credentials),
        link: h.despre.link,
      },

      valori: {
        visible: true,
        eyebrow: h.valori.eyebrow,
        values: h.valori.values.map((value) => ({ ...value })),
      },

      citat: {
        visible: true,
        lines: texts(h.citat.lines),
        attribution: h.citat.attribution,
      },

      servicii: {
        visible: true,
        eyebrow: h.servicii.eyebrow,
        heading: h.servicii.heading,
        intro: h.servicii.intro,
        reassurance: texts(h.servicii.reassurance),
        footerLink: h.servicii.footerLink,
      },

      blog: {
        visible: true,
        eyebrow: h.blog.eyebrow,
        heading: h.blog.heading,
        link: h.blog.link,
      },

      faq: {
        visible: true,
        eyebrow: h.faq.eyebrow,
        heading: h.faq.heading,
      },

      cta: {
        visible: true,
        eyebrow: h.cta.eyebrow,
        heading: h.cta.heading,
        body: h.cta.body,
        ctaLink: h.cta.cta,
        note: h.cta.note,
      },
    },
  })
  record('home-page', 'update')
}

async function seedAboutPage(payload: Payload): Promise<void> {
  const existing = await payload.findGlobal({
    slug: 'about-page',
    overrideAccess: true,
    depth: 0,
  })

  // Textul lung al paginii Despre nu a fost livrat (STATUS §7). Punem ce
  // există deja în teaserul aprobat de pe homepage — titlu, frază de intrare,
  // repere, cele patru principii — și doar dacă globalul e gol: altfel am
  // rescrie ce a scris clienta între timp. `narrative` rămâne necompletat
  // intenționat, ca pagina să randeze paragrafele aprobate până când apare
  // povestea completă.
  if (existing?.title) {
    record('about-page', 'skip')
    return
  }

  await payload.updateGlobal({
    slug: 'about-page',
    overrideAccess: true,
    depth: 0,
    data: {
      title: aboutFallback.title,
      lead: aboutFallback.lead,
      credentials: aboutFallback.credentials.map(({ text, detail }) => ({ text, detail })),
      principles: aboutFallback.principles.map(({ title, body }) => ({ title, body })),
    },
  })
  record('about-page', 'update')
}

/* -------------------------------------------------------------------------- */

async function seed(): Promise<void> {
  const payload = await getPayload({ config })

  console.log('\nPopulez baza de date...\n')

  await seedAdminUser(payload)
  const categories = await seedCategories(payload)
  await seedFaqs(payload)
  await seedPackages(payload)
  await seedWorkshops(payload)
  await seedTestimonials(payload)
  await seedPosts(payload, categories)
  await seedSiteSettings(payload)
  await seedHomePage(payload)
  await seedAboutPage(payload)

  console.log('\n  Rezultat:')
  for (const [bucket, entry] of Object.entries(stats)) {
    const parts = [
      entry.create ? `${entry.create} create` : null,
      entry.update ? `${entry.update} actualizate` : null,
      entry.skip ? `${entry.skip} neatinse` : null,
    ].filter(Boolean)
    console.log(`    ${bucket.padEnd(16)} ${parts.join(', ') || 'nimic de făcut'}`)
  }

  console.log('\n  Cele trei programe individuale sunt vizibile, cu preț real, în lei.')
  console.log(
    '  Cele 14 workshopuri sunt în catalog; se pot cumpăra doar cele 3 cu dată în viitor.',
  )
  console.log('  Recomandările sunt publicate — confirmă acordul scris al autorilor.')
  console.log('  Articolele sunt ciorne: titlurile vin din design, textul lipsește.\n')

  await payload.destroy()
  process.exit(0)
}

await seed()

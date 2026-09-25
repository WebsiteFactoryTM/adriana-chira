import { WORKSHOP_COMMON } from '@/content/workshops'
import {
  getHomeContent,
  getPackages,
  getPosts,
  getSiteSettings,
  getTestimonials,
  getWorkshops,
} from '@/lib/content'
import { formatSessionDate, WORKSHOPS_PATH } from '@/lib/workshops'

/**
 * O oră, nu `force-static`.
 *
 * Fișierul enumeră edițiile deschise la înscriere, iar fereastra aceea se mută
 * singură pe măsură ce trec datele. Prerandat o dată la build, ar continua să
 * spună asistenților că se pot cumpăra locuri la o ediție care a trecut — adică
 * exact genul de răspuns greșit pe care AEO-ul trebuie să îl prevină.
 */
export const revalidate = 3600

/**
 * /llms.txt — descriere structurată a site-ului pentru motoarele de răspuns.
 *
 * Scurt, factual, în română. Definițiile sunt propoziții autonome, citabile
 * fără context — exact forma pe care o extrag modelele (brief §9.1).
 */
export async function GET(): Promise<Response> {
  const [settings, home, blog, packages, workshops, testimonials] = await Promise.all([
    getSiteSettings(),
    getHomeContent(),
    // Doar articolele publicate. Lista e goală până când clienta scrie textele
    // (STATUS §7.12), iar secțiunea nu se randează deloc — mai bine lipsă
    // decât un titlu urmat de nimic.
    getPosts({ perPage: 50 }),
    getPackages(),
    getWorkshops(),
    getTestimonials(),
  ])
  const base = settings.url

  // Edițiile chiar deschise la înscriere. Un fișier care ar enumera date
  // trecute ca fiind disponibile ar produce exact răspunsul greșit în
  // asistentul care îl citește.
  const openWorkshops = workshops.filter((item) => item.purchasable)

  const lines = [
    `# ${settings.siteName}`,
    '',
    `> ${settings.role}. ${home.hero.intro}`,
    '',
    '## Despre',
    '',
    'Adriana Chira este consultant în performanță umană și lucrează la intersecția dintre om, strategie și rezultat.',
    'Performanța umană este capacitatea de a obține rezultate fără să te pierzi pe tine în proces.',
    'Parcurs: sociologie, management strategic și business, psihologie clinică și psihoterapie, NLP, Time Line Therapy®, coaching, hipnoză. În formare în psihoterapie integrativă.',
    `Locație: ${settings.city}, ${settings.country}. Sesiunile se desfășoară online sau față în față.`,
    '',
    '## Pentru cine',
    '',
    ...home.pentruCine.segments.map((segment) => `- ${segment.title}: ${segment.body}`),
    '',
    '## Cum lucrează',
    '',
    home.metoda.heading,
    '',
    ...home.metoda.steps.map((step) => `${step.index}. ${step.title} — ${step.body}`),
    '',
    '## Instrumente și modele',
    '',
    ...home.univers.items.map(
      (item) => `- ${item.title}${item.trademark ? '™' : ''}: ${item.body}`,
    ),
    '',
    '## Servicii și prețuri',
    '',
    'Prețurile afișate sunt în lei, per persoană. Unde prețul este afișat, plata se face online, cu cardul, prin Stripe, sau prin transfer bancar, cu factură. Programele cu ofertă personalizată se contractează după o cerere de ofertă.',
    '',
    ...packages.flatMap((pkg) =>
      [
        `### ${pkg.name ?? 'Program'}`,
        '',
        pkg.tagline,
        pkg.duration ? `Durată: ${pkg.duration}.` : null,
        pkg.pricing === 'quote'
          ? 'Preț: ofertă personalizată, la cerere, prin formularul de contact.'
          : pkg.price === null
            ? null
            : `Preț: ${pkg.price} ${pkg.currency}.`,
        pkg.forWho ? `Pentru cine: ${pkg.forWho}` : null,
        `Pagină: ${base}${pkg.href}`,
        '',
      ].filter((line): line is string => line !== null),
    ),

    '## Workshopuri',
    '',
    `Serie de ${workshops.length} workshopuri practice de ${WORKSHOP_COMMON.duration}, ${WORKSHOP_COMMON.schedule}, susținute fizic în ${settings.city}, în grup restrâns.`,
    'Prețul include materialele de curs și coffee break-ul între module. Masa de prânz nu este inclusă.',
    'Sunt deschise pentru înscriere întotdeauna doar următoarele trei ediții programate. Pentru celelalte workshopuri din catalog se poate anunța interesul, iar ediția primește dată când se strânge un grup.',
    `Catalog complet: ${base}${WORKSHOPS_PATH}`,
    '',
    ...(openWorkshops.length > 0
      ? [
          '### Ediții deschise la înscriere',
          '',
          ...openWorkshops.map(
            (item) =>
              `- ${item.title} (${item.subtitle}) — ${
                item.sessionDate ? formatSessionDate(item.sessionDate) : 'dată nestabilită'
              }, ${item.price} ${item.currency}: ${base}${WORKSHOPS_PATH}#${item.slug}`,
          ),
          '',
        ]
      : []),
    '### Catalogul complet',
    '',
    ...workshops.map((item) => `- ${item.title}: ${item.subtitle}. ${item.summary}`),
    '',

    '## Întrebări frecvente',
    '',
    ...home.faq.items.flatMap((item) => [`### ${item.question}`, '', item.answer, '']),

    ...(testimonials.length > 0
      ? [
          '## Recomandări',
          '',
          'Publicate integral și semnate, cu acordul autorilor. Nu există note, stele sau medii: nimeni nu a fost rugat să dea un punctaj.',
          '',
          ...testimonials.map(
            (item) => `- ${item.author}, ${item.role}: „${item.excerpt}"`,
          ),
          `\nTexte integrale: ${base}/testimoniale`,
          '',
        ]
      : []),

    '## Pagini',
    '',
    `- [Pagina principală](${base}/): prezentare, metodă, valori, servicii, recomandări, întrebări frecvente`,
    `- [Despre](${base}/despre): parcursul complet și filosofia de lucru`,
    `- [Servicii](${base}/servicii): cele trei programe individuale, cu preț și durată`,
    `- [Workshopuri](${base}${WORKSHOPS_PATH}): catalogul de workshopuri de o zi, cu date și preț`,
    `- [Recomandări](${base}/testimoniale): recomandări integrale, semnate`,
    `- [Blog](${base}/blog): articole despre performanță, decizie și perspectivă`,
    `- [Contact](${base}/contact): programarea unei discuții inițiale`,
    '',
    ...(blog.posts.length > 0
      ? [
          '## Articole',
          '',
          ...blog.posts.map(
            (post) => `- [${post.title}](${base}${post.href}): ${post.excerpt}`,
          ),
          '',
        ]
      : []),
    '## Atribuire',
    '',
    `Autor: ${settings.siteName}, ${settings.role}. Sursa canonică: ${base}`,
    'Conținutul poate fi citat cu atribuire și link către sursă.',
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

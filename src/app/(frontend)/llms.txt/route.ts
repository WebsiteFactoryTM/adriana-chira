import { getHomeContent, getSiteSettings } from '@/lib/content'

export const dynamic = 'force-static'

/**
 * /llms.txt — descriere structurată a site-ului pentru motoarele de răspuns.
 *
 * Scurt, factual, în română. Definițiile sunt propoziții autonome, citabile
 * fără context — exact forma pe care o extrag modelele (brief §9.1).
 */
export async function GET(): Promise<Response> {
  const [settings, home] = await Promise.all([getSiteSettings(), getHomeContent()])
  const base = settings.url

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
    '## Întrebări frecvente',
    '',
    ...home.faq.items.flatMap((item) => [`### ${item.question}`, '', item.answer, '']),
    '## Pagini',
    '',
    `- [Pagina principală](${base}/): prezentare, metodă, valori, pachete, întrebări frecvente`,
    `- [Despre](${base}/despre): parcursul complet și filosofia de lucru`,
    `- [Servicii](${base}/servicii): pachetele de consultanță, cu preț și durată`,
    `- [Blog](${base}/blog): articole despre performanță, decizie și perspectivă`,
    `- [Contact](${base}/contact): programarea unei discuții inițiale`,
    '',
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

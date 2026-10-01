import type { MetadataRoute } from 'next'
import { siteSettings } from '@/content/site'

/**
 * ATENȚIE — DECIZIE DE BUSINESS NECONFIRMATĂ (brief §9.2, §13.11).
 *
 * Crawlerele de AI (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot)
 * sunt permise explicit. Aceasta este premisa întregii părți de AEO din ofertă:
 * fără ele, obiectivul „conținutul Adrianei este citat cu atribuire în motoarele
 * de răspuns" devine imposibil.
 *
 * Blocarea lor este o alegere legitimă, dar anulează AEO. Se confirmă ÎN SCRIS
 * cu clienta înainte de lansare. Dacă răspunsul este „blocăm", se înlocuiește
 * `AI_CRAWLERS` cu `disallow: '/'` și se ajustează oferta.
 */
const AI_CRAWLERS = ['GPTBot', 'ClaudeBot', 'Claude-Web', 'PerplexityBot', 'Google-Extended', 'CCBot']

// `/resurse/*/descarca` are în adresă jetonul personal de descărcare: nu are ce
// căuta într-un index, iar pagina e oricum `noindex`.
const PRIVATE_PATHS = ['/admin', '/api', '/multumim', '/comanda-anulata', '/resurse/*/descarca']

export default function robots(): MetadataRoute.Robots {
  const base = siteSettings.url

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow: PRIVATE_PATHS })),
    ],
    // Fără `host`: directiva e doar Yandex, e învechită și așteaptă un domeniu,
    // nu un URL. Canonicalul fiecărei pagini spune deja care e adresa corectă.
    sitemap: `${base}/sitemap.xml`,
  }
}

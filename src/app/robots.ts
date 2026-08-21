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

const PRIVATE_PATHS = ['/admin', '/api', '/multumim', '/comanda-anulata']

export default function robots(): MetadataRoute.Robots {
  const base = siteSettings.url

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow: PRIVATE_PATHS })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}

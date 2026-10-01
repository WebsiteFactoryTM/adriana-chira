import type { MetadataRoute } from 'next'

/**
 * Manifestul web: numele și pictograma când cineva adaugă site-ul pe ecranul
 * telefonului. La rădăcina lui `app/`, ca `robots.ts` — convenția Next îl
 * caută acolo.
 *
 * Monograma „AC" e desenată din conturul literelor Cormorant Garamond (fontul
 * titlurilor), crem pe cerneală, cu firul auriu al designului dedesubt.
 * Sursele: `src/app/(frontend)/icon.svg` (vector, folosit de browsere),
 * `src/app/favicon.ico` (16/32/48), `apple-icon.png` (180) și cele două PNG-uri
 * din `public/`. Varianta „maskable" are monograma la 78%, în zona sigură pe
 * care Android nu o taie.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Adriana Chira · Consultant în performanță umană',
    short_name: 'Adriana Chira',
    description:
      'Consultanță în performanță umană pentru antreprenori, manageri și profesioniști. Timișoara și online.',
    lang: 'ro',
    start_url: '/',
    display: 'browser',
    background_color: '#FAF5EC',
    theme_color: '#FAF5EC',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}

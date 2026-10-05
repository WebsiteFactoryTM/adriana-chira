import { getPosts, getSiteSettings } from '@/lib/content'

/** O oră, ca `llms.txt`: un articol publicat din admin apare fără deploy. */
export const revalidate = 3600

/** Câte articole intră în flux. Cititoarele RSS țin singure istoricul. */
const FEED_SIZE = 30

/**
 * /rss.xml — fluxul blogului (brief §8, prompt §„Fișiere pentru motoare").
 *
 * RSS 2.0 simplu: titlu, link, rezumat, categorie, dată. Rezumatul e câmpul
 * `excerpt` (max. 200 de caractere), nu textul întreg — fluxul aduce cititorul
 * pe site, unde sunt programele și formularul de contact.
 */
export async function GET(): Promise<Response> {
  const [settings, { posts }] = await Promise.all([
    getSiteSettings(),
    getPosts({ perPage: FEED_SIZE }),
  ])
  const base = settings.url

  const items = posts.map((post) => {
    const link = `${base}${post.href}`
    return [
      '    <item>',
      `      <title>${xml(post.title)}</title>`,
      `      <link>${xml(link)}</link>`,
      `      <guid isPermaLink="true">${xml(link)}</guid>`,
      `      <description>${xml(post.excerpt)}</description>`,
      post.category ? `      <category>${xml(post.category.name)}</category>` : null,
      `      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`,
      '    </item>',
    ]
      .filter((line): line is string => line !== null)
      .join('\n')
  })

  const lastBuild = posts[0] ? new Date(posts[0].publishedAt) : new Date()

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${xml(`Blog · ${settings.siteName}`)}</title>`,
    `    <link>${xml(`${base}/blog`)}</link>`,
    `    <atom:link href="${xml(`${base}/rss.xml`)}" rel="self" type="application/rss+xml" />`,
    `    <description>${xml(`Perspective despre performanță, decizie și oameni. ${settings.siteName}, ${settings.role}.`)}</description>`,
    '    <language>ro</language>',
    `    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

function xml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

import type { Payload, PayloadRequest } from 'payload'

import { launchPosts } from '@/content/posts'
import { blocksToLexical, lexicalToPlainText, type LexicalDocument } from '@/lib/lexical'

/** Marcajul cu care seed-ul vechi a creat ciornele din design. */
const PLACEHOLDER = '[ DE COMPLETAT ]'

export type LaunchPostsReport = { created: number; published: number; skipped: string[] }

/**
 * Scrie și publică articolele de lansare din `src/content/posts.ts`.
 *
 * Folosită de `pnpm seed` (bază goală) și de migrația
 * `20261005_120000_articole_lansare` (bazele existente). Pentru fiecare articol:
 *
 * - **nu există** → îl creează, publicat;
 * - **există ca ciornă de seed** (corpul încă `[ DE COMPLETAT ]`) → îi pune
 *   textul real și îl publică;
 * - **există cu alt conținut** → nu-l atinge. Cineva l-a scris în admin, iar
 *   munca aceea are întâietate, ca peste tot în seed (`createOnly`).
 *
 * Categoria lipsă (baza în care migrațiile rulează înaintea seed-ului) sare
 * articolul fără eroare; seed-ul îl creează după categorii.
 */
export async function seedLaunchPosts(
  payload: Payload,
  { req }: { req?: Partial<PayloadRequest> } = {},
): Promise<LaunchPostsReport> {
  const report: LaunchPostsReport = { created: 0, published: 0, skipped: [] }

  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
    depth: 0,
    pagination: false,
    overrideAccess: true,
    req,
  })
  const categoryIds = new Map(categories.map((category) => [category.slug, category.id]))

  for (const post of launchPosts) {
    const category = categoryIds.get(post.category)
    if (category === undefined) {
      report.skipped.push(`${post.slug} (categoria „${post.category}" lipsește)`)
      continue
    }

    const data = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      category,
      publishedAt: new Date(`${post.publishedAt}T09:00:00.000Z`).toISOString(),
      content: blocksToLexical(post.body),
      _status: 'published' as const,
    }

    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: post.slug } },
      limit: 1,
      depth: 0,
      draft: true,
      overrideAccess: true,
      req,
    })
    const current = existing.docs[0]

    if (!current) {
      await payload.create({ collection: 'posts', data, overrideAccess: true, req })
      report.created += 1
      continue
    }

    const text = lexicalToPlainText(current.content as LexicalDocument)
    if (!text.includes(PLACEHOLDER)) {
      report.skipped.push(`${post.slug} (are deja text scris în admin)`)
      continue
    }

    await payload.update({
      collection: 'posts',
      id: current.id,
      data,
      draft: false,
      overrideAccess: true,
      req,
    })
    report.published += 1
  }

  return report
}

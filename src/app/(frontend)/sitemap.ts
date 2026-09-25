import type { MetadataRoute } from 'next'

import { blogPage, legalPages } from '@/content/pages'
import { siteSettings } from '@/content/site'
import { getCategories, getPackages, getPostSlugs } from '@/lib/content'
import { blogHref, categoryHref } from '@/lib/routes'
import { WORKSHOPS_PATH } from '@/lib/workshops'

/**
 * Sitemap.
 *
 * `lastModified` vine din baza de date acolo unde există — `updatedAt`-ul
 * articolului — nu din data build-ului. Un sitemap care spune că totul s-a
 * modificat azi, la fiecare deploy, e un sitemap pe care crawlerul învață
 * să-l ignore.
 *
 * Fără bază de date, resolverele întorc liste goale și rămân rutele statice.
 * Sitemap-ul nu are voie să pice build-ul.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteSettings.url
  const now = new Date()

  const [posts, categories, packages] = await Promise.all([
    getPostSlugs(),
    getCategories(),
    getPackages(),
  ])

  const url = (path: string) => new URL(path, base).toString()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url('/'), lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: url('/despre'), lastModified: now, changeFrequency: 'yearly', priority: 0.8 },
    { url: url('/servicii'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    // Catalogul se schimbă mai des decât restul: fereastra de înscriere se
    // mută lunar, iar edițiile primesc date noi.
    { url: url(WORKSHOPS_PATH), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: url('/testimoniale'), lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: url('/blog'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: url('/contact'), lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
  ]

  const legalRoutes: MetadataRoute.Sitemap = legalPages.map((page) => ({
    url: url(`/${page.slug}`),
    lastModified: page.updatedAt ? new Date(page.updatedAt) : now,
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: url(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'yearly',
    priority: 0.7,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: url(categoryHref(category.slug, 1)),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  const packageRoutes: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: url(pkg.href),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Paginile 2+ ale blogului. Prima e deja în rutele statice, ca `/blog`.
  const totalBlogPages = Math.ceil(posts.length / blogPage.perPage)
  const blogPageRoutes: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(0, totalBlogPages - 1) },
    (_, index) => ({
      url: url(blogHref(index + 2)),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    }),
  )

  return [
    ...staticRoutes,
    ...packageRoutes,
    ...postRoutes,
    ...categoryRoutes,
    ...blogPageRoutes,
    ...legalRoutes,
  ]
}

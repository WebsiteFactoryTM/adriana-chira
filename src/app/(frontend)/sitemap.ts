import type { MetadataRoute } from 'next'
import { siteSettings } from '@/content/site'

/**
 * Sitemap.
 *
 * Deocamdată conține doar homepage-ul — restul rutelor intră odată cu paginile
 * din faza 3. La acel moment, articolele și pachetele se citesc din Payload cu
 * `lastModified` real din baza de date, nu cu data build-ului.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteSettings.url

  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}

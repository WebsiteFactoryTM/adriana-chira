import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/layout/PageHeader'
import { BlogIndex } from '@/components/sections/BlogIndex'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { blogPage } from '@/content/pages'
import { getCategories, getPosts, getSiteSettings } from '@/lib/content'
import { blogHref } from '@/lib/routes'
import { breadcrumbSchema, collectionPageSchema, graph } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

type Params = { params: Promise<{ numar: string }> }

export const revalidate = 3600

/** `/blog/pagina/1` ar fi un duplicat al lui `/blog`. Nu există. */
function parsePage(value: string): number | null {
  const page = Number(value)
  if (!Number.isInteger(page) || page < 2) return null
  return page
}

export async function generateStaticParams() {
  const { totalPages } = await getPosts({ perPage: blogPage.perPage })
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    numar: String(index + 2),
  }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { numar } = await params
  const page = parsePage(numar)
  if (!page) return {}

  return pageMetadata({
    title: `Blog · pagina ${page}`,
    description: blogPage.metaDescription,
    path: blogHref(page),
  })
}

export default async function BlogPaginaPage({ params }: Params) {
  const { numar } = await params
  const page = parsePage(numar)
  if (!page) notFound()

  const [result, categories, settings] = await Promise.all([
    getPosts({ page, perPage: blogPage.perPage }),
    getCategories(),
    getSiteSettings(),
  ])

  // O pagină peste ultima nu are conținut: 404, nu o grilă goală.
  if (result.posts.length === 0) notFound()

  const trail: Crumb[] = [
    { label: 'Acasă', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: `Pagina ${page}`, href: blogHref(page) },
  ]

  return (
    <>
      <Breadcrumb trail={trail} />

      <main id="continut">
        <PageHeader
          eyebrow={blogPage.eyebrow}
          title={blogPage.title}
          lead={blogPage.lead}
          tight
        />

        <BlogIndex
          posts={result.posts}
          categories={categories}
          page={result.page}
          totalPages={result.totalPages}
          hrefFor={blogHref}
        />
      </main>

      <JsonLd
        data={graph([
          collectionPageSchema(
            {
              name: `Blog · pagina ${page}`,
              description: blogPage.metaDescription,
              path: blogHref(page),
              items: result.posts.map((post) => ({ name: post.title, path: post.href })),
            },
            settings,
          ),
          breadcrumbSchema(trail, settings.url),
        ])}
      />
    </>
  )
}

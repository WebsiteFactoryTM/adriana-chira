import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/layout/PageHeader'
import { BlogIndex } from '@/components/sections/BlogIndex'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { blogPage } from '@/content/pages'
import { getCategories, getCategoryBySlug, getPosts, getSiteSettings } from '@/lib/content'
import { categoryHref } from '@/lib/routes'
import { breadcrumbSchema, collectionPageSchema, graph } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

type Params = { params: Promise<{ slug: string; numar: string }> }

export const revalidate = 3600

/** Pagina 1 a unei categorii este chiar `/blog/categorie/[slug]`. */
function parsePage(value: string): number | null {
  const page = Number(value)
  if (!Number.isInteger(page) || page < 2) return null
  return page
}

export async function generateStaticParams() {
  const categories = await getCategories()

  return categories.flatMap((category) => {
    const totalPages = Math.ceil(category.count / blogPage.perPage)
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
      slug: category.slug,
      numar: String(index + 2),
    }))
  })
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, numar } = await params
  const page = parsePage(numar)
  if (!page) return {}

  const category = await getCategoryBySlug(slug)
  if (!category) return {}

  return pageMetadata({
    title: `${category.name} · pagina ${page}`,
    description: category.description ?? blogPage.metaDescription,
    path: categoryHref(category.slug, page),
  })
}

export default async function CategoriePaginaPage({ params }: Params) {
  const { slug, numar } = await params
  const page = parsePage(numar)
  if (!page) notFound()

  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const [result, categories, settings] = await Promise.all([
    getPosts({ page, perPage: blogPage.perPage, categorySlug: slug }),
    getCategories(),
    getSiteSettings(),
  ])

  if (result.posts.length === 0) notFound()

  const trail: Crumb[] = [
    { label: 'Acasă', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: category.name, href: categoryHref(category.slug, 1) },
    { label: `Pagina ${page}`, href: categoryHref(category.slug, page) },
  ]

  const description = category.description ?? blogPage.metaDescription

  return (
    <>
      <Breadcrumb trail={trail} />

      <main id="continut">
        <PageHeader
          eyebrow={{ text: 'Categorie', ornament: 'line' }}
          title={category.name}
          lead={description}
          tight
        />

        <BlogIndex
          posts={result.posts}
          categories={categories}
          activeCategory={category.slug}
          page={result.page}
          totalPages={result.totalPages}
          hrefFor={(target) => categoryHref(category.slug, target)}
        />
      </main>

      <JsonLd
        data={graph([
          collectionPageSchema(
            {
              name: `${category.name} · pagina ${page}`,
              description,
              path: categoryHref(category.slug, page),
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

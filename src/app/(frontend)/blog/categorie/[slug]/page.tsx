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

type Params = { params: Promise<{ slug: string }> }

export const revalidate = 3600

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({ slug: category.slug }))
}

/** Descrierea proprie a categoriei, cu o rezervă care nu sună a robot. */
function describe(name: string, description: string | null): string {
  return description ?? `Articole din categoria ${name}, scrise de Adriana Chira.`
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}

  return pageMetadata({
    title: category.name,
    description: describe(category.name, category.description),
    path: categoryHref(category.slug, 1),
  })
}

export default async function CategoriePage({ params }: Params) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  // O categorie fără articole publicate nu are ce pagină să fie: ar fi o
  // adresă indexabilă care nu răspunde la nimic.
  if (!category || category.count === 0) notFound()

  const [result, categories, settings] = await Promise.all([
    getPosts({ perPage: blogPage.perPage, categorySlug: slug }),
    getCategories(),
    getSiteSettings(),
  ])

  const trail: Crumb[] = [
    { label: 'Acasă', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: category.name, href: categoryHref(category.slug, 1) },
  ]

  const description = describe(category.name, category.description)

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
          hrefFor={(page) => categoryHref(category.slug, page)}
        />
      </main>

      <JsonLd
        data={graph([
          collectionPageSchema(
            {
              name: category.name,
              description,
              path: categoryHref(category.slug, 1),
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

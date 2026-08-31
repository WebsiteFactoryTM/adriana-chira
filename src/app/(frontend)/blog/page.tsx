import type { Metadata } from 'next'

import { PageHeader } from '@/components/layout/PageHeader'
import { BlogIndex } from '@/components/sections/BlogIndex'
import { PageCta } from '@/components/sections/PageCta'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { blogPage } from '@/content/pages'
import { getCategories, getPosts, getSiteSettings } from '@/lib/content'
import { blogHref } from '@/lib/routes'
import { breadcrumbSchema, collectionPageSchema, graph } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

const TRAIL: Crumb[] = [
  { label: 'Acasă', href: '/' },
  { label: 'Blog', href: '/blog' },
]

export const metadata: Metadata = pageMetadata({
  title: 'Blog',
  description: blogPage.metaDescription,
  path: '/blog',
})

export const revalidate = 3600

/**
 * Lista de articole, prima pagină.
 *
 * Paginile 2+ trăiesc pe `/blog/pagina/[numar]`, nu pe `?pagina=`: un parametru
 * de căutare ar face ruta dinamică, iar `/blog` trebuie să rămână prerandată.
 */
export default async function BlogPage() {
  const [{ posts, page, totalPages }, categories, settings] = await Promise.all([
    getPosts({ perPage: blogPage.perPage }),
    getCategories(),
    getSiteSettings(),
  ])

  return (
    <>
      <Breadcrumb trail={TRAIL} />

      <main id="continut">
        <PageHeader
          eyebrow={blogPage.eyebrow}
          title={blogPage.title}
          lead={blogPage.lead}
          image={blogPage.image}
          tight
        />

        <BlogIndex
          posts={posts}
          categories={categories}
          page={page}
          totalPages={totalPages}
          hrefFor={blogHref}
        />

        <PageCta
          eyebrow={{ text: 'Primul pas', ornament: 'pulse' }}
          heading="Textele ajută. Discuția schimbă lucrurile."
          body="Dacă un articol ți-a răspuns la o întrebare pe care o purtai de mult, probabil merită să o ducem mai departe."
          primary={{ label: 'Programează o discuție', href: '/contact' }}
          secondary={{ label: 'Vezi pachetele', href: '/servicii' }}
          note={settings.responseTime}
        />
      </main>

      <JsonLd
        data={graph([
          collectionPageSchema(
            {
              name: 'Blog',
              description: blogPage.metaDescription,
              path: '/blog',
              items: posts.map((post) => ({ name: post.title, path: post.href })),
            },
            settings,
          ),
          breadcrumbSchema(TRAIL, settings.url),
        ])}
      />
    </>
  )
}

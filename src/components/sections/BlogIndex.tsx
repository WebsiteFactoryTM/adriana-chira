import Link from 'next/link'

import { Pagination } from '@/components/ui/Pagination'
import { PostCard } from '@/components/ui/PostCard'
import { Section, Shell } from '@/components/ui/Section'
import { blogPage } from '@/content/pages'
import type { CategorySummary, PostSummary } from '@/content/types'

/**
 * Grila de articole, cu filtrele de categorie și paginarea.
 *
 * Aceeași componentă pentru `/blog`, `/blog/pagina/N` și
 * `/blog/categorie/[slug]` — singura diferență între ele este ce primește
 * ca date. Fără sidebar (prompt §5.3).
 */
type Props = {
  posts: PostSummary[]
  categories: CategorySummary[]
  /** Categoria activă, dacă suntem pe pagina uneia. */
  activeCategory?: string
  page: number
  totalPages: number
  hrefFor: (page: number) => string
}

export function BlogIndex({
  posts,
  categories,
  activeCategory,
  page,
  totalPages,
  hrefFor,
}: Props) {
  return (
    <Section padding="bottom-only" aria-labelledby="articole-titlu">
      <Shell>
        <h2 id="articole-titlu" className="ac-sr-only">
          Articole
        </h2>

        {categories.length > 0 && (
          <nav aria-label="Filtrare pe categorie" className="mb-block">
            <ul className="flex flex-wrap gap-2 border-b border-ac-line pb-8">
              <li>
                <Chip href="/blog" active={!activeCategory}>
                  Toate
                </Chip>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Chip
                    href={`/blog/categorie/${category.slug}`}
                    active={activeCategory === category.slug}
                  >
                    {category.name}
                  </Chip>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {posts.length === 0 ? (
          <p className="max-w-[46ch] text-body-lg text-ac-ink-70">{blogPage.empty}</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[clamp(32px,4vw,56px)]">
            {posts.map((post, index) => (
              <PostCard
                key={post.slug}
                index={index}
                post={{
                  title: post.title,
                  href: post.href,
                  categoryLabel: post.category?.name ?? null,
                  categoryHref: post.category ? `/blog/categorie/${post.category.slug}` : null,
                  excerpt: post.excerpt,
                  publishedAt: post.publishedAt,
                  readingTime: post.readingTime,
                  cover: post.cover,
                }}
              />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
      </Shell>
    </Section>
  )
}

/** Pilulă de filtru. Aceeași geometrie ca butoanele mici din design. */
function Chip({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: string
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`flex min-h-11 items-center rounded-pill border px-[22px] py-3 font-medium text-btn uppercase transition-colors duration-[320ms] ease-ac ${
        active
          ? 'border-ac-ink bg-ac-ink text-ac-paper'
          : 'border-ac-line text-ac-ink hover:border-ac-ink'
      }`}
    >
      {children}
    </Link>
  )
}

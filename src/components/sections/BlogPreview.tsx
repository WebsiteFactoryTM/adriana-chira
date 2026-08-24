import { Eyebrow } from '@/components/ui/Eyebrow'
import { PostCard } from '@/components/ui/PostCard'
import { Section, Shell } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import type { BlogContent } from '@/content/types'

/**
 * Trei articole recente pe homepage.
 *
 * Cardul stă în `ui/PostCard`, pentru că `/blog` și paginile de categorie
 * randează exact același card (faza 3b).
 */
export function BlogPreview({ content }: { content: BlogContent }) {
  return (
    <Section id="blog" tone="cream" aria-labelledby="blog-titlu">
      <Shell>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow content={content.eyebrow} />
            <h2 id="blog-titlu" className="mt-8 max-w-[24ch] font-display text-h2-wide font-light">
              {content.heading}
            </h2>
          </div>
          <TextLink href={content.link.href} className="text-body" arrow>
            {content.link.label}
          </TextLink>
        </div>

        <div className="mt-block grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[clamp(32px,4vw,56px)]">
          {content.posts.map((post, index) => (
            <PostCard
              key={post.href}
              index={index}
              post={{
                title: post.title,
                href: post.href,
                // Cardurile din designul aprobat au categoria ca text simplu:
                // demo-ul nu are pagini de categorie. Cele venite din CMS o au
                // ca link, pentru că acolo pagina există.
                categoryLabel: post.category,
                categoryHref: post.categoryHref ?? null,
                excerpt: post.excerpt,
                publishedAt: post.publishedAt,
                readingTime: post.readingTime,
                cover: post.cover,
              }}
            />
          ))}
        </div>
      </Shell>
    </Section>
  )
}

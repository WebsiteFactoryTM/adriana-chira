import Link from 'next/link'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { Section, Shell } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import { formatDateRo } from '@/lib/content'
import type { BlogContent } from '@/content/types'

/** Trei articole recente. Sursa devine colecția Payload `posts` (faza 2). */
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
            <Reveal
              as="article"
              key={post.href}
              start={`${index * 4}%`}
              end={`${26 + index * 4}%`}
              className="ac-media"
            >
              <ImageSlot
                content={post.cover}
                sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              <p className="mt-6 font-medium text-label uppercase text-ac-accent-ink">
                {post.category}
              </p>

              <h3 className="mt-[14px] font-display text-h3 font-normal">
                <Link href={post.href} className="ac-underline">
                  {post.title}
                </Link>
              </h3>

              <p className="mt-4 text-body-sm text-ac-ink-70">{post.excerpt}</p>

              <p className="mt-5 font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-70">
                <time dateTime={post.publishedAt}>{formatDateRo(post.publishedAt)}</time>
                {' · '}
                {post.readingTime} min
              </p>
            </Reveal>
          ))}
        </div>
      </Shell>
    </Section>
  )
}

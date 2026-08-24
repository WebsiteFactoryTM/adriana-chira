import Link from 'next/link'

import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import type { ImageSlotContent } from '@/content/types'
import { formatDateRo } from '@/lib/content'

/**
 * Cardul unui articol.
 *
 * Aceeași formă pe homepage, pe `/blog` și pe pagina unei categorii. Markup-ul
 * este cel verificat la pixel pe homepage (STATUS §6) și nu se schimbă: cât
 * timp `categoryHref` lipsește — cazul cardurilor din designul aprobat —
 * categoria rămâne un `<p>` simplu, exact ca înainte.
 */
export type PostCardContent = {
  title: string
  href: string
  categoryLabel: string | null
  categoryHref: string | null
  excerpt: string
  publishedAt: string
  readingTime: number
  cover: ImageSlotContent
}

type Props = {
  post: PostCardContent
  index: number
  sizes?: string
}

export function PostCard({
  post,
  index,
  sizes = '(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: Props) {
  return (
    <Reveal
      as="article"
      start={`${index * 4}%`}
      end={`${26 + index * 4}%`}
      className="ac-media"
    >
      <ImageSlot content={post.cover} sizes={sizes} />

      {post.categoryLabel &&
        (post.categoryHref ? (
          <p className="mt-6 font-medium text-label uppercase text-ac-accent-ink">
            <Link href={post.categoryHref} className="ac-underline leading-[normal]">
              {post.categoryLabel}
            </Link>
          </p>
        ) : (
          <p className="mt-6 font-medium text-label uppercase text-ac-accent-ink">
            {post.categoryLabel}
          </p>
        ))}

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
  )
}

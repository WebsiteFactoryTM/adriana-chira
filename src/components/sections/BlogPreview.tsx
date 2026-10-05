import { CarouselControls } from '@/components/ui/CarouselControls'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { PostCard } from '@/components/ui/PostCard'
import { Reveal } from '@/components/ui/Reveal'
import { Section, Shell } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import type { BlogContent } from '@/content/types'

/** `id`-ul pistei, legat de săgeți prin `aria-controls`. */
const TRACK_ID = 'blog-pista'

/**
 * Articolele recente pe homepage, într-un carusel.
 *
 * NOTĂ DESIGN: designul aprobat are o grilă fixă de trei carduri. Cerut pe
 * 5 octombrie 2026 (STATUS §9, excepția 39): carusel cu ultimele articole, ca
 * blogul să se vadă din homepage pe măsură ce crește. Pe desktop se văd tot
 * trei carduri, cu aceeași lățime și același spațiu dintre ele ca în grilă —
 * cu trei articole sau mai puține, secțiunea arată exact ca în design, iar
 * săgețile nici nu apar. Pe telefon, un card și marginea următorului, care
 * spune singură „glisează".
 *
 * Pista e o listă cu `scroll-snap`, randată pe server: funcționează fără JS,
 * din touch, trackpad și tastatură. Săgețile (`CarouselControls`) sunt singura
 * parte de client — justificarea e în fișierul lor.
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
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <TextLink href={content.link.href} className="text-body" arrow>
              {content.link.label}
            </TextLink>
            <CarouselControls target={TRACK_ID} noun="Articolele" />
          </div>
        </div>

        <Reveal className="mt-block">
          <ul
            id={TRACK_ID}
            role="list"
            // Focusabilă: de la tastatură, săgețile stânga/dreapta derulează
            // pista nativ, fără niciun handler.
            tabIndex={0}
            aria-label="Articole recente"
            className="-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-[clamp(32px,4vw,56px)] overflow-x-auto px-gutter pb-2 [scrollbar-width:none] focus-visible:outline-offset-4 [&::-webkit-scrollbar]:hidden"
          >
            {content.posts.map((post, index) => (
              <li
                key={post.href}
                className="w-[min(82%,360px)] shrink-0 snap-start min-[700px]:w-[calc((100%-clamp(32px,4vw,56px))/2)] min-[1000px]:w-[calc((100%-2*clamp(32px,4vw,56px))/3)]"
              >
                <PostCard
                  index={index}
                  reveal={false}
                  sizes="(max-width: 700px) 82vw, (max-width: 1000px) 50vw, 33vw"
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
              </li>
            ))}
          </ul>
        </Reveal>
      </Shell>
    </Section>
  )
}

import type { CSSProperties } from 'react'
import { Button } from '@/components/ui/Button'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Section, Shell } from '@/components/ui/Section'
import type { HeroContent } from '@/content/types'

/** Decalajul între rândurile titlului, ca în design: 0 / 110 / 220ms. */
const LINE_DELAY = 110

export function Hero({ content }: { content: HeroContent }) {
  return (
    <Section id="hero" padding="none" className="relative pt-[clamp(4rem,11vh,9rem)] pb-[clamp(5rem,10vw,8rem)]">
      <Shell className="relative z-[1] grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-[clamp(40px,6vw,96px)]">
        <div>
          <p
            data-enter="fade"
            className="flex items-center gap-[14px] font-medium text-eyebrow uppercase text-ac-accent-ink"
          >
            <span data-enter="draw-x" aria-hidden="true" className="block h-px w-10 shrink-0 bg-ac-accent" />
            {content.eyebrow.text}
          </p>

          {/* Un singur h1 pe pagină (brief §8.2). Rândurile se ridică pe rând. */}
          <h1 className="mt-[clamp(28px,4vw,48px)] max-w-[19ch] font-display text-h1 font-light">
            {content.headlineLines.map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span
                  data-enter="up"
                  className="block"
                  style={{ '--enter-delay': `${index * LINE_DELAY}ms` } as CSSProperties}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-enter="rise"
            style={{ '--enter-delay': '380ms' } as CSSProperties}
            className="mt-[clamp(24px,3vw,36px)] max-w-[30ch] font-display text-lead font-normal text-ac-ink-70"
          >
            {content.lead}
          </p>

          <p
            data-enter="rise"
            style={{ '--enter-delay': '500ms' } as CSSProperties}
            className="mt-[clamp(32px,4vw,48px)] max-w-[52ch] text-body-lg leading-[1.78] text-ac-ink-70"
          >
            {content.intro}
          </p>

          <div
            data-enter="rise"
            style={{ '--enter-delay': '620ms' } as CSSProperties}
            className="mt-[clamp(36px,4vw,56px)] flex flex-wrap gap-[14px]"
          >
            <Button href={content.primaryCta.href} variant="primary" size="lg">
              {content.primaryCta.label}
            </Button>
            <Button href={content.secondaryCta.href} variant="soft" size="lg">
              {content.secondaryCta.label}
            </Button>
          </div>

          <ul
            data-enter="fade"
            style={{ '--enter-delay': '740ms' } as CSSProperties}
            className="mt-[clamp(48px,6vw,80px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-6 border-t border-ac-line pt-6"
          >
            {content.badges.map((badge) => (
              <li key={badge} className="font-medium text-label uppercase text-ac-ink-50">
                {badge}
              </li>
            ))}
          </ul>
        </div>

        <figure className="ac-media relative w-full max-w-[520px] justify-self-end">
          <ImageSlot
            content={content.portrait}
            priority
            reveal="clip-on-load"
            revealDelay={200}
            // Sub 1000px imaginea ocupă lățimea coloanei; peste, e plafonată la 520px.
            sizes="(max-width: 1000px) 100vw, 520px"
          />
          {content.portrait.caption && (
            <figcaption className="mt-4 flex justify-end gap-4 font-medium text-label uppercase text-ac-ink-50">
              <span>{content.portrait.caption}</span>
            </figcaption>
          )}
        </figure>
      </Shell>
    </Section>
  )
}

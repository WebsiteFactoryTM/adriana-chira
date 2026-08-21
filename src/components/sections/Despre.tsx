import { Eyebrow } from '@/components/ui/Eyebrow'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { Section, Shell } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import type { DespreContent } from '@/content/types'

/**
 * Teaser „Despre". Profunzimea stă pe /despre — pe homepage doar atât cât să
 * construiască încrederea, fără conținut duplicat între pagini (brief §8.2).
 */
export function Despre({ content }: { content: DespreContent }) {
  return (
    <Section id="despre" aria-labelledby="despre-titlu">
      <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-col-gap">
        <figure className="ac-media w-full max-w-[520px]">
          <ImageSlot
            content={content.portrait}
            reveal="clip-on-scroll"
            sizes="(max-width: 1000px) 100vw, 520px"
          />
          {content.portrait.caption && (
            <figcaption className="mt-4 font-medium text-label uppercase text-ac-ink-50">
              {content.portrait.caption}
            </figcaption>
          )}
        </figure>

        <div>
          <Eyebrow content={content.eyebrow} />
          <Reveal
            as="h2"
            id="despre-titlu"
            end="30%"
            className="mt-8 max-w-[24ch] font-display text-h2-col font-light"
          >
            {content.heading}
          </Reveal>

          <div className="mt-9 grid max-w-[62ch] gap-6">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-body-lg text-ac-ink-70">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Formările ca listă structurată, nu paragraf — extractibil pentru AEO. */}
          <ul className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-y border-ac-line py-7">
            {content.credentials.map((credential) => (
              <li
                key={credential}
                className="font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-50"
              >
                {credential}
              </li>
            ))}
          </ul>

          <p className="mt-9">
            <TextLink href={content.link.href} className="text-body-lg" arrow>
              {content.link.label}
            </TextLink>
          </p>
        </div>
      </Shell>
    </Section>
  )
}

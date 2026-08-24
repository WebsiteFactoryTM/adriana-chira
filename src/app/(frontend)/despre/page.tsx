import type { Metadata } from 'next'

import { PageHeader } from '@/components/layout/PageHeader'
import { PageCta } from '@/components/sections/PageCta'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Reveal } from '@/components/ui/Reveal'
import { RichText } from '@/components/ui/RichText'
import { Section, Shell } from '@/components/ui/Section'
import { getAboutContent, getSiteSettings } from '@/lib/content'
import { breadcrumbSchema, graph, personSchema, profilePageSchema } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

const TRAIL: Crumb[] = [
  { label: 'Acasă', href: '/' },
  { label: 'Despre mine', href: '/despre' },
]

const DESCRIPTION =
  'Sociologie, management strategic și psihologie. Cum am ajuns să lucrez cu oamenii care decid și ce înseamnă, concret, consultanța în performanță umană.'

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutContent()
  return pageMetadata({
    title: 'Despre mine',
    description: DESCRIPTION,
    path: '/despre',
    seo: about.seo,
  })
}

/**
 * Pagina „Despre mine".
 *
 * Narațiunea vine din globalul `about-page`. Cât timp e goală — adică până când
 * Adriana scrie textul lung — se randează paragrafele din teaserul aprobat de
 * pe homepage, ca pagina să nu fie un schelet gol (STATUS §7).
 */
export default async function DesprePage() {
  const [about, settings] = await Promise.all([getAboutContent(), getSiteSettings()])

  return (
    <>
      <Breadcrumb trail={TRAIL} />

      <main id="continut">
        <PageHeader eyebrow={about.eyebrow} title={about.title} lead={about.lead} tight />

        <Section padding="bottom-only" aria-labelledby="narativ-titlu">
          <h2 id="narativ-titlu" className="ac-sr-only">
            Povestea profesională
          </h2>

          <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-col-gap">
            <figure className="ac-media w-full max-w-[520px]">
              <ImageSlot
                content={about.portrait}
                priority
                reveal="clip-on-load"
                sizes="(max-width: 1000px) 100vw, 520px"
              />
              {about.portrait.caption && (
                <figcaption className="mt-4 font-medium text-label uppercase text-ac-ink-50">
                  {about.portrait.caption}
                </figcaption>
              )}
            </figure>

            <div>
              {about.narrative ? (
                <RichText content={about.narrative} className="[--ac-prose-width:62ch]" />
              ) : (
                <div className="grid max-w-[62ch] gap-6">
                  {about.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="text-body-lg text-ac-ink-70">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/*
                Formările ca listă structurată, nu ca paragraf: promptul §5.3 o
                cere explicit, iar o listă e fragmentul pe care un motor de
                răspuns îl poate prelua ca atare (brief §9.1).
              */}
              <section aria-labelledby="repere-titlu" className="mt-[clamp(48px,6vw,72px)]">
                <h2
                  id="repere-titlu"
                  className="font-medium text-label uppercase text-ac-accent-ink"
                >
                  Repere profesionale
                </h2>

                <ul className="mt-7 border-t border-ac-line">
                  {about.credentials.map((credential) => (
                    <li
                      key={credential.text}
                      className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-ac-line py-4"
                    >
                      <span className="text-body text-ac-ink">{credential.text}</span>
                      {credential.detail && (
                        <span className="font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-50">
                          {credential.detail}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </Shell>
        </Section>

        <Section tone="cream" aria-labelledby="principii-titlu">
          <Shell>
            <h2
              id="principii-titlu"
              className="max-w-[22ch] font-display text-h2-col font-light"
            >
              Patru principii după care lucrez
            </h2>

            {/*
              Exact patru principii, deci 2×2, nu `auto-fit`: acela alege trei
              coloane la lățimile obișnuite și lasă al patrulea singur pe rând.
            */}
            <ul className="mt-[clamp(48px,6vw,80px)] grid max-w-[1100px] gap-[clamp(32px,4vw,72px)] min-[760px]:grid-cols-2">
              {about.principles.map((principle, index) => (
                <Reveal
                  as="li"
                  key={principle.index}
                  start={`${index * 4}%`}
                  end={`${26 + index * 4}%`}
                >
                  <span
                    aria-hidden="true"
                    className="block font-display text-numeral font-light text-ac-accent"
                  >
                    {principle.index}
                  </span>
                  <h3 className="mt-5 font-display text-h3-card font-normal">{principle.title}</h3>
                  <p className="mt-4 max-w-[46ch] text-body text-ac-ink-70">{principle.body}</p>
                </Reveal>
              ))}
            </ul>
          </Shell>
        </Section>

        {/* CTA dublu, cerut de prompt §5.3 pentru această pagină. */}
        <PageCta
          eyebrow={{ text: 'Primul pas', ornament: 'pulse' }}
          heading="Dacă te-ai recunoscut undeva mai sus, hai să vorbim."
          body="Prima discuție este despre situația ta, nu despre pachete. Dacă nu este potrivit să lucrăm împreună, îți spun."
          primary={{ label: 'Programează o discuție', href: '/contact' }}
          secondary={{ label: 'Vezi pachetele', href: '/servicii' }}
          note={settings.responseTime}
        />
      </main>

      <JsonLd
        data={graph([
          profilePageSchema(settings, '/despre'),
          personSchema(settings, about.portrait.src ?? undefined),
          breadcrumbSchema(TRAIL, settings.url),
        ])}
      />
    </>
  )
}

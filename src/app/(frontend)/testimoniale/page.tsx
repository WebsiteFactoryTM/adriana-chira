import type { Metadata } from 'next'

import { PageHeader } from '@/components/layout/PageHeader'
import { PageCta } from '@/components/sections/PageCta'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { Rule, Section, Shell } from '@/components/ui/Section'
import { testimonialsPage } from '@/content/testimonials'
import type { Testimonial } from '@/content/types'
import { getSiteSettings, getTestimonials } from '@/lib/content'
import {
  breadcrumbSchema,
  collectionPageSchema,
  graph,
  professionalServiceSchema,
  reviewSchemas,
} from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

const PATH = '/testimoniale'

const TRAIL: Crumb[] = [
  { label: 'Acasă', href: '/' },
  { label: 'Recomandări', href: PATH },
]

export const metadata: Metadata = pageMetadata({
  title: testimonialsPage.title,
  description: testimonialsPage.metaDescription,
  path: PATH,
})

/** ISR: recomandările se schimbă rar, iar hook-ul de salvare invalidează imediat. */
export const revalidate = 3600

/**
 * Recomandările, integral.
 *
 * ## De ce o pagină proprie, și nu doar cardurile de pe homepage
 *
 * Pentru că textele sunt lungi, iar lungimea lor e chiar argumentul. Trei
 * oameni au scris fiecare între cinci și opt paragrafe despre cum e să lucrezi
 * cu Adriana; tăiate la câte o frază, ar fi arătat ca orice bandă de
 * testimoniale de pe orice site. Aici stau întregi, semnate, cu ancoră proprie,
 * ca fraza de pe homepage să poată fi verificată în context de oricine.
 *
 * ## Ce nu are pagina
 *
 * Note, stele și medii. Explicat în pagină, nu doar în cod: nimeni nu a fost
 * rugat să dea un punctaj, iar o medie construită din nimic ar fi o cifră
 * inventată. Marcajul urmează aceeași regulă — `Review` fără `reviewRating`.
 */
export default async function TestimonialePage() {
  const [testimonials, settings] = await Promise.all([getTestimonials(), getSiteSettings()])

  return (
    <>
      <Breadcrumb trail={TRAIL} />

      <main id="continut">
        <PageHeader
          eyebrow={testimonialsPage.eyebrow}
          title={testimonialsPage.title}
          lead={testimonialsPage.lead}
          tight
        />

        <Section padding="bottom-only" aria-labelledby="recomandari-titlu">
          <Shell>
            <h2 id="recomandari-titlu" className="ac-sr-only">
              Recomandările primite
            </h2>

            <div className="grid gap-[clamp(64px,8vw,120px)]">
              {testimonials.map((testimonial, index) => (
                <Entry
                  key={testimonial.slug}
                  testimonial={testimonial}
                  last={index === testimonials.length - 1}
                />
              ))}
            </div>

            <p className="mt-[clamp(48px,6vw,80px)] max-w-[70ch] border-t border-ac-line pt-8 text-body-sm leading-[1.75] text-ac-ink-50">
              {testimonialsPage.note}
            </p>
          </Shell>
        </Section>

        <PageCta
          eyebrow={{ text: 'Primul pas', ornament: 'pulse' }}
          heading="Dacă te-ai regăsit în ce au scris, hai să vorbim."
          body="Prima discuție este despre situația ta, nu despre pachete. Dacă nu este potrivit să lucrăm împreună, îți spun."
          primary={{ label: 'Programează o discuție', href: '/contact' }}
          note={settings.responseTime}
        />
      </main>

      <JsonLd
        data={graph([
          collectionPageSchema(
            {
              name: 'Recomandări',
              description: testimonialsPage.metaDescription,
              path: PATH,
              items: testimonials.map((item) => ({
                name: `Recomandare de la ${item.author}`,
                path: `${PATH}#${item.slug}`,
              })),
            },
            settings,
          ),
          breadcrumbSchema(TRAIL, settings.url),
          // Subiectul recomandărilor. Fără el, `itemReviewed` ar trimite la un
          // nod care nu există pe pagina asta.
          professionalServiceSchema(settings),
          // `full: true` — aici este afișat chiar textul integral, deci
          // marcajul are voie să îl poarte pe tot (brief §8.3).
          ...reviewSchemas(testimonials, settings, PATH, { full: true }),
        ])}
      />
    </>
  )
}

/**
 * O recomandare întreagă.
 *
 * `<blockquote>` cu `<cite>` în `<figcaption>`: singura formă din care se
 * înțelege, și din marcaj, și dintr-un cititor de ecran, că textul aparține
 * altcuiva. Numele stă DUPĂ text, ca într-o scrisoare — nu deasupra, ca într-o
 * fișă de produs.
 */
function Entry({ testimonial, last }: { testimonial: Testimonial; last: boolean }) {
  return (
    <figure id={testimonial.slug} className="scroll-mt-[132px]">
      <span aria-hidden="true" className="block h-px w-10 bg-ac-accent" />

      <blockquote className="mt-8 grid max-w-[68ch] gap-6">
        {testimonial.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={
              index === 0
                ? 'font-display text-lead font-light text-ac-ink'
                : 'text-body-lg text-ac-ink-70'
            }
          >
            {paragraph}
          </p>
        ))}
      </blockquote>

      <figcaption className="mt-9">
        <cite className="block font-display text-h3 font-normal not-italic text-ac-ink">
          {testimonial.author}
        </cite>
        {/* Funcția lipsește la unele recomandări; rândul dispare, nu se umple. */}
        {testimonial.role && (
          <p className="mt-2 max-w-[52ch] text-body-sm leading-[1.7] text-ac-ink-70">
            {testimonial.role}
          </p>
        )}
        {testimonial.context && (
          <p className="mt-1 max-w-[52ch] text-body-sm leading-[1.7] text-ac-ink-50">
            {testimonial.context}
          </p>
        )}
      </figcaption>

      {!last && <Rule className="mt-[clamp(48px,6vw,80px)]" />}
    </figure>
  )
}

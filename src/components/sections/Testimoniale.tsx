import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section, Shell } from '@/components/ui/Section'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { TextLink } from '@/components/ui/TextLink'
import { testimonialsSection } from '@/content/testimonials'
import type { Testimonial } from '@/content/types'

/**
 * Recomandările, pe homepage.
 *
 * NOTĂ DESIGN: aceasta este singura secțiune de conținut din homepage care NU
 * există în `design/homepage-approved.html`. Designul aprobat are douăsprezece
 * secțiuni; aceasta e a treisprezecea. A fost cerută explicit de clientă, în
 * sesiunea din 7 septembrie 2026, odată cu livrarea celor trei recomandări
 * (STATUS.md §9). Nu se elimină și nu se mută fără acordul ei.
 *
 * Ce s-a păstrat, ca să nu se simtă adăugată:
 *
 * - **Poziția.** Între blocul de citat și pachete. Ritmul de fundal rămâne
 *   citit corect — ink, apoi crem, apoi hârtie — iar dovada socială cade fix
 *   înaintea prețurilor, unde chiar contează.
 * - **Limbajul vizual.** Aceeași grilă de trei carduri, aceleași margini,
 *   aceeași etichetă versală și același `h2` ca la secțiunea de servicii. Nu
 *   s-a inventat nicio formă nouă.
 * - **Textele lungi nu intră aici.** Cardul poartă o singură frază, iar
 *   recomandarea întreagă stă pe `/testimoniale`. O secțiune cu trei texte de
 *   câte opt paragrafe ar fi rupt ritmul paginii în două.
 *
 * Secțiunea dispare complet dacă nu există nicio recomandare marcată pentru
 * homepage — o etichetă urmată de nimic e mai rea decât absența ei.
 */
export function Testimoniale({ testimonials }: { testimonials: Testimonial[] }) {
  const featured = testimonials.filter((item) => item.featured).slice(0, 3)
  if (featured.length === 0) return null

  return (
    <Section id="testimoniale" tone="cream" aria-labelledby="testimoniale-titlu">
      <Shell>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow content={testimonialsSection.eyebrow} />
            <h2
              id="testimoniale-titlu"
              className="mt-8 max-w-[20ch] font-display text-h2-wide font-light"
            >
              {testimonialsSection.heading}
            </h2>
          </div>

          <p className="max-w-[44ch] text-body text-ac-ink-70">
            Publicate integral, semnate cu numele și funcția celor care le-au scris. Fraza de pe
            fiecare card este copiată din textul de dedesubt, nu rezumată.
          </p>
        </div>

        <div className="mt-block grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-stretch gap-[clamp(20px,2.4vw,32px)]">
          {featured.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.slug}
              testimonial={testimonial}
              index={index}
              href={`/testimoniale#${testimonial.slug}`}
            />
          ))}
        </div>

        <div className="mt-[clamp(40px,5vw,64px)] flex justify-end">
          <TextLink href={testimonialsSection.link.href} className="text-body" arrow>
            {testimonialsSection.link.label}
          </TextLink>
        </div>
      </Shell>
    </Section>
  )
}

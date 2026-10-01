import { Arrow } from '@/components/ui/Button'
import { GlyphBadge } from '@/components/ui/Glyph'
import { ResourceForm } from '@/components/ui/ResourceForm'
import type { ResourceSummary } from '@/content/types'
import { resourceFileHref } from '@/lib/resources'

/**
 * Resursele de la finalul unui articol. **Server Component, zero JS.**
 *
 * Stau după text și înaintea blocului de partajare: momentul în care omul a
 * terminat de citit și a primit deja ceva e momentul în care un document în
 * plus pare un cadou, nu o condiție.
 *
 * - **liberă** → buton „Descarcă", direct spre fișier;
 * - **cu formular** → formularul se deschide pe loc, într-un `<details>` nativ.
 *   Fără pagină intermediară (fiecare click în plus pierde oameni) și fără
 *   JavaScript: `<details>` face exact asta, iar câmpurile rămân în HTML.
 *
 * Cardul nu pune adresa fișierului în pagină pentru resursele cu formular —
 * nici nu o are (`ResourceSummary` nu o conține).
 */
type Props = {
  resources: ResourceSummary[]
  postId: number
}

export function ResourceList({ resources, postId }: Props) {
  if (resources.length === 0) return null

  return (
    <section aria-labelledby="resurse-titlu" className="mt-[clamp(48px,6vw,80px)]">
      <h2 id="resurse-titlu" className="font-medium text-label uppercase text-ac-accent-ink">
        {resources.length === 1 ? 'Resursă pentru acest articol' : 'Resurse pentru acest articol'}
      </h2>

      <ul className="mt-5 grid gap-5">
        {resources.map((resource) => (
          <li
            key={resource.slug}
            id={`resursa-${resource.slug}`}
            className="relative scroll-mt-[120px] rounded-card border border-ac-line bg-ac-cream-50 p-[clamp(24px,3vw,36px)]"
          >
            <div className="flex items-start gap-5">
              <GlyphBadge name="document" className="bg-ac-paper max-sm:hidden" />

              <div className="min-w-0">
                <p className="font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-70">
                  {resource.meta} · Gratuit
                </p>
                <h3 className="mt-2 font-display text-h3 font-normal text-balance">
                  {resource.title}
                </h3>
                {resource.description && (
                  <p className="mt-3 max-w-[56ch] text-body-sm leading-[1.7] text-ac-ink-70">
                    {resource.description}
                  </p>
                )}
              </div>
            </div>

            {resource.access === 'free' ? (
              <div className="mt-6 sm:pl-16">
                {/* `<a>` simplu, nu `Button`: acela folosește `next/link` pentru
                    adresele interne, iar `Link` ar preîncărca fișierul. */}
                <a
                  href={resourceFileHref(resource.slug)}
                  download
                  className="inline-flex min-h-11 items-center justify-center gap-[10px] rounded-pill border border-ac-ink px-7 py-4 font-medium text-btn uppercase text-ac-ink transition-[background-color,color] duration-[320ms] ease-ac hover:bg-ac-ink hover:text-ac-paper"
                >
                  Descarcă <Arrow />
                </a>
              </div>
            ) : (
              <details className="group mt-6 sm:pl-16">
                <summary className="inline-flex min-h-11 cursor-pointer list-none items-center justify-center gap-[10px] rounded-pill border border-ac-ink px-7 py-4 font-medium text-btn uppercase text-ac-ink transition-[background-color,color] duration-[320ms] ease-ac hover:bg-ac-ink hover:text-ac-paper group-open:hidden [&::-webkit-details-marker]:hidden">
                  Primește documentul <Arrow />
                </summary>

                <div className="border-t border-ac-line pt-6">
                  <p className="mb-6 max-w-[56ch] text-body-sm leading-[1.7] text-ac-ink-70">
                    Lasă-mi datele de mai jos și documentul se descarcă imediat.
                  </p>
                  <ResourceForm resourceSlug={resource.slug} postId={postId} />
                </div>
              </details>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

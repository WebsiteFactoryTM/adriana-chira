import Link from 'next/link'

import { Shell } from '@/components/ui/Section'
import { cn } from '@/lib/cn'

/**
 * Firul Ariadnei.
 *
 * Marcajul `BreadcrumbList` se generează separat, din aceeași listă
 * (`breadcrumbSchema` în `src/lib/schema.ts`), ca schema să reflecte exact ce
 * vede utilizatorul — regula din brief §8.3.
 *
 * Ultimul element nu este link: este pagina curentă. `aria-current="page"` îl
 * anunță, iar cititoarele de ecran nu mai citesc un link care nu duce nicăieri.
 */

export type Crumb = {
  label: string
  href: string
}

export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  if (trail.length === 0) return null
  const last = trail.length - 1

  /*
    Pe telefon, un fir de trei niveluri se rupe pe două rânduri de versale
    rărite — „ACASĂ / SERVICII / EXECUTIVE PERFORMANCE PROGRAM™" — și repetă
    cu litere mici titlul care urmează imediat dedesubt. Acolo rămâne doar
    pasul înapoi, singurul util pe un ecran mic. Lista completă e tot în
    HTML (ascunsă doar vizual sub 640px), iar `BreadcrumbList` din datele
    structurate nu se schimbă, deci SEO-ul nu pierde nimic.
  */
  const parent = trail.length >= 3 ? trail[last - 1] : undefined

  return (
    <nav aria-label="Firul Ariadnei" className="pt-[clamp(28px,4vw,52px)] short:pt-6">
      <Shell>
        {parent && (
          <Link
            href={parent.href}
            className="ac-underline inline-flex min-h-11 items-center gap-[10px] font-medium text-label uppercase leading-[normal] text-ac-ink-70 sm:hidden"
          >
            <span aria-hidden="true">←</span>
            {parent.label}
          </Link>
        )}

        <ol
          className={cn(
            'flex flex-wrap items-center gap-x-[10px] gap-y-2 font-medium text-label uppercase text-ac-ink-50',
            parent && 'max-sm:hidden',
          )}
        >
          {trail.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center gap-[10px]">
              {index === last ? (
                <span aria-current="page" className="text-ac-accent-ink">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="ac-underline leading-[normal]">
                  {crumb.label}
                </Link>
              )}
              {index < last && (
                <span aria-hidden="true" className="text-ac-line">
                  /
                </span>
              )}
            </li>
          ))}
        </ol>
      </Shell>
    </nav>
  )
}

import Link from 'next/link'

import { Shell } from '@/components/ui/Section'

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

  return (
    <nav aria-label="Firul Ariadnei" className="pt-[clamp(28px,4vw,52px)]">
      <Shell>
        <ol className="flex flex-wrap items-center gap-x-[10px] gap-y-2 font-medium text-label uppercase text-ac-ink-50">
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

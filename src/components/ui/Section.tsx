import type { ReactNode } from 'react'
import { type AuraVariant, SectionAura } from '@/components/ui/SectionAura'
import { cn } from '@/lib/cn'

/**
 * Învelișul unei secțiuni de homepage.
 *
 * Ritmul de fundal paper → cream → paper → … → ink → … → cream-100 este cel
 * din brief §6.2 și din designul aprobat. Un singur bloc `ink` în corpul
 * paginii (secțiunea de citat); footerul nu intră la socoteală.
 */

type Tone = 'paper' | 'cream' | 'cream-100' | 'ink'

const TONES: Record<Tone, string> = {
  paper: '',
  cream: 'bg-ac-cream-50',
  'cream-100': 'bg-ac-cream-100',
  ink: 'bg-ac-ink text-ac-paper',
}

type Props = {
  /**
   * Ancora secțiunii. Pe homepage sunt cele 12 `id`-uri din designul aprobat;
   * paginile interioare își aleg singure ancorele, iar unele secțiuni nu au
   * nevoie de niciuna.
   */
  id?: string
  tone?: Tone
  /** Secțiunile care continuă vizual precedenta nu au padding sus. */
  padding?: 'default' | 'tight' | 'wide' | 'cta' | 'body' | 'bottom-only' | 'none'
  /**
   * Aura de atenție. Pusă doar pe cele cinci secțiuni în care cititorul
   * trebuie să încetinească — vezi `SectionAura`. `isolate` e obligatoriu:
   * ține stratul de `z-index: -1` deasupra fundalului secțiunii, dar sub
   * conținut, fără să atingem markup-ul niciunei secțiuni.
   */
  aura?: AuraVariant
  className?: string
  'aria-labelledby'?: string
  children: ReactNode
}

const PADDING: Record<NonNullable<Props['padding']>, string> = {
  default: 'py-section',
  tight: 'py-section-tight',
  wide: 'py-section-wide',
  cta: 'py-section-cta',
  /* Benzile de conținut ale paginilor lungi. Vezi tokenul din globals.css. */
  body: 'py-section-body',
  'bottom-only': 'pb-section',
  none: '',
}

export function Section({
  id,
  tone = 'paper',
  padding = 'default',
  aura,
  className,
  children,
  ...rest
}: Props) {
  return (
    <section
      id={id}
      className={cn(TONES[tone], PADDING[padding], aura && 'relative isolate', className)}
      {...rest}
    >
      {aura && <SectionAura variant={aura} />}
      {children}
    </section>
  )
}

/** Coloana de conținut: 1560px, gutters clamp(24px, 5vw, 88px). */
export function Shell({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('ac-shell', className)}>{children}</div>
}

/**
 * Coloană stângă care rămâne fixată în timpul derulării, pe desktop.
 * Sub 1000px devine flux normal.
 */
export function StickyColumn({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('static min-[1000px]:sticky min-[1000px]:top-[132px]', className)}>{children}</div>
}

/** Hairline orizontal, 1px, în culoarea liniilor. */
export function Rule({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('h-px bg-ac-line', className)} />
}

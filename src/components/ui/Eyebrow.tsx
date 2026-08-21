import { cn } from '@/lib/cn'
import type { Eyebrow as EyebrowContent } from '@/content/types'

/**
 * Eticheta versală de deasupra fiecărui titlu de secțiune.
 * Trei ornamente, exact ca în designul aprobat:
 *   line  — liniuță statică de 40px în accent
 *   pulse — punct cu halou + fascicul care mătură hairline-ul (secțiunile-cheie)
 *   none  — doar text (secțiunea „Cum lucrez", centrată)
 */

type Props = {
  content: EyebrowContent
  /** Pe fundal crem accentul are nevoie de varianta mai închisă (AA). */
  tone?: 'default' | 'onCream'
  className?: string
  center?: boolean
  /**
   * Acolo unde eticheta ESTE titlul secțiunii (ex. „Valori"), se randează ca
   * `h2` — păstrează ierarhia de headinguri fără text ascuns doar pentru SEO.
   */
  as?: 'p' | 'h2'
  id?: string
}

export function Eyebrow({
  content,
  tone = 'default',
  className,
  center = false,
  as: Tag = 'p',
  id,
}: Props) {
  const color = tone === 'onCream' ? 'text-ac-accent-deep' : 'text-ac-accent-ink'

  return (
    <Tag
      id={id}
      className={cn(
        'flex items-center gap-[14px] font-medium text-eyebrow uppercase',
        color,
        center && 'justify-center',
        className,
      )}
    >
      {content.ornament === 'line' && (
        <span aria-hidden="true" className="block h-px w-10 shrink-0 bg-ac-accent" />
      )}
      {content.ornament === 'pulse' && <PulseOrnament tone={tone} />}
      {content.text}
    </Tag>
  )
}

/** Punct pulsant + fascicul. Pur decorativ, ascuns pentru cititoarele de ecran. */
function PulseOrnament({ tone }: { tone: 'default' | 'onCream' }) {
  return (
    <span aria-hidden="true" className="relative flex shrink-0 items-center gap-[10px]">
      <span className="relative block size-[7px]">
        <span className="absolute inset-0 rounded-pill bg-ac-accent-ink shadow-[0_0_8px_1px_rgba(192,164,123,.75)]" />
        <span className="absolute inset-0 animate-[acRingPulse_3.6s_var(--ease-ac)_infinite_both] rounded-pill border border-ac-accent" />
      </span>
      {tone === 'default' && (
        <span className="relative block h-px w-[52px] overflow-hidden bg-ac-line">
          <span className="absolute inset-0 animate-[acAccentSweep_4.2s_cubic-bezier(.4,0,.4,1)_infinite_both] bg-[linear-gradient(90deg,rgba(192,164,123,0),#7A6038,rgba(192,164,123,0))]" />
        </span>
      )}
    </span>
  )
}

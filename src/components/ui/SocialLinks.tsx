import { Glyph, type GlyphName } from '@/components/ui/Glyph'
import type { SocialLink } from '@/content/types'
import { cn } from '@/lib/cn'

/**
 * Rețelele sociale, ca pictograme — în subsol, la finalul meniului mobil și
 * pe pagina de contact (cerut pe 12 octombrie 2026; înainte erau text).
 *
 * Server Component. Meniul mobil e componentă de client, dar primește rândul
 * deja randat, ca slot (`social` pe `MobileNav`): semnele nu intră în bundle.
 *
 * Fiecare legătură e o pastilă de 44px cu hairline — forma lui `GlyphBadge`,
 * deci aceeași țintă de atingere și același limbaj ca restul semnelor din
 * site. Numele rețelei stă în text ascuns (pentru cititoarele de ecran) și în
 * `title` (pentru mouse); semnul rămâne `aria-hidden`, ca toate celelalte.
 *
 * Etichetele vin din `site-settings` (opțiunile câmpului `platform`) sau din
 * `src/content/site.ts`. O platformă fără semn desenat apare ca text în
 * pastilă, nu dispare.
 */

const GLYPHS: Record<string, GlyphName> = {
  LinkedIn: 'linkedin',
  Instagram: 'instagram',
  Facebook: 'facebook',
  YouTube: 'youtube',
  TikTok: 'tiktok',
}

const TONES = {
  // Pe hârtie și pe crem: accentul închis trece AA pe ambele (5.44 / 4.98:1).
  light: 'border-ac-line text-ac-accent-ink hover:border-ac-accent hover:text-ac-ink',
  // Pe blocul de cerneală al subsolului: aceeași rețetă ca insignele ANPC/SOL.
  dark: 'border-[rgba(250,245,236,.22)] text-ac-cream-100 hover:border-ac-accent hover:text-ac-paper',
} as const

type Props = {
  links: SocialLink[]
  tone?: keyof typeof TONES
  /**
   * Subsolul arată conturile neconfirmate ca placeholder, ca restul datelor
   * lipsă de acolo. Meniul și pagina de contact le sar.
   */
  placeholders?: boolean
  className?: string
}

export function SocialLinks({ links, tone = 'light', placeholders = false, className }: Props) {
  const visible = placeholders ? links : links.filter((item) => !item.pending)
  if (visible.length === 0) return null

  return (
    <ul aria-label="Rețele sociale" className={cn('flex flex-wrap gap-3', className)}>
      {visible.map((item) => {
        if (item.pending) {
          return (
            <li key={item.label} className="flex min-h-11 items-center text-body-sm leading-[normal]">
              <span data-placeholder>[ {item.label} ]</span>
            </li>
          )
        }

        const glyph = GLYPHS[item.label]
        return (
          <li key={item.label}>
            <a
              href={item.href}
              target="_blank"
              rel="me noopener"
              title={item.label}
              className={cn(
                'flex min-h-11 min-w-11 items-center justify-center rounded-pill border transition-colors duration-[320ms]',
                glyph ? 'size-11' : 'px-[18px] text-body-sm leading-[normal]',
                TONES[tone],
              )}
            >
              {glyph ? (
                <>
                  <Glyph name={glyph} />
                  <span className="ac-sr-only">{item.label}</span>
                </>
              ) : (
                item.label
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

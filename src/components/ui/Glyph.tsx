import { cn } from '@/lib/cn'

/**
 * Setul de pictograme al site-ului. **Desenate aici, nu importate.**
 *
 * ## De ce nu o bibliotecă de iconuri
 *
 * Regula 4 din STATUS §2 interzice bibliotecile de componente, dar motivul
 * real e altul și e de design: seturile obișnuite (Lucide, Feather, Heroicons)
 * sunt desenate la 1.5–2px, cu colțuri rotunjite și cu un vocabular de
 * aplicație — o rotiță, o bifă în cerc, un rucsac. Puse peste Cormorant
 * Garamond și peste hairline-urile de 1px ale designului aprobat, ar arăta ca
 * un panou de administrare lipit peste o pagină editorială.
 *
 * Cele de aici sunt trasate în chiar limbajul paginii: **linie de 1px, în
 * accent, fără umplere, fără colțuri rotunjite decorative**, pe o casetă de 24
 * de unități. Sunt semne, nu ilustrații: rolul lor e să spună dintr-o privire
 * ce fel de bloc urmează, ca ochiul să poată sări peste ce nu îl interesează.
 *
 * ## Cum se folosesc
 *
 * Un semn **per tip de bloc**, nu unul per rând de listă. Un semn repetat pe
 * fiecare element dintr-o listă de nouă nu mai transmite nimic — devine
 * marcator de listă, și pentru asta există `<ul>`. Excepția e `check`, care
 * chiar marchează elemente și de aceea are o variantă mică.
 *
 * Toate sunt `aria-hidden`: informația stă în titlul de lângă ele. Un semn
 * care ar avea nevoie de etichetă proprie ar însemna că textul e incomplet.
 */

export type GlyphName =
  /** Listă de simptome, de situații în care te poți regăsi. */
  | 'check'
  /** Dimensiuni, arii, roluri — lucruri care stau alături, nu în ordine. */
  | 'grid'
  /** Proces: etape care se parcurg în ordine. */
  | 'path'
  /** Ce primești la final: rezultate, livrabile. */
  | 'diamond'
  /** Două fețe ale aceleiași alegeri: cui i se potrivește și cui nu. */
  | 'split'
  /** Promisiune, principiu, frază care se citează. */
  | 'quote'
  /** Durată, orar. */
  | 'clock'
  /** Locul de desfășurare. */
  | 'place'
  /** Preț, investiție. */
  | 'coin'
  /** Data ediției. */
  | 'calendar'
  /** Format: online sau față în față. */
  | 'screen'
  /** Ce include prețul. */
  | 'layers'

/**
 * Căile, în coordonate de casetă 24×24.
 *
 * Scrise ca DATE, nu ca JSX repetat: adăugarea unui semn nou e un rând, iar
 * greutatea liniei și dimensiunea casetei rămân imposibil de nimerit greșit.
 */
const PATHS: Record<GlyphName, string> = {
  // Bifă deschisă, fără cerc în jur — cercul ar îngroșa vizual rândul.
  check: 'M4 12.6 9.2 18 20 6',
  // Patru puncte: lucruri care coexistă.
  grid: 'M6 6h4v4H6zM14 6h4v4h-4zM6 14h4v4H6zM14 14h4v4h-4z',
  // Traseu cu trei opriri: ordinea contează.
  path: 'M3 18C7 18 8 6 12 6s5 12 9 12M3 18h.01M12 6h.01M21 18h.01',
  // Romb: rezultatul, lucrul cu care pleci.
  diamond: 'M12 3 21 12l-9 9-9-9z',
  // Cerc tăiat în două: aceeași întrebare, două răspunsuri.
  split: 'M12 3a9 9 0 0 0 0 18 9 9 0 0 0 0-18zM12 3v18',
  // Ghilimele deschise, în forma din text.
  quote: 'M9 15V9H3v6h6zm0 0c0 3-2 5-5 5M21 15V9h-6v6h6zm0 0c0 3-2 5-5 5',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5.4l3.4 2',
  // Reper pe hartă, deschis dedesubt.
  place: 'M12 21c4-4.6 6-8 6-10.5A6 6 0 0 0 6 10.5C6 13 8 16.4 12 21zM12 8.5v4M10 10.5h4',
  coin: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v10M9.2 9.4h5.6M9.2 14.6h5.6',
  calendar: 'M4 7h16v14H4zM4 11h16M8 3v6M16 3v6',
  screen: 'M3 5h18v12H3zM9 21h6M12 17v4',
  layers: 'M12 3 3 8l9 5 9-5-9-5zM3 13l9 5 9-5M3 18l9 3 9-3',
}

type Props = {
  name: GlyphName
  /** `sm` = 16px, marcator de rând. `md` = 22px, semn de bloc. */
  size?: 'sm' | 'md'
  className?: string
}

export function Glyph({ name, size = 'md', className }: Props) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('block shrink-0', size === 'sm' ? 'size-4' : 'size-[22px]', className)}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}

/**
 * Semnul unui bloc, în pastila lui.
 *
 * Cercul hairline din jur nu e ornament: fără el, un semn de 22px pus lângă un
 * `h2` de 36px plutește: nu e nici parte din titlu, nici element de sine
 * stătător. Pastila îi dă o greutate proprie și repetă chiar forma din care e
 * construit restul paginii — cerc de 1px în culoarea liniilor.
 */
export function GlyphBadge({ name, className }: { name: GlyphName; className?: string }) {
  return (
    <span
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-pill border border-ac-line text-ac-accent-ink',
        className,
      )}
    >
      <Glyph name={name} />
    </span>
  )
}

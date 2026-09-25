import Link from 'next/link'

import type { NavItem } from '@/content/types'
import { cn } from '@/lib/cn'

/**
 * Submeniul din antetul de desktop. **Server Component, zero JavaScript.**
 *
 * ## De ce nu e a cincea componentă de client
 *
 * Un meniu care se deschide pare, din reflex, o chestiune de stare. Nu este:
 * `:hover` rezolvă mouse-ul, iar `:focus-within` rezolvă tastatura, amândouă
 * din CSS. Site-ul are exact patru componente de client (STATUS §2, regula 2)
 * și niciuna nu se justifică prin „meniul trebuie să se deschidă".
 *
 * ## De ce panoul e ascuns din `opacity`, nu din `display` sau `visibility`
 *
 * `display: none` și `visibility: hidden` scot linkurile din ordinea de
 * tabulare — iar atunci `:focus-within` nu se mai poate declanșa niciodată,
 * pentru că nimic din interior nu mai poate primi focus. Rezultatul ar fi un
 * meniu inaccesibil de la tastatură, care arată perfect cu mouse-ul.
 *
 * Ascunderea din `opacity: 0` + `pointer-events: none` păstrează linkurile
 * focusabile: prima tastă Tab intră în panou, `:focus-within` devine adevărat
 * și panoul se aprinde. Cu mouse-ul, `pointer-events: none` împiedică apăsarea
 * a ceva ce nu se vede.
 *
 * ## Puntea de hover
 *
 * Paddingul de sus stă pe învelișul poziționat, nu pe cartelă. Așa spațiul
 * dintre intrarea din meniu și panou face parte din zona de hover, iar meniul
 * nu se închide când cobori mouse-ul spre el.
 */
type Props = {
  item: NavItem & { children: NavItem[] }
  /** Panoul lat, pe două coloane, pentru catalogul de paisprezece workshopuri. */
  wide?: boolean
  /** Textul rândului final, care duce la pagina întreagă. */
  allLabel: string
}

export function NavDropdown({ item, wide = false, allLabel }: Props) {
  return (
    <div className="group relative">
      <Link
        href={item.href}
        className="ac-underline flex min-h-11 items-center gap-[7px] py-3 text-nav whitespace-nowrap"
      >
        {item.label}
        <span
          aria-hidden="true"
          /* `transition-[translate]`, nu `transition-transform`: în Tailwind v4
             `translate-y-*` scrie proprietatea `translate`, independentă de
             `transform` (vezi capcana din STATUS §10). Pe `transform` nu s-ar
             anima nimic. */
          className="block text-[9px] leading-none text-ac-accent-ink transition-[translate] duration-[320ms] ease-ac group-hover:translate-y-[2px] group-focus-within:translate-y-[2px]"
        >
          ▾
        </span>
      </Link>

      <div
        className={cn(
          // Ancorat la dreapta: panoul crește spre interiorul paginii, deci nu
          // iese din ecran nici la 1000px, unde intrarea stă deja aproape de
          // marginea din dreapta.
          'pointer-events-none absolute top-full right-0 z-10 translate-y-[6px] pt-4 opacity-0',
          // `translate`, nu `transform` — vezi nota de la săgeată.
          'transition-[opacity,translate] duration-[320ms] ease-ac',
          'group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100',
          'group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100',
        )}
      >
        <div
          className={cn(
            'rounded-card border border-ac-line bg-ac-paper p-3',
            wide ? 'w-[min(600px,calc(100vw-40px))]' : 'w-[min(380px,calc(100vw-40px))]',
          )}
        >
          <ul className={cn('grid', wide && 'grid-cols-2 gap-x-2')}>
            {item.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className="block rounded-card px-4 py-[14px] transition-colors duration-[220ms] hover:bg-ac-cream-50 focus-visible:bg-ac-cream-50"
                >
                  <span className="block text-nav text-ac-ink">{child.label}</span>
                  {child.detail && (
                    <span className="mt-[6px] block text-[12px] leading-[1.5] text-ac-ink-50">
                      {child.detail}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={item.href}
            className="mt-1 block border-t border-ac-line px-4 pt-4 pb-2 font-medium text-[11px] tracking-[0.18em] uppercase text-ac-accent-ink"
          >
            {allLabel} →
          </Link>
        </div>
      </div>
    </div>
  )
}

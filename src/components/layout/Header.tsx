import { MobileNav } from './MobileNav'
import type { SiteSettings } from '@/content/types'

/**
 * Header sticky, translucid peste tot conținutul.
 *
 * NOTĂ DESIGN: brief §5.6 descria un header transparent care devine `paper`
 * după 80px de scroll. Designul aprobat (v3) l-a simplificat: bara este
 * mereu `rgba(paper, .82)` cu blur. Am implementat varianta aprobată — care
 * are și avantajul că elimină un Client Component (starea de scroll).
 */
export function Header({ settings }: { settings: SiteSettings }) {
  const cta = { label: 'Programează o discuție', href: '#cta' }

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(225,215,198,.9)] bg-[rgba(250,245,236,.82)] backdrop-blur-[14px] backdrop-saturate-[1.1]">
      <MobileNav items={settings.mobileNav} cta={cta} availability={settings.availability}>
        <a href="#hero" className="block">
          <span className="block font-display text-[21px] leading-[1.1] font-normal tracking-[0.01em]">
            {settings.siteName}
          </span>
          <span className="mt-[5px] block font-medium text-[10px] tracking-[0.26em] uppercase text-ac-ink-50">
            {settings.role}
          </span>
        </a>

        <nav
          aria-label="Navigație principală"
          className="ml-auto hidden flex-nowrap items-center gap-[clamp(14px,2vw,30px)] min-[1000px]:flex"
        >
          {settings.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="ac-underline flex min-h-11 items-center py-3 text-nav whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={cta.href}
          className="ml-5 hidden min-h-11 items-center gap-[10px] rounded-pill border border-ac-ink px-[22px] py-3 font-medium text-btn uppercase whitespace-nowrap transition-colors duration-[320ms] hover:bg-ac-ink hover:text-ac-paper min-[1000px]:flex"
        >
          <span aria-hidden="true" className="block size-[5px] rounded-pill bg-ac-accent" />
          Programează
        </a>
      </MobileNav>
    </header>
  )
}

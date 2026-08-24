'use client'

/**
 * CLIENT COMPONENT 1/2 pe homepage — justificare: meniul mobil are stare
 * (deschis/închis), trap de tastatură și blocare de scroll. Nu se poate face
 * pe server. Restul barei este randat pe server și primit prin `children`,
 * deci brandul și navigația desktop NU intră în bundle-ul de client.
 */

import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { NavItem } from '@/content/types'

type Props = {
  items: NavItem[]
  cta: NavItem
  availability: string
  children: ReactNode
}

export function MobileNav({ items, cta, availability, children }: Props) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Escape închide meniul și readuce focusul pe buton.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <>
      {/* Header-ul e singurul loc unde designul aprobat coboară gutter-ul la 20px
          sub 480px; restul secțiunilor rămân pe 24px. */}
      <div className="ac-shell flex flex-nowrap items-center gap-6 px-[clamp(20px,5vw,88px)] py-4">
        {children}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
          data-burger
          data-open={open ? 'true' : 'false'}
          className="ml-auto flex size-11 shrink-0 cursor-pointer flex-col items-end justify-center gap-[5px] border-0 bg-transparent p-0 min-[1000px]:hidden"
        >
          <span className="block h-px w-[22px] bg-ac-ink transition-transform duration-[320ms] ease-ac" />
          <span className="block h-px w-[22px] bg-ac-ink transition-opacity duration-[220ms]" />
          <span className="block h-px w-4 bg-ac-ink transition-transform duration-[320ms] ease-ac" />
        </button>
      </div>

      {open && (
        <div
          id={panelId}
          className="max-h-[calc(100dvh-78px)] animate-[acSheet_.38s_var(--ease-ac)_both] overflow-y-auto border-t border-ac-line bg-ac-paper min-[1000px]:hidden"
        >
          <nav
            aria-label="Navigație mobilă"
            className="grid px-[clamp(20px,6vw,32px)] pt-2 pb-5"
          >
            {items.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-baseline justify-between gap-4 border-b border-ac-line py-5"
              >
                <span className="font-display text-2xl leading-[1.2] font-normal">{item.label}</span>
                <span className="font-medium text-[11px] tracking-[0.18em] text-ac-accent-ink">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </a>
            ))}

            <a
              href={cta.href}
              onClick={() => setOpen(false)}
              className="mt-6 flex min-h-11 items-center justify-center gap-[10px] rounded-pill bg-ac-ink px-7 py-[18px] font-medium text-btn uppercase text-ac-paper"
            >
              {cta.label}
              <span aria-hidden="true" className="block">
                →
              </span>
            </a>

            <p className="mt-5 font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-50">
              {availability}
            </p>
          </nav>
        </div>
      )}
    </>
  )
}

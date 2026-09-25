'use client'

/**
 * CLIENT COMPONENT 1/2 pe homepage — justificare: meniul mobil are stare
 * (deschis/închis), trap de tastatură și blocare de scroll. Nu se poate face
 * pe server. Restul barei este randat pe server și primit prin `children`,
 * deci brandul și navigația desktop NU intră în bundle-ul de client.
 */

import Link from 'next/link'
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

  /*
    Submeniurile de desktop se închid după alegere.

    Panoul din `NavDropdown` e CSS pur — `:hover` și focus de tastatură — și
    rămâne așa. Problema e momentul de după click: navigarea Next păstrează
    antetul montat, deci mouse-ul rămâne peste panou și panoul rămâne deschis
    peste pagina nouă, acoperind exact ce a cerut omul să vadă. Asta nu se
    poate rezolva din CSS: nimic din CSS nu știe că „s-a ales ceva".

    De aceea, un singur ascultător delegat, aici, în componenta de client care
    trăiește deja în antet — nu o a cincea componentă de client pentru un
    listener. La click pe un link din panou, grupul primește
    `data-dismissed`, care stinge panoul peste `:hover`; atributul se scoate
    când mouse-ul iese din grup, deci următorul hover îl redeschide normal.
    `blur()` scoate focusul lăsat pe link, pentru cazul tastaturii (Enter).
  */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      // Și intrarea de sus („Servicii"), nu doar linkurile din panou: după
      // click pe ea, mouse-ul e tot deasupra, iar panoul ar acoperi pagina.
      const link = target.closest('[data-nav-dropdown] a')
      const group = link?.closest<HTMLElement>('[data-nav-dropdown]')
      if (!link || !group) return

      group.setAttribute('data-dismissed', '')
      if (link instanceof HTMLElement) link.blur()

      const restore = () => {
        group.removeAttribute('data-dismissed')
        group.removeEventListener('pointerleave', restore)
        document.removeEventListener('keydown', restore)
      }
      // Mouse-ul iese din grup, sau omul continuă de la tastatură.
      group.addEventListener('pointerleave', restore)
      document.addEventListener('keydown', restore)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

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
            {items.map((item, index) => {
              const numeral = String(index + 1).padStart(2, '0')

              /*
                Intrările cu submeniu se deschid pe `<details>` nativ, nu pe o
                a doua stare de React. Aceeași alegere ca la FAQ și la
                workshopuri, din același motiv: acordeonul nativ este gratuit
                în JavaScript, e accesibil de la tastatură fără nicio linie de
                cod și își păstrează conținutul în DOM și când e închis.
              */
              if (item.children && item.children.length > 0) {
                return (
                  <details key={item.href} className="border-b border-ac-line">
                    <summary className="flex min-h-11 items-baseline justify-between gap-4 py-5">
                      <span className="font-display text-2xl leading-[1.2] font-normal">
                        {item.label}
                      </span>
                      <span className="flex items-baseline gap-4">
                        <span className="font-medium text-[11px] tracking-[0.18em] text-ac-accent-ink">
                          {numeral}
                        </span>
                        <span data-plus aria-hidden="true" className="text-xl leading-none text-ac-accent">
                          +
                        </span>
                      </span>
                    </summary>

                    <ul className="pb-6">
                      <li>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="flex min-h-11 items-center border-t border-ac-line py-4 font-medium text-[11px] tracking-[0.18em] uppercase text-ac-accent-ink"
                        >
                          Vezi pagina {item.label.toLowerCase()} →
                        </Link>
                      </li>

                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="block border-t border-ac-line py-4"
                          >
                            <span className="block text-body text-ac-ink">{child.label}</span>
                            {child.detail && (
                              <span className="mt-1 block text-body-sm leading-[1.5] text-ac-ink-50">
                                {child.detail}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-baseline justify-between gap-4 border-b border-ac-line py-5"
                >
                  <span className="font-display text-2xl leading-[1.2] font-normal">
                    {item.label}
                  </span>
                  <span className="font-medium text-[11px] tracking-[0.18em] text-ac-accent-ink">
                    {numeral}
                  </span>
                </Link>
              )
            })}

            <Link
              href={cta.href}
              onClick={() => setOpen(false)}
              className="mt-6 flex min-h-11 items-center justify-center gap-[10px] rounded-pill bg-ac-ink px-7 py-[18px] font-medium text-btn uppercase text-ac-paper"
            >
              {cta.label}
              <span aria-hidden="true" className="block">
                →
              </span>
            </Link>

            <p className="mt-5 font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-50">
              {availability}
            </p>
          </nav>
        </div>
      )}
    </>
  )
}

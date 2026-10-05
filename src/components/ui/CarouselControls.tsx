'use client'

/**
 * CLIENT COMPONENT 5/5 din tot site-ul — justificare.
 *
 * Caruselul de articole de pe homepage NU depinde de acest fișier. Pista este
 * randată pe server: o listă cu `overflow-x` și `scroll-snap`, care se derulează
 * din touch, trackpad, roata mouse-ului cu Shift și tastatură (are `tabIndex`),
 * cu zero JavaScript.
 *
 * Ce nu are echivalent declarativ sunt cele două săgeți pentru cine folosește
 * mouse-ul fără trackpad: „derulează pista cu o pagină" cere `scrollBy`, iar
 * starea lor (prima/ultima pagină) cere ascultarea derulării. `::scroll-button()`
 * din CSS ar face asta nativ, dar în octombrie 2026 există doar în Chromium.
 *
 * Fără JavaScript, sau când toate articolele încap pe ecran, săgețile nu se
 * randează deloc. Un buton mort ar fi mai rău decât unul absent.
 */

import { useEffect, useState } from 'react'

import { cn } from '@/lib/cn'

type Props = {
  /** `id`-ul pistei derulabile. */
  target: string
  /** Numele pistei, pentru etichetele butoanelor: „articolele anterioare". */
  noun: string
  className?: string
}

type Edges = { overflow: boolean; atStart: boolean; atEnd: boolean }

/** Toleranța de rotunjire a poziției de derulare, în pixeli. */
const EPSILON = 4

export function CarouselControls({ target, noun, className }: Props) {
  const [edges, setEdges] = useState<Edges>({ overflow: false, atStart: true, atEnd: false })

  useEffect(() => {
    const track = document.getElementById(target)
    if (!track) return

    const measure = () => {
      const max = track.scrollWidth - track.clientWidth
      setEdges({
        overflow: max > EPSILON,
        atStart: track.scrollLeft <= EPSILON,
        atEnd: track.scrollLeft >= max - EPSILON,
      })
    }

    measure()
    track.addEventListener('scroll', measure, { passive: true })
    const observer = new ResizeObserver(measure)
    observer.observe(track)

    return () => {
      track.removeEventListener('scroll', measure)
      observer.disconnect()
    }
  }, [target])

  if (!edges.overflow) return null

  const page = (direction: -1 | 1) => {
    const track = document.getElementById(target)
    if (!track) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // O pagină = lățimea vizibilă. `scroll-snap` aliniază apoi pe primul card.
    track.scrollBy({ left: direction * track.clientWidth, behavior: still ? 'auto' : 'smooth' })
  }

  return (
    <div className={cn('flex gap-3', className)}>
      <ArrowButton
        label={`${noun} anterioare`}
        disabled={edges.atStart}
        onClick={() => page(-1)}
        target={target}
      >
        ←
      </ArrowButton>
      <ArrowButton
        label={`${noun} următoare`}
        disabled={edges.atEnd}
        onClick={() => page(1)}
        target={target}
      >
        →
      </ArrowButton>
    </div>
  )
}

function ArrowButton({
  label,
  disabled,
  onClick,
  target,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  target: string
  children: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-controls={target}
      disabled={disabled}
      onClick={onClick}
      className="flex size-11 cursor-pointer items-center justify-center rounded-pill border border-ac-ink bg-transparent font-sans text-body leading-none text-ac-ink transition-colors duration-[320ms] ease-ac hover:bg-ac-ink hover:text-ac-paper disabled:cursor-default disabled:border-ac-line disabled:text-ac-ink-70 disabled:hover:bg-transparent disabled:hover:text-ac-ink-70"
    >
      <span aria-hidden="true">{children}</span>
    </button>
  )
}

'use client'

/**
 * CLIENT COMPONENT 2/2 pe homepage — justificare: bara de consimțământ scrie
 * un cookie și schimbă starea Consent Mode în urma unei acțiuni a utilizatorului.
 *
 * Reguli care NU se „optimizează" (brief §11.1, cerință legală UE):
 *  - cele trei acțiuni au greutate vizuală egală; „Refuz toate" nu poate fi
 *    mai discret decât „Accept toate" — este cea mai sancționată greșeală;
 *  - bara nu este overlay modal, nu blochează citirea conținutului;
 *  - nimic prebifat, fără cookie wall, fără scroll-as-consent;
 *  - închiderea fără alegere NU înseamnă consimțământ — bara reapare;
 *  - retragerea este la fel de ușoară: link permanent în footer.
 */

import { useCallback, useEffect, useState } from 'react'
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE,
  CONSENT_VERSION,
  parseConsent,
  serializeConsent,
  type ConsentState,
} from '@/lib/consent'

declare global {
  interface Window {
    __acApplyConsent?: (state: ConsentState) => void
    __acConsent?: ConsentState
  }
}

function readCookie(): ConsentState | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`))
  return parseConsent(match?.[1])
}

function writeCookie(state: ConsentState) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie =
    `${CONSENT_COOKIE}=${serializeConsent(state)}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${secure}`
}

export function ConsentBanner({ policyHref }: { policyHref: string }) {
  const [open, setOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  // Prima vizită: bara apare la 900ms, glisând de jos.
  useEffect(() => {
    const saved = readCookie()
    if (saved) {
      setAnalytics(saved.analytics)
      setMarketing(saved.marketing)
      return
    }
    const timer = setTimeout(() => setOpen(true), 900)
    return () => clearTimeout(timer)
  }, [])

  // Link-ul „Setări cookie-uri" din footer, prin delegare — footerul rămâne
  // Server Component și nu avem nevoie de context sau de un al treilea client.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest('[data-consent-open]')) {
        event.preventDefault()
        const saved = readCookie()
        setAnalytics(saved?.analytics ?? false)
        setMarketing(saved?.marketing ?? false)
        setSettingsOpen(true)
        setOpen(true)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const commit = useCallback((next: { analytics: boolean; marketing: boolean }) => {
    const state: ConsentState = {
      v: CONSENT_VERSION,
      analytics: next.analytics,
      marketing: next.marketing,
      ts: Date.now(),
    }
    writeCookie(state)
    window.__acConsent = state
    window.__acApplyConsent?.(state)
    setAnalytics(next.analytics)
    setMarketing(next.marketing)
    setOpen(false)
    setSettingsOpen(false)
  }, [])

  if (!open) return null

  return (
    <div
      /* Marcaj citit din CSS: cât timp bara e deschisă, voalul se retrage.
         Vezi blocul „VOALUL" din `globals.css`. */
      data-consent-bar
      role="region"
      aria-label="Preferințe cookie-uri"
      className="fixed inset-x-0 bottom-0 z-[60] animate-[acRise_.45s_var(--ease-ac)_both] border-t border-ac-line bg-[rgba(250,245,236,.96)] shadow-[0_-10px_40px_rgba(23,20,15,.07)] backdrop-blur-[14px]"
    >
      <div className="ac-shell py-6">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-center gap-6">
          <p className="text-body-sm text-ac-ink-70">
            Folosim cookie-uri pentru a înțelege cum este folosit site-ul. Analiza ne ajută să
            îmbunătățim conținutul. Poți accepta, refuza sau alege ce permiți.{' '}
            <a href={policyHref} className="ac-underline text-ac-ink">
              Politica de cookie-uri
            </a>
          </p>

          {/* Greutate vizuală egală. Nu se schimbă ierarhia acestor trei butoane. */}
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => commit({ analytics: false, marketing: false })}
              className="min-h-11 cursor-pointer rounded-pill border border-ac-ink bg-transparent px-6 py-[14px] font-sans font-medium text-btn uppercase text-ac-ink"
            >
              Refuz toate
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen((value) => !value)}
              aria-expanded={settingsOpen}
              className="min-h-11 cursor-pointer border-0 bg-transparent px-2 py-[14px] font-sans font-medium text-btn uppercase text-ac-ink underline decoration-ac-accent underline-offset-4"
            >
              Setări
            </button>
            <button
              type="button"
              onClick={() => commit({ analytics: true, marketing: true })}
              className="min-h-11 cursor-pointer rounded-pill border border-ac-ink bg-ac-ink px-6 py-[14px] font-sans font-medium text-btn uppercase text-ac-paper"
            >
              Accept toate
            </button>
          </div>
        </div>

        {settingsOpen && (
          <div className="mt-6 grid gap-4 border-t border-ac-line pt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p className="font-medium text-body-sm">Necesare</p>
                <p className="mt-1 text-[13px] text-ac-ink-50">Fără ele site-ul nu funcționează.</p>
              </div>
              <span className="font-medium text-[11px] tracking-[0.18em] uppercase text-ac-accent-ink">
                Mereu active
              </span>
            </div>

            <div className="h-px bg-ac-line" />

            <ToggleRow label="Analiză" value={analytics} onChange={setAnalytics} />

            <div className="h-px bg-ac-line" />

            <ToggleRow label="Marketing" value={marketing} onChange={setMarketing} />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => commit({ analytics, marketing })}
                className="min-h-11 cursor-pointer rounded-pill border border-ac-ink bg-ac-ink px-6 py-[14px] font-sans font-medium text-btn uppercase text-ac-paper"
              >
                Salvează preferințele
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="font-medium text-body-sm">{label}</p>
      <button
        type="button"
        onClick={() => onChange(!value)}
        aria-pressed={value}
        className="min-h-11 cursor-pointer rounded-pill border border-ac-ink bg-transparent px-[22px] py-3 font-sans text-xs tracking-[0.12em] uppercase text-ac-ink"
      >
        {value ? 'Activ' : 'Oprit'}
      </button>
    </div>
  )
}

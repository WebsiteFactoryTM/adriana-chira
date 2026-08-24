'use client'

/**
 * CLIENT COMPONENT 4/4 din tot site-ul — justificare.
 *
 * Promptul §5.1 enumeră componentele de client permise; aceasta nu e pe listă,
 * deci are nevoie de justificare scrisă (regula 2 din STATUS §2).
 *
 * Copierea unei adrese în clipboard nu are echivalent declarativ: cere
 * `navigator.clipboard`, deci un handler, deci un component de client. Restul
 * butoanelor de partajare din blocul de la finalul articolului sunt linkuri
 * `<a>` obișnuite, randate pe server — doar acesta trece granița, și doar
 * pentru ~700 de octeți.
 *
 * Fără JavaScript, butonul nu se randează deloc: `useEffect` îl aduce în pagină
 * abia după hidratare. Un buton mort ar fi mai rău decât unul absent.
 */

import { useEffect, useState } from 'react'

export function CopyLinkButton({ url }: { url: string }) {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2400)
    return () => window.clearTimeout(timer)
  }, [copied])

  if (!mounted) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      // Clipboard refuzat (permisiune, context nesecurizat). Linkul rămâne
      // vizibil în bara de adrese; nu are rost să alarmăm cititorul.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="ac-underline min-h-11 cursor-pointer border-0 bg-transparent p-0 text-left font-sans text-body-sm leading-[normal] text-ac-ink"
    >
      {copied ? 'Adresă copiată' : 'Copiază adresa'}
      <span aria-live="polite" className="ac-sr-only">
        {copied ? 'Adresa articolului a fost copiată.' : ''}
      </span>
    </button>
  )
}

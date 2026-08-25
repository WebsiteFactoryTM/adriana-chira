/**
 * URL-ul canonic al site-ului, rezolvat într-un singur loc.
 *
 * `process.env.NEXT_PUBLIC_SITE_URL ?? implicit` NU e suficient. Pe Vercel
 * variabila poate exista, dar goală, iar `??` prinde doar `undefined`/`null` —
 * nu și șirul gol. Rezultatul a fost `new URL('')`, `ERR_INVALID_URL` și build
 * picat la „Collecting page data". La fel pică și o valoare fără protocol
 * („adrianachira.ro"), o greșeală de configurare la fel de probabilă.
 *
 * Aici, „gol", „doar spații" și „fără protocol" sunt tratate ca nesetat sau
 * reparate, iar slash-ul final e mereu eliminat, ca peste tot în cod să se
 * poată concatena `${base}/ceva` fără dublare.
 *
 * Se folosește DOAR `NEXT_PUBLIC_SITE_URL`, nicio variabilă `VERCEL_*`: acest
 * modul e importat și din componente de client, unde Next inline-ează doar
 * variabilele `NEXT_PUBLIC_`. O rezervă citită din altă variabilă ar da altă
 * valoare pe server față de client și ar strica hidratarea.
 */

/** Normalizează o valoare de mediu; `null` dacă nu e utilizabilă. */
function normalize(value: string | undefined): string | null {
  const trimmed = value?.trim()
  if (!trimmed) return null

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    return new URL(withProtocol).toString().replace(/\/$/, '')
  } catch {
    return null
  }
}

/** URL-ul din mediu dacă e valid, altfel rezerva primită. */
export function siteUrlOr(fallback: string): string {
  return normalize(process.env.NEXT_PUBLIC_SITE_URL) ?? fallback
}

/** URL-ul canonic public. Rezerva e domeniul de producție. */
export const SITE_URL = siteUrlOr('https://adrianachira.ro')

/**
 * Limitare de rată în memorie.
 *
 * 5 cereri la 10 minute pe adresă IP (prompt §5.4).
 *
 * ATENȚIE LA LIMITE: harta trăiește în procesul curent. Pe Vercel, fiecare
 * instanță are propria copie, iar o instanță nouă pornește goală — deci
 * limitarea e „best effort", nu o garanție. Pentru un formular de contact cu
 * honeypot e suficient: oprește repetările evidente fără să adauge o
 * dependență de Redis pentru un site cu câteva mesaje pe săptămână.
 *
 * Dacă volumul crește sau apare spam real, se înlocuiește cu un store partajat
 * — interfața funcției nu trebuie să se schimbe.
 */

type Bucket = {
  count: number
  /** Momentul la care fereastra curentă expiră, în milisecunde. */
  resetAt: number
}

const buckets = new Map<string, Bucket>()

/** Curățenie leneșă: la fiecare apel scoatem ferestrele expirate. */
function sweep(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export type RateLimitResult = {
  ok: boolean
  /** Câte secunde până când cererea ar fi acceptată. */
  retryAfter: number
}

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 10 * 60 * 1000 } = {},
): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const bucket = buckets.get(key)

  if (!bucket) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count += 1
  return { ok: true, retryAfter: 0 }
}

/**
 * Adresa clientului.
 *
 * În spatele proxy-ului Vercel, `x-forwarded-for` conține lanțul de adrese;
 * prima este a clientului. Fără antet — de exemplu la rulare locală — cădem pe
 * o cheie comună, ceea ce e mai strict, nu mai permisiv.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return headers.get('x-real-ip') ?? 'necunoscut'
}

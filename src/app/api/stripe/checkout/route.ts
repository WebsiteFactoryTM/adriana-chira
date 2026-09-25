import { NextResponse } from 'next/server'

import { createCheckoutSession, resolveCheckoutItem } from '@/lib/checkout'
import type { ProductKind } from '@/lib/stripe'
import { WORKSHOPS_PATH } from '@/lib/workshops'

/**
 * Pornirea unei plăți.
 *
 * ## De ce este o rută, și nu o Server Action
 *
 * Ca butonul de cumpărare să funcționeze fără JavaScript. În pagină, butonul e
 * un `<form method="post">` obișnuit către adresa asta (vezi `CheckoutButton`).
 * Browserul trimite formularul, ruta răspunde cu o redirectare 303, browserul o
 * urmează — și cumpărătorul ajunge la Stripe fără să fi rulat o linie de cod de
 * client. Site-ul are exact patru componente de client (STATUS §2, regula 2),
 * iar butonul de plată nu avea de ce să fie a cincea.
 *
 * O Server Action ar fi cerut React pe client ca să funcționeze, deci exact ce
 * evităm.
 *
 * ## Ce se întâmplă când plata online nu e disponibilă
 *
 * Nu un 500. Cumpărătorul ajunge pe pagina de contact, cu produsul
 * precompletat în mesaj — adică pe calea de rezervare fără plată online, care
 * există oricum, ca alternativă, pentru cine preferă transferul bancar sau
 * factura pe firmă. Motivele posibile sunt toate din afara lui: cheia Stripe
 * lipsește, contul e în verificare, ediția s-a închis între momentul în care a
 * încărcat pagina și momentul în care a apăsat butonul.
 */

/** Ruta atinge Stripe și baza de date la fiecare cerere. Nimic de cache-uit. */
export const dynamic = 'force-dynamic'

const KINDS = new Set<ProductKind>(['pachet', 'workshop'])

export async function POST(request: Request): Promise<Response> {
  const { kind, slug } = await readIntent(request)

  const origin = originOf(request)
  const fallbackUrl = (reason: string) =>
    `${origin}/contact?${kind === 'workshop' ? 'workshop' : 'pachet'}=${encodeURIComponent(
      slug,
    )}&motiv=${reason}`

  if (!slug) return NextResponse.redirect(`${origin}/servicii`, 303)

  const resolved = await resolveCheckoutItem(kind, slug)

  if (!resolved.ok) {
    // `necunoscut` nu merită pagina de contact: nu există ce rezerva.
    if (resolved.reason === 'necunoscut') {
      return NextResponse.redirect(
        `${origin}${kind === 'workshop' ? WORKSHOPS_PATH : '/servicii'}`,
        303,
      )
    }
    // Un program la cerere nu e o plată eșuată: e o cerere de ofertă, deci
    // omul ajunge la formular cu mesajul de ofertă, nu cu o notă de eroare.
    if (resolved.reason === 'la-cerere') {
      return NextResponse.redirect(
        `${origin}/contact?pachet=${encodeURIComponent(slug)}&cerere=oferta#formular`,
        303,
      )
    }
    return NextResponse.redirect(fallbackUrl(resolved.reason), 303)
  }

  const url = await createCheckoutSession(resolved.item, origin)
  if (!url) return NextResponse.redirect(fallbackUrl('plata-indisponibila'), 303)

  return NextResponse.redirect(url, 303)
}

/**
 * Ce vrea să cumpere.
 *
 * Acceptă și `application/x-www-form-urlencoded` — forma trimisă de butonul
 * fără JavaScript — și JSON, ca ruta să rămână apelabilă și altfel. Din cerere
 * se citesc DOAR aceste două valori; tot ce ține de bani se citește pe server.
 */
async function readIntent(request: Request): Promise<{ kind: ProductKind; slug: string }> {
  const contentType = request.headers.get('content-type') ?? ''

  let rawKind: unknown
  let rawSlug: unknown

  try {
    if (contentType.includes('application/json')) {
      const body = (await request.json()) as Record<string, unknown>
      rawKind = body.tip
      rawSlug = body.slug
    } else {
      const form = await request.formData()
      rawKind = form.get('tip')
      rawSlug = form.get('slug')
    }
  } catch {
    // Corp lipsă sau ilizibil: rămân valorile implicite de mai jos.
  }

  const kind = typeof rawKind === 'string' && KINDS.has(rawKind as ProductKind)
    ? (rawKind as ProductKind)
    : 'pachet'

  // Slug-urile site-ului sunt ASCII, litere mici, cifre și cratime. Orice
  // altceva nu poate corespunde unui document, deci nu ajunge la interogare.
  const slug =
    typeof rawSlug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rawSlug) ? rawSlug : ''

  return { kind, slug }
}

/**
 * Adresa de bază pentru redirectări.
 *
 * Se ia din cererea curentă, nu din `NEXT_PUBLIC_SITE_URL`: pe un deploy de
 * preview cele două diferă, iar întoarcerea de la Stripe trebuie să ajungă
 * înapoi pe același host, nu în producție.
 */
function originOf(request: Request): string {
  try {
    return new URL(request.url).origin
  } catch {
    return process.env.NEXT_PUBLIC_SITE_URL ?? ''
  }
}

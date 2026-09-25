import type Stripe from 'stripe'

import { packagesFallback } from '@/content/packages'
import { siteSettings } from '@/content/site'
import { WORKSHOP_CURRENCY, WORKSHOP_PRICE } from '@/content/workshops'
import { getWorkshopBySlug } from '@/lib/content'
import { getPayloadClientSafe } from '@/lib/payload'
import { getStripe, STRIPE_CURRENCY, type ProductKind } from '@/lib/stripe'
import { formatSessionDate } from '@/lib/workshops'

/**
 * Crearea sesiunii de plată.
 *
 * ## Regula care nu se încalcă
 *
 * **Prețul nu vine niciodată din cerere.** Clientul trimite doar ce vrea să
 * cumpere — un tip și un slug. Suma se citește aici, pe server, din baza de
 * date sau, în lipsa ei, din textul aprobat. Un formular care ar trimite și
 * prețul ar putea fi rescris din DevTools înainte de trimitere, iar Stripe ar
 * încasa fix cât a scris cumpărătorul.
 *
 * ## De ce `stripePriceId` are întâietate
 *
 * Prețurile din Stripe sunt imutabile și există deja, create de hook-ul de
 * sincronizare la salvarea documentului. Folosind id-ul, plata se leagă de
 * exact același obiect `Price` pe care îl vede Adriana în dashboard, iar
 * raportările din Stripe se grupează singure pe produs.
 *
 * `price_data` inline rămâne pentru cazul în care sincronizarea n-a apucat să
 * ruleze — cheia lipsea la salvare, Stripe era picat, documentul vine din
 * textul aprobat și nu din CMS. Suma e aceeași; se pierde doar gruparea.
 */

export type CheckoutItem = {
  kind: ProductKind
  slug: string
  name: string
  price: number
  currency: string
  stripePriceId: string | null
  /** Doar la workshopuri: data ediției, ca text, pentru evidență. */
  sessionDate: string | null
  /** Descrierea scurtă care apare în pagina de plată Stripe. */
  description: string | null
}

export type CheckoutResolution =
  | { ok: true; item: CheckoutItem }
  | { ok: false; reason: 'necunoscut' | 'inchis' | 'fara-pret' }

/**
 * Găsește ce se cumpără și verifică dacă chiar are voie să fie cumpărat.
 *
 * Verificarea se repetă aici, deși pagina nu arată butonul decât pe edițiile
 * deschise: butonul din pagină e o sugestie, nu o autorizare. Un `POST` scris
 * de mână către ruta de plată trebuie să întâlnească aceeași regulă.
 */
export async function resolveCheckoutItem(
  kind: ProductKind,
  slug: string,
): Promise<CheckoutResolution> {
  if (kind === 'workshop') return resolveWorkshop(slug)
  return resolvePackage(slug)
}

async function resolveWorkshop(slug: string): Promise<CheckoutResolution> {
  const workshop = await getWorkshopBySlug(slug)
  if (!workshop) return { ok: false, reason: 'necunoscut' }

  // Sunt deschise doar următoarele trei ediții programate. Vezi lib/workshops.
  if (!workshop.purchasable) return { ok: false, reason: 'inchis' }
  if (workshop.price <= 0) return { ok: false, reason: 'fara-pret' }

  const stripePriceId = await readStripePriceId('workshops', slug)
  const date = workshop.sessionDate ? formatSessionDate(workshop.sessionDate) : null

  return {
    ok: true,
    item: {
      kind: 'workshop',
      slug,
      name: date ? `${workshop.title} — ediția din ${date}` : workshop.title,
      price: workshop.price || WORKSHOP_PRICE,
      currency: WORKSHOP_CURRENCY,
      stripePriceId,
      sessionDate: workshop.sessionDate,
      description: workshop.subtitle,
    },
  }
}

async function resolvePackage(slug: string): Promise<CheckoutResolution> {
  const payload = await getPayloadClientSafe()

  if (payload) {
    try {
      const result = await payload.find({
        collection: 'packages',
        where: { slug: { equals: slug }, active: { equals: true } },
        limit: 1,
        depth: 0,
      })
      const doc = result.docs[0]
      if (doc) {
        if (typeof doc.price !== 'number' || doc.price <= 0) {
          return { ok: false, reason: 'fara-pret' }
        }
        return {
          ok: true,
          item: {
            kind: 'pachet',
            slug,
            name: doc.name,
            price: doc.price,
            currency: 'RON',
            stripePriceId: doc.stripePriceId ?? null,
            sessionDate: null,
            description: doc.tagline ?? null,
          },
        }
      }
    } catch {
      // Cădem pe textul aprobat, ca peste tot în stratul de conținut.
    }
  }

  const approved = packagesFallback.find((item) => item.slug === slug)
  if (!approved) return { ok: false, reason: 'necunoscut' }
  if (approved.price === null || approved.price <= 0) return { ok: false, reason: 'fara-pret' }

  return {
    ok: true,
    item: {
      kind: 'pachet',
      slug,
      name: approved.name ?? 'Pachet de consultanță',
      price: approved.price,
      currency: approved.currency,
      stripePriceId: null,
      sessionDate: null,
      description: approved.tagline,
    },
  }
}

/** Id-ul prețului din Stripe, dacă documentul a apucat să fie sincronizat. */
async function readStripePriceId(
  collection: 'packages' | 'workshops',
  slug: string,
): Promise<string | null> {
  const payload = await getPayloadClientSafe()
  if (!payload) return null

  try {
    const result = await payload.find({
      collection,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    const id = result.docs[0]?.stripePriceId
    return typeof id === 'string' && id.length > 0 ? id : null
  } catch {
    return null
  }
}

/**
 * Deschide o sesiune Stripe Checkout și întoarce adresa ei.
 *
 * `null` înseamnă că plata online nu e disponibilă acum — lipsește cheia sau
 * Stripe a refuzat. Apelantul trimite atunci cumpărătorul pe calea de
 * rezervare fără plată, în loc să îi arate o eroare.
 */
export async function createCheckoutSession(
  item: CheckoutItem,
  origin: string,
): Promise<string | null> {
  const stripe = getStripe()
  if (!stripe) return null

  const base = origin || siteSettings.url
  const cancelParam = item.kind === 'workshop' ? 'workshop' : 'pachet'

  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = item.stripePriceId
    ? { price: item.stripePriceId, quantity: 1 }
    : {
        quantity: 1,
        price_data: {
          currency: STRIPE_CURRENCY,
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.name,
            ...(item.description ? { description: item.description } : {}),
          },
        },
      }

  // Locurile la workshop se pot cumpăra mai multe deodată, direct în pagina de
  // plată. Un program individual este, prin definiție, pentru o singură
  // persoană — acolo cantitatea rămâne fixă.
  if (item.kind === 'workshop') {
    lineItem.adjustable_quantity = { enabled: true, minimum: 1, maximum: 10 }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [lineItem],
      locale: 'ro',
      success_url: `${base}/multumim?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/comanda-anulata?${cancelParam}=${encodeURIComponent(item.slug)}`,
      // Adresa e obligatorie pentru facturare în România, iar telefonul îi
      // permite Adrianei să confirme prezența la workshop fără să mai caute.
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      invoice_creation: { enabled: true },
      metadata: {
        kind: item.kind,
        slug: item.slug,
        ...(item.sessionDate ? { sessionDate: item.sessionDate } : {}),
      },
    })

    return session.url ?? null
  } catch {
    // Orice refuz al Stripe trimite cumpărătorul pe calea fără plată online.
    // Un 500 aici ar însemna o vânzare pierdută pentru o problemă de cont.
    return null
  }
}

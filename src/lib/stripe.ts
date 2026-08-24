import Stripe from 'stripe'

/**
 * Clientul Stripe și sincronizarea prețurilor.
 *
 * Adriana administrează prețurile într-un singur loc — Payload. Stripe este
 * doar oglinda. Regulile care fac sincronizarea corectă:
 *
 * 1. **Prețurile Stripe sunt imutabile.** Nu se editează; se creează un Price
 *    nou și se arhivează cel vechi. Comenzile deja făcute păstrează prețul lor.
 * 2. **Idempotent.** Rulat de două ori cu aceleași date, nu creează nimic nou.
 *    Comparăm suma și moneda cu Price-ul activ înainte de a atinge Stripe.
 * 3. **Nu blochează salvarea.** Dacă Stripe e indisponibil sau cheia lipsește,
 *    documentul se salvează oricum și rămâne marcat ca nesincronizat. Un CMS
 *    care refuză să salveze pentru că un serviciu extern e picat este un CMS
 *    stricat.
 *
 * Cheia lipsește în dezvoltare (blocaj §7 din STATUS.md), deci calea normală
 * astăzi este exact ramura „fără cheie".
 */

let client: Stripe | null = null

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  if (!client) {
    client = new Stripe(key, {
      appInfo: { name: 'adrianachira.ro', version: '0.1.0' },
      maxNetworkRetries: 2,
      timeout: 10_000,
    })
  }
  return client
}

export type PackageForSync = {
  id: string | number
  name: string
  slug: string
  price?: number | null
  stripeProductId?: string | null
  stripePriceId?: string | null
}

export type SyncResult = {
  status: 'synced' | 'skipped' | 'error'
  stripeProductId?: string | null
  stripePriceId?: string | null
  message: string
}

/** Stripe lucrează în subunități: 450 EUR devin 45000 de cenți. */
const toMinorUnits = (amount: number): number => Math.round(amount * 100)

export async function syncPackageWithStripe(pkg: PackageForSync): Promise<SyncResult> {
  const stripe = getStripe()

  if (!stripe) {
    return {
      status: 'skipped',
      message: 'STRIPE_SECRET_KEY lipsește — pachetul nu a fost sincronizat cu Stripe.',
    }
  }

  if (typeof pkg.price !== 'number' || pkg.price <= 0) {
    return {
      status: 'skipped',
      message: 'Pachetul nu are preț — nu are ce fi sincronizat.',
    }
  }

  try {
    // 1. Produsul. Îl regăsim după id-ul salvat; dacă a fost șters din Stripe,
    //    creăm altul în loc să eșuăm.
    let productId = pkg.stripeProductId ?? null

    if (productId) {
      try {
        const existing = await stripe.products.retrieve(productId)
        if (existing.deleted) productId = null
      } catch {
        productId = null
      }
    }

    if (productId) {
      await stripe.products.update(productId, {
        name: pkg.name,
        metadata: { payloadId: String(pkg.id), slug: pkg.slug },
      })
    } else {
      const created = await stripe.products.create({
        name: pkg.name,
        metadata: { payloadId: String(pkg.id), slug: pkg.slug },
      })
      productId = created.id
    }

    // 2. Prețul. Dacă cel activ are deja aceeași sumă și monedă, ne oprim aici —
    //    asta e ce face rularea repetată să nu producă un munte de Price-uri.
    const targetAmount = toMinorUnits(pkg.price)

    if (pkg.stripePriceId) {
      try {
        const current = await stripe.prices.retrieve(pkg.stripePriceId)
        if (current.active && current.unit_amount === targetAmount && current.currency === 'eur') {
          return {
            status: 'synced',
            stripeProductId: productId,
            stripePriceId: current.id,
            message: 'Prețul din Stripe era deja corect.',
          }
        }
      } catch {
        // Price-ul a dispărut din Stripe; mergem mai departe și creăm altul.
      }
    }

    const price = await stripe.prices.create({
      product: productId,
      currency: 'eur',
      unit_amount: targetAmount,
      metadata: { payloadId: String(pkg.id) },
    })

    // 3. Arhivarea celui vechi. Se face DUPĂ ce noul preț există, ca să nu rămână
    //    pachetul fără niciun preț activ dacă pasul de mai sus eșuează.
    if (pkg.stripePriceId && pkg.stripePriceId !== price.id) {
      try {
        await stripe.prices.update(pkg.stripePriceId, { active: false })
      } catch {
        // Nu e fatal: un preț vechi rămas activ nu afectează checkout-ul,
        // care folosește mereu `stripePriceId` din document.
      }
    }

    return {
      status: 'synced',
      stripeProductId: productId,
      stripePriceId: price.id,
      message: `Preț sincronizat: ${pkg.price} EUR.`,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      status: 'error',
      message: `Stripe a răspuns cu eroare: ${message}`,
    }
  }
}

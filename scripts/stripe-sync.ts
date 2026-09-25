/**
 * Sincronizarea în masă a prețurilor cu Stripe — `pnpm stripe:sync`.
 *
 * Hook-ul `afterChange` sincronizează un document doar când e salvat. Scriptul
 * acesta acoperă cazurile în care nimeni nu salvează nimic:
 *
 * - **prima configurare** a cheii: documentele create de seed n-au văzut Stripe;
 * - **trecerea de pe cheile de test pe cele live** (sau schimbarea contului):
 *   id-urile salvate aparțin celuilalt mediu, deci `retrieve` cade și
 *   `syncProductWithStripe` creează produsul și prețul din nou, în contul curent.
 *
 * Idempotent: rulat de două ori, a doua oară nu creează nimic. Scrie înapoi cu
 * `skipStripeSync`, ca hook-ul să nu sincronizeze încă o dată același document.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { syncProductWithStripe, type ProductKind } from '@/lib/stripe'

const payload = await getPayload({ config })

const targets = [
  { collection: 'packages', kind: 'pachet' },
  { collection: 'workshops', kind: 'workshop' },
] as const satisfies readonly { collection: 'packages' | 'workshops'; kind: ProductKind }[]

let failures = 0

for (const { collection, kind } of targets) {
  const { docs } = await payload.find({
    collection,
    limit: 500,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })

  for (const doc of docs) {
    const name = 'name' in doc ? doc.name : doc.title
    const result = await syncProductWithStripe({
      id: doc.id,
      name,
      slug: doc.slug,
      price: doc.price ?? null,
      stripeProductId: doc.stripeProductId ?? null,
      stripePriceId: doc.stripePriceId ?? null,
      kind,
    })

    await payload.update({
      collection,
      id: doc.id,
      data: {
        stripeProductId: result.stripeProductId ?? doc.stripeProductId ?? null,
        stripePriceId: result.stripePriceId ?? doc.stripePriceId ?? null,
        stripeSyncStatus: result.status,
        stripeSyncMessage: result.message,
      },
      context: { skipStripeSync: true },
      overrideAccess: true,
      depth: 0,
    })

    if (result.status === 'error') failures += 1
    console.log(`${result.status.padEnd(7)} ${collection}/${doc.slug} — ${result.message}`)
  }
}

console.log(failures === 0 ? '\nGata.' : `\n${failures} documente au eșuat.`)
process.exit(failures === 0 ? 0 : 1)

import type { CollectionAfterChangeHook } from 'payload'

import { type PackageForSync, type ProductKind, syncProductWithStripe } from '@/lib/stripe'

/**
 * Hook-ul care ține prețul din Payload și cel din Stripe pe aceeași valoare.
 *
 * Trăia scris de mână în `Packages.ts`. L-am scos aici când au apărut
 * workshopurile, care sunt al doilea lucru vandabil din site și au exact
 * aceeași nevoie. Două copii ale acestui hook ar diverge la prima corectură,
 * iar divergența s-ar vedea abia într-o plată cu suma greșită.
 *
 * Regulile care îl fac corect sunt neschimbate:
 *
 * - **Rulează după salvare, nu înainte.** Dacă Stripe e picat, documentul e
 *   deja în siguranță în baza de date.
 * - **`req` se pasează mai departe.** Scrierea rezultatului intră astfel în
 *   ACEEAȘI tranzacție ca salvarea care a declanșat-o. Fără el, la creare
 *   documentul încă nu e comis și update-ul cade cu 404.
 * - **`context.skipStripeSync` oprește bucla.** Altfel scrierea înapoi ar
 *   declanșa din nou hook-ul, la infinit.
 * - **Nu se scrie dacă nimic nu s-ar schimba.** O salvare fără efect ar
 *   însemna o versiune în plus în istoricul documentului, la fiecare click.
 */
export const syncWithStripe =
  (args: { collection: 'packages' | 'workshops'; kind: ProductKind }): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req, context }) => {
    if (context?.skipStripeSync) return doc

    const priceChanged = previousDoc?.price !== doc.price
    const nameChanged = previousDoc?.name !== doc.name || previousDoc?.title !== doc.title
    const neverSynced = !doc.stripePriceId

    if (!priceChanged && !nameChanged && !neverSynced) return doc

    // Pachetele au `name`, workshopurile au `title`. Restul câmpurilor de
    // sincronizare poartă aceleași nume în ambele colecții.
    const name =
      typeof doc.name === 'string' && doc.name.length > 0
        ? doc.name
        : typeof doc.title === 'string'
          ? doc.title
          : ''

    const result = await syncProductWithStripe({
      id: doc.id,
      name,
      slug: String(doc.slug ?? ''),
      price: typeof doc.price === 'number' ? doc.price : null,
      stripeProductId: doc.stripeProductId ?? null,
      stripePriceId: doc.stripePriceId ?? null,
      kind: args.kind,
    } satisfies PackageForSync)

    const next = {
      stripeProductId: result.stripeProductId ?? doc.stripeProductId ?? null,
      stripePriceId: result.stripePriceId ?? doc.stripePriceId ?? null,
      stripeSyncStatus: result.status,
      stripeSyncMessage: result.message,
    }

    const unchanged = Object.entries(next).every(([key, value]) => (doc[key] ?? null) === value)

    if (!unchanged) {
      await req.payload.update({
        collection: args.collection,
        id: doc.id,
        data: next,
        req,
        context: { skipStripeSync: true },
        overrideAccess: true,
        depth: 0,
      })
    }

    if (result.status === 'error') {
      req.payload.logger.error(
        { collection: args.collection, id: doc.id, message: result.message },
        'Sincronizarea cu Stripe a eșuat',
      )
    }

    return doc
  }

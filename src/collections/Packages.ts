import type { CollectionConfig } from 'payload'

import { activeOrAuthenticated, isAdmin, isAdminOrEditor } from '@/access'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidatePackage, revalidatePackageAfterDelete } from '@/hooks/revalidate'
import { syncPackageWithStripe, type PackageForSync } from '@/lib/stripe'

/**
 * Pachetele de consultanță.
 *
 * Conținutul nu este încă decis de clientă (blocaj §7.1 din STATUS.md), deci
 * structura este completă, iar seed-ul pune trei intrări cu text
 * `[ DE COMPLETAT ]`. Cardurile din homepage randează deja aceste placeholdere.
 *
 * `active` ascunde un pachet fără să îl șteargă: ștergerea ar rupe relația din
 * comenzile deja plătite.
 */
export const Packages: CollectionConfig = {
  slug: 'packages',
  labels: {
    singular: 'Pachet',
    plural: 'Pachete',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'order', 'featured', 'active'],
    group: 'Conținut',
    description: 'Pachetele de consultanță, cu prețurile pe care le vede clientul.',
    preview: (doc) =>
      typeof doc?.slug === 'string'
        ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/servicii/${doc.slug}`
        : null,
  },
  defaultSort: 'order',
  access: {
    read: activeOrAuthenticated,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    /**
     * Sincronizarea cu Stripe.
     *
     * Rulează după salvare, nu înainte: dacă Stripe e picat, documentul e deja
     * în siguranță în baza de date. Scrierea rezultatului înapoi se face cu
     * `context.skipStripeSync`, altfel update-ul ar declanșa din nou hook-ul —
     * la infinit.
     */
    afterChange: [
      async ({ doc, previousDoc, req, context }) => {
        if (context?.skipStripeSync) return doc

        const priceChanged = previousDoc?.price !== doc.price
        const nameChanged = previousDoc?.name !== doc.name
        const neverSynced = !doc.stripePriceId

        if (!priceChanged && !nameChanged && !neverSynced) return doc

        const result = await syncPackageWithStripe(doc as PackageForSync)

        const next = {
          stripeProductId: result.stripeProductId ?? doc.stripeProductId ?? null,
          stripePriceId: result.stripePriceId ?? doc.stripePriceId ?? null,
          stripeSyncStatus: result.status,
          stripeSyncMessage: result.message,
        }

        const unchanged = Object.entries(next).every(
          ([key, value]) => (doc[key] ?? null) === value,
        )

        if (!unchanged) {
          await req.payload.update({
            collection: 'packages',
            id: doc.id,
            data: next,
            // `req` ține update-ul în ACEEAȘI tranzacție ca salvarea care l-a
            // declanșat. Fără el, la creare documentul încă nu e comis și
            // update-ul cade cu 404.
            req,
            context: { skipStripeSync: true },
            overrideAccess: true,
            depth: 0,
          })
        }

        if (result.status === 'error') {
          req.payload.logger.error(
            { packageId: doc.id, message: result.message },
            'Sincronizarea cu Stripe a eșuat',
          )
        }

        return doc
      },
      revalidatePackage,
    ],
    afterDelete: [revalidatePackageAfterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nume pachet',
      required: true,
    },
    slugField({ from: 'name' }),
    {
      name: 'tagline',
      type: 'text',
      label: 'Ce rezolvă, într-o frază',
      admin: {
        description: 'Apare sub numele pachetului, pe card.',
      },
    },
    {
      name: 'forWho',
      type: 'textarea',
      label: 'Pentru cine este',
      maxLength: 300,
    },
    {
      name: 'includes',
      type: 'array',
      label: 'Ce include',
      labels: { singular: 'Element', plural: 'Elemente' },
      admin: {
        description: 'Punctele din listă, în ordinea în care vrei să fie citite.',
      },
      fields: [{ name: 'item', type: 'text', label: 'Text', required: true }],
    },
    {
      name: 'duration',
      type: 'text',
      label: 'Durată',
      admin: { description: 'De exemplu: „4 sesiuni · 6 săptămâni".' },
    },
    {
      name: 'format',
      type: 'select',
      label: 'Format',
      defaultValue: 'hibrid',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'Față în față', value: 'fata-in-fata' },
        { label: 'Hibrid', value: 'hibrid' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      label: 'Preț (EUR)',
      min: 0,
      admin: {
        position: 'sidebar',
        description:
          'Se citește doar pe server. La salvare, prețul se trimite automat în Stripe.',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordine',
      required: true,
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Numere mai mici apar primele.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Card evidențiat',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Un singur pachet, în designul aprobat cel din mijloc.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Vizibil pe site',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Debifează pentru a ascunde pachetul fără a-l șterge.',
      },
    },
    {
      name: 'longDescription',
      type: 'richText',
      label: 'Descriere completă',
      admin: { description: 'Apare pe pagina dedicată pachetului.' },
    },
    {
      name: 'faq',
      type: 'array',
      label: 'Întrebări despre acest pachet',
      labels: { singular: 'Întrebare', plural: 'Întrebări' },
      fields: [
        { name: 'question', type: 'text', label: 'Întrebare', required: true },
        { name: 'answer', type: 'textarea', label: 'Răspuns', required: true },
      ],
    },
    seoField(),
    {
      type: 'collapsible',
      label: 'Stripe',
      admin: {
        initCollapsed: true,
        description: 'Completat automat la salvare. Nu se editează manual.',
      },
      fields: [
        {
          name: 'stripeProductId',
          type: 'text',
          label: 'ID produs Stripe',
          admin: { readOnly: true },
        },
        {
          name: 'stripePriceId',
          type: 'text',
          label: 'ID preț Stripe',
          admin: { readOnly: true },
        },
        {
          name: 'stripeSyncStatus',
          type: 'select',
          label: 'Stare sincronizare',
          defaultValue: 'skipped',
          options: [
            { label: 'Sincronizat', value: 'synced' },
            { label: 'Nesincronizat', value: 'skipped' },
            { label: 'Eroare', value: 'error' },
          ],
          admin: { readOnly: true },
        },
        {
          name: 'stripeSyncMessage',
          type: 'text',
          label: 'Detalii',
          admin: { readOnly: true },
        },
      ],
    },
  ],
}

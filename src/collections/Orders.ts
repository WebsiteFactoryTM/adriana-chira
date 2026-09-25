import type { CollectionConfig } from 'payload'

import { isAdmin, noone } from '@/access'

/**
 * Comenzile. Doar citire, chiar și pentru administrator.
 *
 * Singura sursă de adevăr este Stripe; documentele de aici sunt scrise exclusiv
 * de webhook (`/api/stripe/webhook`, faza 4), cu `overrideAccess`. Dacă cineva
 * ar putea edita o comandă din admin, evidența ar diverge de la plăți.
 *
 * `packageNameSnapshot`, `amount` și `currency` sunt COPII, nu relații live
 * (prompt §4.1): dacă Adriana redenumește un pachet sau îi schimbă prețul,
 * comenzile vechi trebuie să arate în continuare ce s-a cumpărat și cu cât.
 *
 * `stripeSessionId` este unic — este cheia de idempotență a webhook-ului.
 * Stripe reîncearcă livrarea evenimentelor, iar fără unicitate la nivel de bază
 * de date o reîncercare ar produce o a doua comandă.
 */
export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Comandă',
    plural: 'Comenzi',
  },
  admin: {
    useAsTitle: 'packageNameSnapshot',
    defaultColumns: [
      'packageNameSnapshot',
      'itemType',
      'customerName',
      'amount',
      'status',
      'createdAt',
    ],
    group: 'Administrare',
    description:
      'Comenzile plătite prin Stripe — pachete de consultanță și locuri la workshopuri. Se creează automat; nu se pot edita de aici.',
  },
  access: {
    read: isAdmin,
    create: noone,
    update: noone,
    delete: noone,
  },
  fields: [
    {
      name: 'stripeSessionId',
      type: 'text',
      label: 'ID sesiune Stripe',
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      label: 'ID plată Stripe',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'itemType',
      type: 'select',
      label: 'Ce s-a cumpărat',
      required: true,
      defaultValue: 'pachet',
      options: [
        { label: 'Pachet de consultanță', value: 'pachet' },
        { label: 'Loc la workshop', value: 'workshop' },
      ],
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'package',
      type: 'relationship',
      relationTo: 'packages',
      label: 'Pachet',
      admin: {
        readOnly: true,
        description: 'Relația se poate rupe dacă pachetul e șters. Numele de mai jos rămâne.',
        condition: (data) => data?.itemType !== 'workshop',
      },
    },
    {
      name: 'workshop',
      type: 'relationship',
      relationTo: 'workshops',
      label: 'Workshop',
      admin: {
        readOnly: true,
        description: 'Relația se poate rupe dacă workshopul e șters. Numele de mai jos rămâne.',
        condition: (data) => data?.itemType === 'workshop',
      },
    },
    {
      name: 'packageNameSnapshot',
      type: 'text',
      label: 'Numele produsului la momentul comenzii',
      required: true,
      admin: { readOnly: true },
    },
    {
      /**
       * Data ediției, copiată la fel ca numele.
       *
       * Un workshop își schimbă `sessionDate` la fiecare ediție nouă. Fără
       * copia asta, o comandă din octombrie ar arăta, în ianuarie, că omul a
       * plătit pentru ediția din februarie — adică lista de participanți ar
       * deveni greșită exact când e nevoie de ea.
       */
      name: 'sessionDateSnapshot',
      type: 'text',
      label: 'Data ediției plătite',
      admin: {
        readOnly: true,
        condition: (data) => data?.itemType === 'workshop',
      },
    },
    {
      name: 'quantity',
      type: 'number',
      label: 'Număr de locuri',
      required: true,
      defaultValue: 1,
      admin: {
        readOnly: true,
        description: 'La workshopuri, câte locuri au fost plătite într-o singură comandă.',
      },
    },
    {
      name: 'amount',
      type: 'number',
      label: 'Sumă',
      required: true,
      admin: {
        readOnly: true,
        description: 'Totalul încasat, în unități întregi ale monedei.',
      },
    },
    {
      name: 'currency',
      type: 'text',
      label: 'Monedă',
      required: true,
      defaultValue: 'RON',
      admin: { readOnly: true },
    },
    { name: 'customerName', type: 'text', label: 'Nume client', admin: { readOnly: true } },
    {
      name: 'customerEmail',
      type: 'email',
      label: 'Email client',
      required: true,
      admin: { readOnly: true },
    },
    { name: 'customerPhone', type: 'text', label: 'Telefon client', admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      label: 'Stare',
      required: true,
      defaultValue: 'paid',
      options: [
        { label: 'Plătită', value: 'paid' },
        { label: 'Rambursată', value: 'refunded' },
        { label: 'Eșuată', value: 'failed' },
      ],
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'rawEvent',
      type: 'json',
      label: 'Evenimentul Stripe brut',
      admin: {
        hidden: true,
        description: 'Păstrat pentru depanare și reconciliere.',
      },
    },
  ],
}

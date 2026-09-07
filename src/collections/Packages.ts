import type { CollectionConfig } from 'payload'

import { activeOrAuthenticated, isAdmin, isAdminOrEditor } from '@/access'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidatePackage, revalidatePackageAfterDelete } from '@/hooks/revalidate'
import { syncWithStripe } from '@/hooks/stripeSync'

/**
 * Pachetele de consultanță — cele trei programe individuale.
 *
 * Conținutul REAL este în CMS din septembrie 2026: Strategic Performance
 * Assessment (1.500 lei), CLAR Performance Transformation (5.100 lei) și
 * Executive Performance Program (15.000 lei). Textul lor vine din
 * `src/content/packages.ts`, prin `pnpm seed`.
 *
 * Workshopurile NU sunt aici. Sunt un al doilea lucru vandabil, cu altă
 * structură — au dată, se cumpără pe loc de participant și doar următoarele
 * trei ediții sunt deschise — deci au colecția lor, `workshops`. Ce au în
 * comun, sincronizarea prețului cu Stripe, e scris o singură dată, în
 * `src/hooks/stripeSync.ts`.
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
    // Sincronizarea cu Stripe. Regulile care o fac corectă sunt scrise o
    // singură dată, în `src/hooks/stripeSync.ts` — le folosesc și workshopurile.
    afterChange: [
      syncWithStripe({ collection: 'packages', kind: 'pachet' }),
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
      label: 'Preț (lei)',
      min: 0,
      admin: {
        position: 'sidebar',
        description:
          'În lei, fără separator de mii: scrie 5100, nu 5.100. Se citește doar pe server. La salvare, prețul se trimite automat în Stripe.',
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

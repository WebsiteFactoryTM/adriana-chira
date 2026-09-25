import type { CollectionConfig } from 'payload'

import { activeOrAuthenticated, isAdmin, isAdminOrEditor } from '@/access'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidateWorkshop, revalidateWorkshopAfterDelete } from '@/hooks/revalidate'
import { syncWithStripe } from '@/hooks/stripeSync'

/**
 * Workshopurile de performanță umană.
 *
 * Paisprezece workshopuri de o zi, cu același format și același preț, dintre
 * care doar câteva au la un moment dat o ediție programată.
 *
 * ## Ce NU se administrează de aici
 *
 * **Care workshopuri se pot cumpăra.** Nu există bifă de „deschis la
 * înscriere", și e o decizie: o bifă ar trebui întoarsă manual în fiecare
 * lună, iar ziua în care cineva uită să o întoarcă e ziua în care site-ul
 * vinde locuri la o ediție care a trecut deja. Regula este calculată din
 * `sessionDate`, în `src/lib/workshops.ts`: sunt deschise întotdeauna doar
 * următoarele TREI ediții cu dată în viitor. Ca să deschizi un workshop, îi
 * pui o dată. Atât.
 *
 * **Durata, programul zilei, ce include prețul, „Cum se desfășoară" și „Pentru
 * cine".** Sunt identice la toate cele 14 și stau o singură dată, în
 * `WORKSHOP_COMMON` din `src/content/workshops.ts`. Dacă ar fi câmpuri aici,
 * ar trebui completate de paisprezece ori și corectate tot de paisprezece ori.
 *
 * `active` ascunde un workshop fără să îl șteargă: ștergerea ar rupe relația
 * din comenzile deja plătite.
 */
export const Workshops: CollectionConfig = {
  slug: 'workshops',
  labels: {
    singular: 'Workshop',
    plural: 'Workshopuri',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sessionDate', 'price', 'order', 'active'],
    group: 'Conținut',
    description:
      'Catalogul de workshopuri. Se pot cumpăra întotdeauna doar următoarele trei ediții cu dată în viitor — ca să deschizi un workshop la înscriere, dă-i o dată.',
  },
  defaultSort: 'order',
  access: {
    read: activeOrAuthenticated,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      syncWithStripe({ collection: 'workshops', kind: 'workshop' }),
      revalidateWorkshop,
    ],
    afterDelete: [revalidateWorkshopAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titlu',
      required: true,
      admin: { description: 'Titlul creativ, cel care se vede primul. De exemplu: „Sub presiune".' },
    },
    slugField({ from: 'title' }),
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitlu',
      required: true,
      admin: {
        description:
          'Competența, scrisă cum o caută oamenii în Google. Apare imediat sub titlu. De exemplu: „Inteligență emoțională și autoreglare în business".',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Descrierea scurtă',
      required: true,
      maxLength: 400,
      admin: {
        description:
          'Una-două fraze, singurul text vizibil înainte ca cineva să apese „Citește tot programul". Scrie-o ca să se înțeleagă singură, fără restul paginii.',
      },
    },
    {
      name: 'sessionDate',
      type: 'date',
      label: 'Data ediției',
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' },
        description:
          'Gol = workshopul apare în catalog, fără buton de plată. Cu dată în viitor, intră la rând: primele trei astfel de ediții sunt deschise la înscriere. Ora este întotdeauna 09:00–17:00.',
      },
    },
    {
      name: 'price',
      type: 'number',
      label: 'Preț (lei)',
      required: true,
      defaultValue: 510,
      min: 0,
      admin: {
        position: 'sidebar',
        description:
          'Per participant, în lei. Se citește doar pe server. La salvare, prețul se trimite automat în Stripe.',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordine în catalog',
      required: true,
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description:
          'Ordinea firului logic al seriei, folosită pentru workshopurile FĂRĂ dată. Cele cu dată se așază singure, cronologic, deasupra lor.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Vizibil pe site',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Debifează pentru a scoate workshopul din catalog fără a-l șterge.',
      },
    },
    {
      type: 'collapsible',
      label: 'Programul workshopului',
      admin: {
        description:
          'Textul care se deschide când cineva apasă „Citește tot programul". Durata, orarul zilei și ce include prețul NU se scriu aici: sunt aceleași pentru toate workshopurile și apar o singură dată, în capul paginii.',
      },
      fields: [
        {
          name: 'what',
          type: 'textarea',
          label: 'Ce este acest workshop',
          required: true,
          admin: {
            description:
              'Începe cu titlul workshopului și spune într-o frază ce este. Fraza asta e cea mai citată de motoarele de căutare și de asistenții AI.',
          },
        },
        {
          name: 'problems',
          type: 'textarea',
          label: 'Ce probleme te ajută să abordezi',
          required: true,
          admin: {
            description: 'Situația concretă, în cuvintele omului care o trăiește.',
          },
        },
        {
          name: 'workMethod',
          type: 'textarea',
          label: 'Ce lucrăm efectiv în ziua respectivă',
          required: true,
          admin: {
            description:
              'Singura parte din „Cum se desfășoară" care diferă de la un workshop la altul. Restul e comun și apare o dată, sus.',
          },
        },
        {
          name: 'outcomes',
          type: 'array',
          label: 'Cu ce rămâi la final',
          labels: { singular: 'Rezultat', plural: 'Rezultate' },
          minRows: 1,
          admin: { description: 'Punctele din listă, în ordinea în care vrei să fie citite.' },
          fields: [{ name: 'item', type: 'text', label: 'Text', required: true }],
        },
      ],
    },
    {
      name: 'keywords',
      type: 'array',
      label: 'Expresii-cheie',
      labels: { singular: 'Expresie', plural: 'Expresii' },
      admin: {
        description:
          'NU se afișează în pagină. Sunt notițe pentru redactare: expresiile pe care textul de mai sus ar trebui să le acopere natural. O listă lipită în pagină ar fi keyword stuffing și se penalizează.',
      },
      fields: [{ name: 'item', type: 'text', label: 'Expresie', required: true }],
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

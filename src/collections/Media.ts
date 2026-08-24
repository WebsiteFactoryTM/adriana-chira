import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAdminOrEditor } from '@/access'

/**
 * Fișierele încărcate din admin.
 *
 * `alt` este OBLIGATORIU, nu recomandat (prompt §4.1). O imagine fără text
 * alternativ este o pagină inaccesibilă, iar validarea la nivel de CMS este
 * singurul loc unde regula chiar se aplică.
 *
 * Dimensiunile generate acoperă exact sloturile din designul aprobat:
 *   thumbnail  400  — listări dense, admin
 *   card       800  — cardurile de articol
 *   hero      1600  — portretul din hero și copertele mari
 *   og   1200×630   — imaginea de partajare, decupată fix
 *
 * Stocarea: Vercel Blob în producție, disc local când lipsește tokenul —
 * comutarea se face în `src/payload.config.ts`, nu aici.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Fișier',
    plural: 'Fișiere',
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'Conținut',
    description: 'Imaginile și fișierele folosite pe site.',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*', 'application/pdf'],
    // AVIF nu se generează aici: `next/image` îl produce la cerere din original
    // (next.config.ts, `formats`). Ce stocăm sunt variantele de dimensiune.
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1600,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Text alternativ',
      required: true,
      admin: {
        description:
          'Ce se vede în imagine, într-o frază. Îl citesc cititoarele de ecran și motoarele de căutare. Obligatoriu.',
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length === 0) {
          return 'Textul alternativ este obligatoriu. Descrie imaginea într-o frază.'
        }
        if (value.trim().length < 3) {
          return 'Textul alternativ este prea scurt ca să ajute pe cineva.'
        }
        return true
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Legendă',
      admin: {
        description: 'Opțional. Apare sub imagine, acolo unde designul prevede legendă.',
      },
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Credit foto',
      admin: {
        description: 'Opțional. Numele fotografului sau sursa licenței.',
      },
    },
  ],
}

import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAdminOrEditor } from '@/access'

/**
 * Imaginile încărcate din admin.
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
 *
 * ## Doar imagini, și doar formatele pe care le poate afișa site-ul
 *
 * Fiecare câmp care trimite aici e un loc de imagine (copertă, portret,
 * imagine de partajare), iar `RichText` randează orice încărcare drept
 * `<Image>`. Un PDF ales drept copertă ar fi fost o imagine spartă; HEIC (pozele
 * de pe iPhone) și SVG nu le poate procesa `sharp`, respectiv afișa
 * `next/image`. Documentele de descărcat stau în „Resurse descărcabile".
 */
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Imagine',
    plural: 'Imagini',
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'Conținut',
    description:
      'Imaginile folosite pe site: JPG, PNG, WebP, AVIF sau GIF. Documentele (PDF, Word…) se încarcă la „Resurse descărcabile".',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  upload: {
    staticDir: 'public/media',
    mimeTypes: IMAGE_MIME_TYPES,
    // Fără `formatOptions`, deliberat. Cu Blob, originalul urcă direct din
    // browser (`clientUploads`), iar pluginul de stocare NU îl mai urcă a doua
    // oară. O conversie aici (ex. JPG → WebP) schimba numele în bază, dar nu și
    // fișierul din Blob: adresa originalului ducea la 404. Formatul de livrare
    // (AVIF / WebP) îl produce oricum `next/image`, la cerere (next.config.ts).
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

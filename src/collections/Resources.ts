import { APIError, type CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateResource } from '@/hooks/revalidate'
import {
  RESOURCE_FORMATS,
  RESOURCE_MAX_BYTES,
  RESOURCE_MIME_TYPES,
  RESOURCE_STATIC_DIR,
  formatBytes,
} from '@/lib/resources'

/**
 * Resursele descărcabile: ghiduri, fișe de lucru, prezentări.
 *
 * ## De ce colecție proprie și nu `media`
 *
 * Trei motive, toate de fond:
 *
 * 1. **Accesul.** `media` e publică la citire — copertele trebuie să fie. Aici
 *    citirea e închisă: un document „doar cu formular" care s-ar putea lua
 *    din `/api/media` n-ar fi închis deloc. Publicul ajunge la fișier exclusiv
 *    prin `/api/resurse/[slug]/fisier`, care verifică regula.
 * 2. **Regula de acces stă pe fișier, nu pe articol.** Același ghid poate fi
 *    atașat la cinci articole; dacă bifa ar sta pe articol, ar putea fi liber
 *    într-unul și închis în altul — adică liber.
 * 3. **Limitele.** Documentele au formate și plafon de mărime proprii
 *    (`src/lib/resources.ts`), fără variante de imagine generate.
 *
 * Fișierul se încarcă direct din articol (câmpul „Resurse descărcabile"), din
 * fereastra care se deschide acolo — redactorul nu trebuie să știe că e o
 * colecție separată.
 */
export const Resources: CollectionConfig = {
  slug: 'resources',
  labels: {
    singular: 'Resursă descărcabilă',
    plural: 'Resurse descărcabile',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'access', 'filename', 'updatedAt'],
    group: 'Conținut',
    description: `Documente pe care vizitatorii le pot descărca din articole: PDF, Word, Excel, PowerPoint, EPUB, MP3. Maximum ${formatBytes(RESOURCE_MAX_BYTES)} pe fișier.`,
  },
  access: {
    // Închis public: fișierul se servește doar prin ruta care aplică regula.
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  upload: {
    staticDir: RESOURCE_STATIC_DIR,
    mimeTypes: RESOURCE_MIME_TYPES,
  },
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        // Plafonul se verifică aici, pe server, oricum ar fi urcat fișierul —
        // prin API sau direct în Vercel Blob. Validarea din browser se ocolește.
        const size = req.file?.size ?? (typeof data?.filesize === 'number' ? data.filesize : 0)
        if (size > RESOURCE_MAX_BYTES) {
          throw new APIError(
            `Fișierul are ${formatBytes(size)}. Limita este ${formatBytes(RESOURCE_MAX_BYTES)} — exportă PDF-ul cu imagini comprimate și încearcă din nou.`,
            400,
            undefined,
            true,
          )
        }

        const mime = req.file?.mimetype ?? (typeof data?.mimeType === 'string' ? data.mimeType : null)
        if (mime && !RESOURCE_FORMATS[mime]) {
          throw new APIError(
            'Formatul nu este acceptat. Folosește PDF, Word, Excel, PowerPoint, OpenDocument, EPUB, MP3, JPG sau PNG.',
            400,
            undefined,
            true,
          )
        }
        return data
      },
    ],
    afterChange: [revalidateResource],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titlu',
      required: true,
      maxLength: 120,
      admin: { description: 'Ce primește omul, în cuvintele lui. Ex.: „Ghid: 7 întrebări înainte de o decizie mare".' },
    },
    slugField({
      description:
        'Adresa paginii resursei: /resurse/<slug>. Se completează singur din titlu.',
    }),
    {
      name: 'description',
      type: 'textarea',
      label: 'Descriere scurtă',
      maxLength: 240,
      admin: {
        description: 'Opțional, maximum 240 de caractere. Una-două fraze: ce conține și la ce folosește.',
      },
    },
    {
      name: 'access',
      type: 'radio',
      label: 'Cum se descarcă',
      required: true,
      defaultValue: 'gated',
      options: [
        { label: 'Gratuit, direct', value: 'free' },
        { label: 'Gratuit, după completarea formularului (nume, telefon, email)', value: 'gated' },
      ],
      admin: {
        position: 'sidebar',
        layout: 'vertical',
        description:
          'Cu formular: vizitatorul lasă prenumele, numele, telefonul și emailul și acceptă politica de confidențialitate. Solicitările apar în „Solicitări de resurse".',
      },
    },
  ],
}

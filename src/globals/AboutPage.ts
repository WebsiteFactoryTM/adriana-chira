import type { GlobalConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { seoField } from '@/fields/seo'
import { revalidateAbout } from '@/hooks/revalidate'

/**
 * Pagina „Despre mine".
 *
 * Pagina în sine intră la faza 3b; globalul există de acum pentru că textul ei
 * este printre puținele lucruri pe care clienta le poate scrie fără să aștepte
 * pe nimeni. Narațiunea e rich text — spre deosebire de răspunsurile din FAQ,
 * aici formatarea chiar contează și nu ajunge nicăieri într-o schemă.
 *
 * Cele patru principii sunt filozofia din brief §2; secțiunea `valori` de pe
 * homepage le rezumă, pagina Despre le desfășoară.
 */
export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'Pagina Despre mine',
  admin: {
    group: 'Pagini',
    description: 'Narațiunea, reperele profesionale și cele patru principii.',
    preview: () => `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/despre`,
  },
  versions: { drafts: false, max: 20 },
  hooks: { afterChange: [revalidateAbout] },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Conținut',
          fields: [
            { name: 'title', type: 'text', label: 'Titlul paginii' },
            { name: 'lead', type: 'textarea', label: 'Frază introductivă' },
            {
              name: 'narrative',
              type: 'richText',
              label: 'Narațiune',
              admin: { description: 'Povestea profesională, la persoana întâi.' },
            },
            {
              name: 'portrait',
              type: 'upload',
              relationTo: 'media',
              label: 'Portret',
            },
          ],
        },
        {
          label: 'Repere',
          fields: [
            {
              name: 'credentials',
              type: 'array',
              label: 'Repere profesionale',
              labels: { singular: 'Reper', plural: 'Repere' },
              admin: {
                description: 'Formări, certificări, ani de experiență. Câte unul pe rând.',
              },
              fields: [
                { name: 'text', type: 'text', label: 'Text', required: true },
                { name: 'detail', type: 'text', label: 'Detaliu (opțional)' },
              ],
            },
          ],
        },
        {
          label: 'Principii',
          description: 'Cele patru principii ale filosofiei de lucru.',
          fields: [
            {
              name: 'principles',
              type: 'array',
              label: 'Principii',
              labels: { singular: 'Principiu', plural: 'Principii' },
              maxRows: 4,
              fields: [
                { name: 'title', type: 'text', label: 'Titlu', required: true },
                { name: 'body', type: 'textarea', label: 'Explicație', required: true },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [seoField()],
        },
      ],
    },
  ],
}

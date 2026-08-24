import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, publishedOrAuthenticated } from '@/access'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { revalidatePost, revalidatePostAfterDelete } from '@/hooks/revalidate'
import { lexicalToPlainText, readingTimeMinutes, type LexicalDocument } from '@/lib/lexical'

/**
 * Articolele de blog.
 *
 * Versionare cu ciorne activată: Adriana scrie, salvează, revine. Publicarea e
 * un act separat de salvare, iar publicul vede exclusiv `_status: published`
 * (vezi `publishedOrAuthenticated`).
 *
 * `readingTime` se calculează în `beforeChange` din conținutul Lexical, ca să nu
 * fie un câmp pe care cineva îl uită actualizat. `updatedAt` vine de la Payload
 * și alimentează `dateModified` în schema Article (faza 5b).
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Articol',
    plural: 'Articole',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: 'Conținut',
    description: 'Articolele de pe blog.',
    preview: (doc) =>
      typeof doc?.slug === 'string'
        ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/blog/${doc.slug}`
        : null,
  },
  versions: {
    drafts: {
      autosave: { interval: 1500 },
    },
    maxPerDoc: 20,
  },
  access: {
    read: publishedOrAuthenticated,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        const text = lexicalToPlainText(data?.content as LexicalDocument)
        return {
          ...data,
          readingTime: readingTimeMinutes(text),
        }
      },
    ],
    afterChange: [revalidatePost],
    afterDelete: [revalidatePostAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titlu',
      required: true,
    },
    slugField(),
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Rezumat',
      required: true,
      maxLength: 200,
      admin: {
        description:
          'Maximum 200 de caractere. Apare în cardul de articol, în meta description și în RSS.',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine de copertă',
      admin: {
        description: 'Raport 16:9. Fără imagine, cardul afișează un placeholder crem.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Categorie',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Data publicării',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' },
        description: 'Data afișată pe articol și folosită la sortare.',
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      label: 'Timp de citire (minute)',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Calculat automat din conținut la fiecare salvare.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Conținut',
      required: true,
    },
    {
      name: 'faq',
      type: 'array',
      label: 'Întrebări frecvente pe acest articol',
      labels: { singular: 'Întrebare', plural: 'Întrebări' },
      admin: {
        description:
          'Opțional. Dacă completezi, articolul primește schema FAQPage — răspunsurile pot apărea direct în Google și în răspunsurile AI.',
      },
      fields: [
        { name: 'question', type: 'text', label: 'Întrebare', required: true },
        {
          name: 'answer',
          type: 'textarea',
          label: 'Răspuns',
          required: true,
          admin: {
            description: 'Text simplu, fără formatare. Primele două fraze contează cel mai mult.',
          },
        },
      ],
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      label: 'Articole conexe',
      maxDepth: 1,
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
      admin: {
        description: 'Opțional. Gol = se completează automat din aceeași categorie.',
      },
    },
    seoField(),
  ],
}

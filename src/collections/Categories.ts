import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAdminOrEditor } from '@/access'
import { revalidateHome, revalidateHomeAfterDelete } from '@/hooks/revalidate'
import { slugField } from '@/fields/slug'

/**
 * Categoriile articolelor. Citire publică — apar în navigația blogului și în
 * `BreadcrumbList`. Ștergerea rămâne la administrator: o categorie ștearsă lasă
 * articole fără categorie, iar câmpul e obligatoriu pe `posts`.
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Categorie',
    plural: 'Categorii',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'description'],
    group: 'Conținut',
    description: 'Categoriile în care se împart articolele de blog.',
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidateHome],
    afterDelete: [revalidateHomeAfterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nume',
      required: true,
    },
    slugField({ from: 'name' }),
    {
      name: 'description',
      type: 'textarea',
      label: 'Descriere',
      maxLength: 200,
      admin: {
        description:
          'O frază despre ce găsește cititorul aici. Apare pe pagina categoriei și în meta description.',
      },
    },
  ],
}

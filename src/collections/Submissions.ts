import type { CollectionConfig } from 'payload'

import { isAdmin, noone } from '@/access'

/**
 * Mesajele din formularul de contact.
 *
 * Sunt date cu caracter personal, deci: create doar din cod (ruta de API le
 * scrie cu `overrideAccess`), citite doar de administrator, niciodată de
 * redactori, și niciodată publice.
 *
 * Retenție 12 luni (brief §12). Curățarea se face de jobul din faza 6b;
 * `expiresAt` se completează aici, la creare, ca data limită să existe în
 * document chiar dacă politica se schimbă între timp.
 */
const RETENTION_MONTHS = 12

export const Submissions: CollectionConfig = {
  slug: 'submissions',
  labels: {
    singular: 'Mesaj din formular',
    plural: 'Mesaje din formular',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'handled', 'createdAt'],
    group: 'Administrare',
    description:
      'Mesajele trimise din formularul de contact. Se șterg automat după 12 luni.',
  },
  access: {
    read: isAdmin,
    create: noone,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation !== 'create') return data
        const expires = new Date()
        expires.setMonth(expires.getMonth() + RETENTION_MONTHS)
        return { ...data, expiresAt: expires.toISOString() }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nume', required: true },
    { name: 'email', type: 'email', label: 'Email', required: true },
    { name: 'phone', type: 'text', label: 'Telefon' },
    { name: 'message', type: 'textarea', label: 'Mesaj', required: true },
    {
      name: 'consent',
      type: 'checkbox',
      label: 'A bifat acordul privind prelucrarea datelor',
      required: true,
      admin: {
        readOnly: true,
        description: 'Dovada consimțământului, așa cum a fost trimisă de formular.',
      },
    },
    {
      name: 'handled',
      type: 'checkbox',
      label: 'Rezolvat',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Bifează după ce ai răspuns. Nu afectează termenul de ștergere.',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Se șterge la',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' },
      },
    },
  ],
}

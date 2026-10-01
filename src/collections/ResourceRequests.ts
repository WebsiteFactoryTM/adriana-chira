import type { CollectionConfig } from 'payload'

import { isAdmin, noone } from '@/access'

/**
 * Cine a cerut o resursă cu formular.
 *
 * Aceleași reguli ca `submissions`, pentru același motiv: sunt date cu
 * caracter personal. Create exclusiv din cod (`/api/resurse`), citite doar de
 * administrator, niciodată publice.
 *
 * ## Dovada consimțământului
 *
 * GDPR cere ca operatorul să poată DOVEDI consimțământul (art. 7 alin. 1), nu
 * doar să îl fi cerut. De aceea se păstrează, pe fiecare solicitare, versiunea
 * politicii de confidențialitate acceptate și momentul — o bifă fără context
 * nu dovedește la ce s-a spus „da".
 *
 * Acordul pentru noutăți e separat și opțional. Fără el, adresa primește
 * documentul și atât; nu are voie să intre într-o listă de email.
 *
 * ## Retenție
 *
 * 12 luni, ca mesajele din formular. Cu acord pentru noutăți, datele rămân
 * până la dezabonare — de aceea `expiresAt` rămâne gol în acel caz.
 */
const RETENTION_MONTHS = 12

export const ResourceRequests: CollectionConfig = {
  slug: 'resource-requests',
  labels: {
    singular: 'Solicitare de resursă',
    plural: 'Solicitări de resurse',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'phone', 'resource', 'marketingConsent', 'createdAt'],
    group: 'Administrare',
    description:
      'Persoanele care au completat formularul pentru un document. Se șterg după 12 luni, cu excepția celor care au cerut noutăți pe email.',
  },
  access: {
    read: isAdmin,
    create: noone,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        const previous =
          operation === 'update'
            ? (originalDoc as { expiresAt?: string | null; marketingConsent?: boolean | null })
            : null
        const marketing = data.marketingConsent ?? previous?.marketingConsent
        if (marketing === true) return { ...data, expiresAt: null }
        // Dezabonat din admin: termenul de ștergere pornește de acum. Altfel
        // datele ar rămâne pe termen nedefinit.
        if (previous?.expiresAt) return data
        const expires = new Date()
        expires.setMonth(expires.getMonth() + RETENTION_MONTHS)
        return { ...data, expiresAt: expires.toISOString() }
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', label: 'Prenume', required: true },
        { name: 'lastName', type: 'text', label: 'Nume', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'phone', type: 'text', label: 'Telefon', required: true },
      ],
    },
    {
      name: 'resource',
      type: 'relationship',
      relationTo: 'resources',
      label: 'Resursa cerută',
      // Nu `required`: o resursă ștearsă din admin nu are voie să blocheze
      // ștergerea și nici să ia cu ea solicitările — rămân, cu relația goală.
      admin: { readOnly: true },
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      label: 'Din articolul',
      admin: {
        readOnly: true,
        description: 'Gol = formularul a fost completat pe pagina resursei.',
      },
    },
    {
      name: 'consent',
      type: 'checkbox',
      label: 'A acceptat politica de confidențialitate',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'policyVersion',
      type: 'text',
      label: 'Versiunea politicii acceptate',
      admin: {
        readOnly: true,
        description: 'Data ultimei actualizări a politicii de confidențialitate, în momentul acceptării.',
      },
    },
    {
      name: 'marketingConsent',
      type: 'checkbox',
      label: 'Vrea noutăți pe email',
      defaultValue: false,
      admin: {
        description:
          'Doar cine a bifat poate primi emailuri de prezentare. Debifează dacă persoana cere dezabonarea.',
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

import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAdminOrEditor } from '@/access'
import { revalidateHome, revalidateHomeAfterDelete } from '@/hooks/revalidate'

/**
 * Întrebările frecvente.
 *
 * Răspunsul este `textarea`, nu rich text, și asta e o decizie, nu o scăpare
 * (prompt §4.1): textul intră ca atare în schema `FAQPage` și în `llms.txt`.
 * Un răspuns cu marcaje ar trebui curățat înainte, iar curățarea pierde exact
 * nuanțele pentru care ar fi fost folosit rich text.
 *
 * Tabelul comparativ este opțional și există pentru o singură întrebare din
 * designul aprobat („Cu ce este diferit de coaching sau de psihoterapie?").
 * Îl ținem editabil pentru că e cel mai citat fragment din pagină.
 */
export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: {
    singular: 'Întrebare frecventă',
    plural: 'Întrebări frecvente',
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'page', 'order'],
    group: 'Conținut',
    description: 'Întrebările afișate pe homepage și pe pagina de servicii.',
  },
  defaultSort: 'order',
  hooks: {
    afterChange: [revalidateHome],
    afterDelete: [revalidateHomeAfterDelete],
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      label: 'Întrebare',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      label: 'Răspuns',
      required: true,
      admin: {
        description:
          'Text simplu, fără formatare. Primele două fraze sunt cele care ajung în Google și în răspunsurile AI — pune concluzia la început.',
      },
    },
    {
      name: 'page',
      type: 'select',
      label: 'Unde apare',
      required: true,
      defaultValue: 'homepage',
      options: [
        { label: 'Homepage', value: 'homepage' },
        { label: 'Pagina de servicii', value: 'servicii' },
        { label: 'Ambele', value: 'ambele' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordine',
      required: true,
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Numere mai mici apar primele.',
      },
    },
    {
      name: 'comparisonTable',
      type: 'group',
      label: 'Tabel comparativ (opțional)',
      admin: {
        description:
          'Se afișează sub răspuns. Lasă titlul gol dacă întrebarea nu are tabel.',
      },
      fields: [
        {
          name: 'caption',
          type: 'text',
          label: 'Titlul tabelului',
          admin: {
            description:
              'Nu se vede pe ecran, dar îl citesc cititoarele de ecran și motoarele de căutare. Gol = fără tabel.',
          },
        },
        {
          name: 'columns',
          type: 'array',
          label: 'Coloane',
          labels: { singular: 'Coloană', plural: 'Coloane' },
          fields: [{ name: 'label', type: 'text', label: 'Antet', required: true }],
        },
        {
          name: 'rows',
          type: 'array',
          label: 'Rânduri',
          labels: { singular: 'Rând', plural: 'Rânduri' },
          fields: [
            { name: 'label', type: 'text', label: 'Antetul rândului', required: true },
            {
              name: 'cells',
              type: 'array',
              label: 'Celule',
              labels: { singular: 'Celulă', plural: 'Celule' },
              admin: {
                description: 'Câte una pentru fiecare coloană, în aceeași ordine.',
              },
              fields: [{ name: 'value', type: 'text', label: 'Text', required: true }],
            },
          ],
        },
      ],
    },
  ],
}

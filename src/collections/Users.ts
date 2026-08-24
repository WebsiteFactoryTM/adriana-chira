import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField, isAdminOrSelf } from '@/access'

/**
 * Utilizatorii panoului de administrare.
 *
 * Două roluri, atât. `admin` este Adriana și echipa Website Factory; `editor`
 * este un colaborator care scrie articole. Doar `admin` vede comenzile și
 * mesajele din formularul de contact — vezi `src/access/index.ts`.
 *
 * Rolul nu poate fi schimbat de un editor (`access` pe câmp), altfel escaladarea
 * de privilegii ar fi la un click distanță.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Utilizator',
    plural: 'Utilizatori',
  },
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8 ore
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minute
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Administrare',
    description: 'Cine are acces în acest panou și cu ce drepturi.',
  },
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nume',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rol',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Redactor', value: 'editor' },
      ],
      access: {
        create: isAdminField,
        update: isAdminField,
      },
      admin: {
        description:
          'Administratorul vede tot, inclusiv comenzile și mesajele. Redactorul administrează doar conținutul editorial.',
      },
    },
  ],
}

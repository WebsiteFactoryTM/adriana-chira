import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { revalidateEverything } from '@/hooks/revalidate'

/**
 * Setările site-ului.
 *
 * Aici trăiesc exact elementele blocate în §7 din STATUS.md: email, telefon,
 * datele de firmă, conturile sociale. Când clienta le trimite, se completează
 * de aici și apar peste tot — footer, schema `Person`, paginile legale — fără
 * niciun redeploy.
 *
 * `ga4MeasurementId` stă aici, nu în variabile de mediu (prompt §10): Adriana
 * trebuie să îl poată schimba singură. Gol înseamnă că GA4 nu se încarcă
 * niciodată, ceea ce rămâne comportamentul implicit și corect.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Setările site-ului',
  admin: {
    group: 'Configurare',
    description: 'Datele de contact, firma și conturile care apar pe tot site-ul.',
  },
  hooks: { afterChange: [revalidateEverything] },
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identitate',
          fields: [
            { name: 'siteName', type: 'text', label: 'Nume', required: true },
            {
              name: 'role',
              type: 'text',
              label: 'Rol profesional',
              admin: { description: 'Apare sub nume, în header și în schema Person.' },
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Frază de identitate',
              admin: { description: 'De exemplu: „Claritate înainte de decizie.".' },
            },
            {
              name: 'defaultOgImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagine implicită la partajare',
              admin: {
                description: '1200×630. Se folosește unde pagina nu are imagine proprie.',
              },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'email',
              type: 'email',
              label: 'Email public',
              admin: { description: 'Gol = footerul afișează un placeholder.' },
            },
            { name: 'phone', type: 'text', label: 'Telefon public' },
            { name: 'city', type: 'text', label: 'Oraș', defaultValue: 'Timișoara' },
            { name: 'region', type: 'text', label: 'Județ', defaultValue: 'Timiș' },
            { name: 'country', type: 'text', label: 'Țară', defaultValue: 'România' },
            {
              name: 'responseTime',
              type: 'text',
              label: 'Timp de răspuns',
              admin: { description: 'De exemplu: „Răspund în maximum 24 de ore lucrătoare".' },
            },
            {
              name: 'availability',
              type: 'text',
              label: 'Disponibilitate',
              admin: { description: 'Rândul scurt din footer.' },
            },
            {
              name: 'bookingUrl',
              type: 'text',
              label: 'Link de programare (Cal.com / Calendly)',
              admin: {
                description:
                  'Se încarcă doar la click, niciodată automat — altfel ar fi un terț înainte de consimțământ.',
              },
            },
          ],
        },
        {
          label: 'Rețele sociale',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Conturi',
              labels: { singular: 'Cont', plural: 'Conturi' },
              admin: {
                description:
                  'Adresele complete. Alimentează footerul și câmpul `sameAs` din schema Person.',
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  label: 'Platformă',
                  required: true,
                  options: [
                    { label: 'LinkedIn', value: 'LinkedIn' },
                    { label: 'Instagram', value: 'Instagram' },
                    { label: 'Facebook', value: 'Facebook' },
                    { label: 'YouTube', value: 'YouTube' },
                    { label: 'TikTok', value: 'TikTok' },
                  ],
                },
                { name: 'url', type: 'text', label: 'Adresă', required: true },
              ],
            },
          ],
        },
        {
          label: 'Firmă',
          description:
            'Obligatorii legal în footer și în paginile de Termeni și ANPC (blocaj §7.6).',
          fields: [
            { name: 'companyLegalName', type: 'text', label: 'Denumire legală' },
            { name: 'cui', type: 'text', label: 'CUI' },
            { name: 'regCom', type: 'text', label: 'Nr. Reg. Com.' },
            { name: 'registeredAddress', type: 'textarea', label: 'Sediu social' },
          ],
        },
        {
          label: 'Analytics',
          fields: [
            {
              name: 'ga4MeasurementId',
              type: 'text',
              label: 'ID de măsurare GA4',
              admin: {
                description:
                  'Forma G-XXXXXXXXXX. Gol = Google Analytics nu se încarcă deloc. Oricum se încarcă doar după acordul vizitatorului.',
              },
              validate: (value: unknown) => {
                if (value === null || value === undefined || value === '') return true
                if (typeof value !== 'string' || !/^G-[A-Z0-9]{6,}$/.test(value)) {
                  return 'ID-ul GA4 arată ca G-XXXXXXXXXX.'
                }
                return true
              },
            },
          ],
        },
      ],
    },
  ],
}

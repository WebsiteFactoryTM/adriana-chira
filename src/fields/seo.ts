import type { Field } from 'payload'

/**
 * Grupul SEO, identic pe articole, pachete și pagini.
 *
 * Toate câmpurile sunt opționale: dacă rămân goale, paginile folosesc titlul și
 * `excerpt`-ul documentului. Limitele din descrieri sunt cele la care Google
 * taie afișarea, nu validări dure — un titlu bun de 62 de caractere nu trebuie
 * respins de CMS.
 */
export const seoField = (): Field => ({
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: {
    description: 'Lasă gol ca să se folosească titlul și descrierea documentului.',
  },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Titlu în Google',
      admin: {
        description: 'Ideal sub 60 de caractere. Gol = titlul documentului.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Descriere în Google',
      maxLength: 200,
      admin: {
        description: 'Ideal 150–160 de caractere. Gol = rezumatul documentului.',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine la partajare (1200×630)',
      admin: {
        description: 'Gol = imaginea implicită din Setările site-ului.',
      },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      label: 'Ascunde pagina din motoarele de căutare',
      defaultValue: false,
      admin: {
        description: 'Adaugă `noindex`. Pagina rămâne accesibilă prin link direct.',
      },
    },
  ],
})

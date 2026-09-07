import type { CollectionConfig } from 'payload'

import { activeOrAuthenticated, isAdmin, isAdminOrEditor } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateTestimonial, revalidateTestimonialAfterDelete } from '@/hooks/revalidate'

/**
 * Recomandările.
 *
 * Sunt cuvintele unor oameni reali, semnate cu numele și funcția lor — deci
 * colecția asta e mai aproape de o evidență decât de conținut editorial, iar
 * descrierile din admin spun asta la fiecare câmp.
 *
 * ## De ce nu există câmp de notă, stele sau medie
 *
 * Pentru că nimeni nu a fost rugat să dea un punctaj. Un `AggregateRating`
 * construit dintr-o cifră pe care a ales-o administratorul site-ului este
 * exact motivul pentru care Google dă penalizări manuale pe marcaj înșelător,
 * iar marcajul nostru are o singură regulă (brief §8.3): reflectă exact ce
 * vede utilizatorul. Recomandările se publică drept `Review` fără
 * `reviewRating`, ceea ce este perfect valid.
 *
 * ## De ce `excerpt` este un câmp separat și nu se generează
 *
 * Fraza scoasă în evidență pe homepage trebuie să fie ALEASĂ, nu tăiată la
 * primele 120 de caractere. Un rezumat automat ar pune între ghilimele o
 * frază ciuntită la mijloc, atribuită unui om cu nume. Descrierea câmpului
 * cere explicit copierea unei fraze întregi din textul de dedesubt.
 */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Recomandare',
    plural: 'Recomandări',
  },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'role', 'featured', 'order', 'active'],
    group: 'Conținut',
    description:
      'Recomandările primite de la oameni cu care Adriana a lucrat. Se publică integral, cu acordul scris al autorului.',
  },
  defaultSort: 'order',
  access: {
    read: activeOrAuthenticated,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidateTestimonial],
    afterDelete: [revalidateTestimonialAfterDelete],
  },
  fields: [
    {
      name: 'author',
      type: 'text',
      label: 'Numele autorului',
      required: true,
      admin: { description: 'Așa cum a cerut persoana să fie scris, cu titluri cu tot.' },
    },
    slugField({
      from: 'author',
      description:
        'Ancora recomandării pe pagina /testimoniale. Se completează singură din nume.',
    }),
    {
      /**
       * NU este obligatorie, și e o decizie de modelare, nu o slăbire a
       * validării: nu toate recomandările vin semnate cu o funcție. Când
       * lipsește, rândul dispare de pe card și de pe pagină. A completa noi
       * una ar însemna să atribuim unui om real o poziție pe care nu a
       * declarat-o.
       */
      name: 'role',
      type: 'text',
      label: 'Funcția și organizația',
      admin: {
        description:
          'Ce dă greutate recomandării. De exemplu: „Director general, AGRO MARUS SRL". Lasă gol dacă autorul nu și-a trecut una — nu o completa din presupunere.',
      },
    },
    {
      name: 'context',
      type: 'text',
      label: 'În ce context ați lucrat',
      admin: {
        description:
          'Scurt și factual. De exemplu: „Mentorat individual, 2021–2023". Gol = nu se afișează.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Fraza scoasă în evidență',
      required: true,
      maxLength: 300,
      admin: {
        description:
          'COPIAZĂ o frază întreagă din textul de mai jos, nu o rescrie și nu o tăia la mijloc. Apare pe prima pagină, între ghilimele, sub numele autorului — cine o citește trebuie să o regăsească în textul integral.',
      },
    },
    {
      name: 'paragraphs',
      type: 'array',
      label: 'Textul integral',
      labels: { singular: 'Paragraf', plural: 'Paragrafe' },
      required: true,
      minRows: 1,
      admin: {
        description:
          'Un rând pentru fiecare paragraf, exact ca în textul primit. Nu se rescrie și nu se scurtează: e textul altcuiva.',
      },
      fields: [{ name: 'text', type: 'textarea', label: 'Paragraf', required: true }],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Apare pe prima pagină',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description:
          'Secțiunea de pe prima pagină arată maximum trei recomandări. Textul integral rămâne oricum pe /testimoniale.',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordine',
      required: true,
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Numere mai mici apar primele.' },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Vizibil pe site',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description:
          'Debifează dacă autorul își retrage acordul de publicare. Recomandarea rămâne în evidență, dar dispare de pe site.',
      },
    },
  ],
}

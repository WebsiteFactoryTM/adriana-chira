import type { GlobalConfig } from 'payload'

import { anyone, isAdminOrEditor } from '@/access'
import { eyebrowField, linkField, visibleField } from '@/fields/section'
import { revalidateHomeGlobal } from '@/hooks/revalidate'

/**
 * Textele de pe homepage.
 *
 * Structura urmează exact cele 12 secțiuni ale designului aprobat, în ordinea
 * lui. Ordinea nu e editabilă și nu se pot adăuga secțiuni: designul e lege
 * (regula 1 din STATUS.md §2). Din CMS se schimbă textul și vizibilitatea.
 *
 * Câmpurile lăsate goale nu golesc pagina: resolverul din `src/lib/content.ts`
 * cade pe valorile din `src/content/home.ts`, care sunt textele aprobate. Asta
 * face CMS-ul sigur de folosit — o secțiune pe care nimeni n-a completat-o
 * arată în continuare exact ca în design.
 *
 * Secțiunile `servicii`, `blog` și `faq` au aici doar antetul: conținutul lor
 * vine din colecțiile `packages`, `posts` și `faqs`.
 */
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Pagina principală',
  admin: {
    group: 'Pagini',
    description: 'Textele de pe prima pagină, secțiune cu secțiune.',
    preview: () => process.env.NEXT_PUBLIC_SITE_URL ?? '/',
  },
  versions: { drafts: false, max: 20 },
  hooks: { afterChange: [revalidateHomeGlobal] },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroEyebrow',
              type: 'text',
              label: 'Etichetă',
              admin: { description: 'Rândul versal de deasupra titlului.' },
            },
            {
              name: 'heroHeadline',
              type: 'array',
              label: 'Titlu',
              labels: { singular: 'Rând', plural: 'Rânduri' },
              // Designul aprobat împarte titlul în exact trei rânduri, fiecare
              // cu propria animație de intrare, decalată cu 110ms. Numărul de
              // rânduri e parte din design, nu preferință: de aceea e fixat.
              minRows: 3,
              maxRows: 3,
              admin: {
                description:
                  'Trei rânduri, ca în design. Fiecare intră separat în pagină; poți schimba textul, nu și numărul lor.',
              },
              fields: [{ name: 'text', type: 'text', label: 'Text', required: true }],
            },
            { name: 'heroLead', type: 'textarea', label: 'Frază principală' },
            { name: 'heroIntro', type: 'textarea', label: 'Paragraf introductiv' },
            linkField('heroPrimaryCta', 'Buton principal'),
            linkField('heroSecondaryCta', 'Buton secundar'),
            {
              name: 'heroBadges',
              type: 'array',
              label: 'Etichete de sub butoane',
              labels: { singular: 'Etichetă', plural: 'Etichete' },
              fields: [{ name: 'text', type: 'text', label: 'Text', required: true }],
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Portret',
              admin: {
                description:
                  'Raportul este fixat de design, deci înlocuirea fotografiei nu mișcă pagina.',
              },
            },
          ],
        },
        {
          label: 'Problema',
          name: 'problema',
          fields: [
            visibleField(),
            eyebrowField(),
            { name: 'heading', type: 'textarea', label: 'Titlu' },
            { name: 'body', type: 'textarea', label: 'Text' },
            {
              name: 'signs',
              type: 'array',
              label: 'Semnele',
              labels: { singular: 'Semn', plural: 'Semne' },
              fields: [
                { name: 'index', type: 'text', label: 'Numeral', required: true },
                { name: 'title', type: 'text', label: 'Titlu' },
                { name: 'body', type: 'textarea', label: 'Text' },
              ],
            },
          ],
        },
        {
          label: 'Metoda',
          name: 'metoda',
          fields: [
            visibleField(),
            eyebrowField(),
            { name: 'heading', type: 'textarea', label: 'Titlu' },
            { name: 'body', type: 'textarea', label: 'Text' },
            {
              name: 'steps',
              type: 'array',
              label: 'Etapele',
              labels: { singular: 'Etapă', plural: 'Etape' },
              fields: [
                { name: 'index', type: 'text', label: 'Numeral', required: true },
                { name: 'title', type: 'text', label: 'Titlu' },
                { name: 'body', type: 'textarea', label: 'Text' },
              ],
            },
          ],
        },
        {
          label: 'Pentru cine',
          name: 'pentruCine',
          fields: [
            visibleField(),
            eyebrowField(),
            { name: 'heading', type: 'textarea', label: 'Titlu' },
            { name: 'aside', type: 'textarea', label: 'Text lateral' },
            {
              name: 'segments',
              type: 'array',
              label: 'Segmente',
              labels: { singular: 'Segment', plural: 'Segmente' },
              fields: [
                { name: 'title', type: 'text', label: 'Titlu', required: true },
                { name: 'body', type: 'textarea', label: 'Text' },
              ],
            },
          ],
        },
        {
          label: 'Univers',
          name: 'univers',
          fields: [
            visibleField(),
            eyebrowField(),
            { name: 'heading', type: 'textarea', label: 'Titlu' },
            { name: 'body', type: 'textarea', label: 'Text' },
            { name: 'note', type: 'textarea', label: 'Notă de subsol' },
            {
              name: 'items',
              type: 'array',
              label: 'Programele',
              labels: { singular: 'Program', plural: 'Programe' },
              fields: [
                { name: 'numeral', type: 'text', label: 'Numeral', required: true },
                { name: 'title', type: 'text', label: 'Denumire', required: true },
                {
                  name: 'trademark',
                  type: 'checkbox',
                  label: 'Afișează simbolul de marcă',
                  defaultValue: false,
                },
                { name: 'body', type: 'textarea', label: 'Text' },
              ],
            },
          ],
        },
        {
          label: 'Despre',
          name: 'despre',
          fields: [
            visibleField(),
            eyebrowField(),
            { name: 'heading', type: 'textarea', label: 'Titlu' },
            {
              name: 'paragraphs',
              type: 'array',
              label: 'Paragrafe',
              labels: { singular: 'Paragraf', plural: 'Paragrafe' },
              fields: [{ name: 'text', type: 'textarea', label: 'Text', required: true }],
            },
            {
              name: 'credentials',
              type: 'array',
              label: 'Repere profesionale',
              labels: { singular: 'Reper', plural: 'Repere' },
              fields: [{ name: 'text', type: 'text', label: 'Text', required: true }],
            },
            linkField('link', 'Link către pagina Despre'),
            {
              name: 'portrait',
              type: 'upload',
              relationTo: 'media',
              label: 'Portret',
            },
          ],
        },
        {
          label: 'Valori',
          name: 'valori',
          fields: [
            visibleField(),
            eyebrowField(),
            {
              name: 'values',
              type: 'array',
              label: 'Valorile',
              labels: { singular: 'Valoare', plural: 'Valori' },
              fields: [
                { name: 'index', type: 'text', label: 'Numeral', required: true },
                { name: 'title', type: 'text', label: 'Titlu', required: true },
                { name: 'body', type: 'textarea', label: 'Text' },
              ],
            },
          ],
        },
        {
          label: 'Citat',
          name: 'citat',
          fields: [
            visibleField(),
            {
              name: 'lines',
              type: 'array',
              label: 'Rândurile citatului',
              labels: { singular: 'Rând', plural: 'Rânduri' },
              admin: {
                description:
                  'Împărțirea pe rânduri este parte din design. Păstrează numărul lor.',
              },
              fields: [{ name: 'text', type: 'text', label: 'Text', required: true }],
            },
            { name: 'attribution', type: 'text', label: 'Semnătură' },
          ],
        },
        {
          label: 'Servicii',
          name: 'servicii',
          description: 'Cardurile vin din colecția Pachete. Aici stă doar antetul secțiunii.',
          fields: [
            visibleField(),
            eyebrowField(),
            { name: 'heading', type: 'textarea', label: 'Titlu' },
            { name: 'intro', type: 'textarea', label: 'Text introductiv' },
            {
              name: 'reassurance',
              type: 'array',
              label: 'Rândurile de sub carduri',
              labels: { singular: 'Rând', plural: 'Rânduri' },
              fields: [{ name: 'text', type: 'text', label: 'Text', required: true }],
            },
            linkField('footerLink', 'Link de subsol'),
          ],
        },
        {
          label: 'Blog',
          name: 'blog',
          description: 'Articolele vin din colecția Articole, în ordinea publicării.',
          fields: [
            visibleField(),
            eyebrowField(),
            { name: 'heading', type: 'textarea', label: 'Titlu' },
            linkField('link', 'Link către blog'),
          ],
        },
        {
          label: 'Întrebări frecvente',
          name: 'faq',
          description: 'Întrebările vin din colecția Întrebări frecvente.',
          fields: [
            visibleField(),
            eyebrowField(),
            { name: 'heading', type: 'textarea', label: 'Titlu' },
          ],
        },
        {
          label: 'Invitație finală',
          name: 'cta',
          fields: [
            visibleField(),
            eyebrowField(),
            { name: 'heading', type: 'textarea', label: 'Titlu' },
            { name: 'body', type: 'textarea', label: 'Text' },
            linkField('ctaLink', 'Buton'),
            { name: 'note', type: 'text', label: 'Rândul de sub buton' },
          ],
        },
      ],
    },
  ],
}

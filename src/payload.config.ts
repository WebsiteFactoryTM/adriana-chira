import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { ro } from '@payloadcms/translations/languages/ro'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Categories } from '@/collections/Categories'
import { Faqs } from '@/collections/Faqs'
import { Media } from '@/collections/Media'
import { Orders } from '@/collections/Orders'
import { Packages } from '@/collections/Packages'
import { Posts } from '@/collections/Posts'
import { ResourceRequests } from '@/collections/ResourceRequests'
import { Resources } from '@/collections/Resources'
import { Submissions } from '@/collections/Submissions'
import { Testimonials } from '@/collections/Testimonials'
import { Users } from '@/collections/Users'
import { Workshops } from '@/collections/Workshops'
import { AboutPage } from '@/globals/AboutPage'
import { HomePage } from '@/globals/HomePage'
import { SiteSettings } from '@/globals/SiteSettings'
import { RESOURCE_MAX_BYTES } from '@/lib/resources'
import { siteUrlOr } from '@/lib/site-url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Trei șiruri din traducerea oficială în română folosesc sedila (U+015F, U+0163)
 * în loc de virgula dedesubt, iar unul are chiar substituenții traduși, ceea ce
 * îl împiedică să se completeze. Le corectăm aici: e mai ieftin decât o
 * traducere proprie și se aplică peste tot în panou.
 */
const roCorectat = {
  ...ro,
  translations: {
    ...ro.translations,
    fields: {
      ...ro.translations.fields,
      itemsAndMore: '{{items}} și {{count}} mai multe',
    },
    general: {
      ...ro.translations.general,
      and: 'Și',
      sortByLabelDirection: 'Sortează după {{label}} {{direction}}',
    },
  },
}

/**
 * Stocarea fișierelor.
 *
 * În producție: Vercel Blob. În dezvoltare tokenul lipsește (blocaj §7 din
 * STATUS.md), deci fișierele rămân pe disc, în `public/media/`. Comutarea se
 * face doar aici, iar `Media` nu știe nimic despre ea.
 */
const blobToken = process.env.BLOB_READ_WRITE_TOKEN

/*
  Două decizii, amândouă despre limitele Vercel:

  - `clientUploads`: fișierul urcă din browser DIRECT în Blob. Altfel trece
    prin funcția serverless, care primește cel mult 4,5 MB — un PDF de 8 MB ar
    cădea cu o eroare de platformă, nu cu una de-a noastră. Plafonul real e
    `RESOURCE_MAX_BYTES`, verificat în hook-ul colecției.
  - `addRandomSuffix`: numele din Blob primește un sufix aleator. Adresele
    Blob sunt publice; sufixul le face imposibil de ghicit, ceea ce contează
    pentru documentele „doar cu formular". Ruta noastră nu le dă niciodată
    înainte de formular, iar `resources` nu e citibilă public.

  `disablePayloadAccessControl` pe resurse: ruta de descărcare redirecționează
  direct către Blob, fără să treacă octeții prin funcție (fără cost de transfer
  dublu și fără limita de răspuns).
*/
const storagePlugins = blobToken
  ? [
      vercelBlobStorage({
        enabled: true,
        collections: {
          media: true,
          // Fără `prefix`: pluginul ar adăuga coloana `prefix` în colecție DOAR
          // când există token, deci schema de producție ar diverge de migrații.
          resources: { disablePayloadAccessControl: true },
        },
        token: blobToken,
        addRandomSuffix: true,
        clientUploads: {
          access: ({ req }) => {
            const role = (req.user as { role?: string } | null)?.role
            return role === 'admin' || role === 'editor'
          },
        },
      }),
    ]
  : []

export default buildConfig({
  serverURL: siteUrlOr('http://localhost:3000'),
  secret: process.env.PAYLOAD_SECRET ?? '',

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' · Adriana Chira',
      description: 'Panoul de administrare al site-ului adrianachira.ro',
    },
    // Fără livePreview deocamdată: paginile interioare intră la faza 3b.
  },

  collections: [
    Posts,
    Categories,
    Packages,
    Workshops,
    Testimonials,
    Faqs,
    Media,
    Resources,
    ResourceRequests,
    Orders,
    Submissions,
    Users,
  ],
  globals: [SiteSettings, HomePage, AboutPage],

  editor: lexicalEditor(),

  // Plafonul pentru încărcările care trec prin server (local, sau fără Blob).
  // Cu Blob, documentele ocolesc serverul — vezi `clientUploads` mai sus.
  upload: {
    limits: { fileSize: RESOURCE_MAX_BYTES },
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
      // În serverless, fiecare instanță deschide propriul pool. Ținem numărul
      // mic; connection string-ul din producție este oricum unul POOLED.
      max: 10,
    },
    // Migrațiile se generează cu `pnpm payload migrate:create` și se aplică la
    // build. `push` rămâne activ doar în dezvoltare, unde schema se mișcă des.
    push: process.env.NODE_ENV !== 'production',
  }),

  // Un singur locale. `fallbackLanguage` acoperă și cazul în care browserul
  // cere altă limbă: panoul rămâne în română.
  i18n: {
    fallbackLanguage: 'ro',
    supportedLanguages: { ro: roCorectat },
  },

  sharp,
  plugins: storagePlugins,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  telemetry: false,
})

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
import { resendEmailAdapter } from '@/lib/email'
import { RESOURCE_MAX_BYTES } from '@/lib/resources'
import { SITE_URL } from '@/lib/site-url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Originile de pe care panoul are voie să scrie.
 *
 * Payload acceptă cookie-ul de autentificare la o cerere cu antet `Origin`
 * (orice POST / PATCH / DELETE din panou, inclusiv acțiunile de server care
 * construiesc formularul) DOAR dacă originea e în `csrf`. Altfel îl ignoră în
 * tăcere: cererea pleacă fără utilizator și cade cu 401 / 403, deși pagina
 * arată omul conectat. Exact asta s-a întâmplat în producție până pe
 * 14 octombrie 2026 — vezi STATUS.md §10.
 *
 * De aceea lista nu se mai deduce dintr-o singură adresă, ci cuprinde toate
 * adresele pe care răspunde chiar acest deploy:
 *
 * - adresa canonică ȘI perechea ei cu / fără `www`. Vercel redirecționează una
 *   spre cealaltă, iar care e principala se schimbă din dashboard, nu din cod;
 * - adresele Vercel ale deploy-ului (`*.vercel.app`, previzualizări);
 * - în dezvoltare, `localhost` și `127.0.0.1`, pe portul pe care rulează.
 */
function trustedOrigins(): string[] {
  const origins = new Set<string>()
  const add = (value: string | undefined, protocol = 'https://') => {
    const trimmed = value?.trim()
    if (!trimmed) return
    try {
      const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `${protocol}${trimmed}`
      origins.add(new URL(withProtocol).origin)
    } catch {
      // O variabilă stricată nu are voie să oprească panoul.
    }
  }

  add(SITE_URL)
  const host = new URL(SITE_URL).hostname
  const isDomain = host.includes('.') && !/^[\d.]+$/.test(host) && !host.endsWith('.vercel.app')
  if (isDomain) add(SITE_URL.replace(host, host.startsWith('www.') ? host.slice(4) : `www.${host}`))

  add(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  add(process.env.VERCEL_BRANCH_URL)
  add(process.env.VERCEL_URL)

  if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT ?? '3000'
    add(`localhost:${port}`, 'http://')
    add(`127.0.0.1:${port}`, 'http://')
  }

  return [...origins]
}

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

  `disablePayloadAccessControl`: adresa fișierului e chiar cea din Blob, nu
  `/api/<colecție>/file/…` trecut prin funcție.
  - pe resurse, ruta de descărcare redirecționează direct către Blob (fără
    cost de transfer dublu și fără limita de răspuns);
  - pe media, `next/image` primește o adresă `*.public.blob.vercel-storage.com`,
    singura gazdă din `remotePatterns`. Prin proxy, adresa ar fi fost pe
    domeniul site-ului, pe care `next/image` îl refuză ca sursă externă.
    `media` e oricum publică la citire, deci nu se pierde niciun control.

  Pluginul e înregistrat ÎNTOTDEAUNA, oprit din `enabled` când lipsește
  tokenul. Componenta din browser care urcă fișierul în Blob trebuie să fie în
  `importMap.js`, iar harta se generează local, unde tokenul lipsește. Cu
  pluginul omis complet, harta n-o conținea, iar în producție panoul nu avea
  cu ce să urce direct în Blob. Oprit, pluginul nu schimbă schema și nu atinge
  stocarea: fișierele rămân pe disc.
*/
const storagePlugins = [
  vercelBlobStorage({
    enabled: Boolean(blobToken),
    collections: {
      // Fără `prefix`: pluginul ar adăuga coloana `prefix` în colecție DOAR
      // când există token, deci schema de producție ar diverge de migrații.
      media: { disablePayloadAccessControl: true },
      resources: { disablePayloadAccessControl: true },
    },
    token: blobToken ?? '',
    addRandomSuffix: true,
    clientUploads: {
      access: ({ req }) => {
        const role = (req.user as { role?: string } | null)?.role
        return role === 'admin' || role === 'editor'
      },
    },
  }),
]

export default buildConfig({
  // `serverURL` lipsește INTENȚIONAT. Cu el, panoul își construiește adresele
  // absolute pe acea gazdă — inclusiv ruta de semnare pentru încărcarea în
  // Blob. Deschis pe altă gazdă (`www` față de domeniul fără `www`), browserul
  // trimitea fișierul cross-origin, spre o redirecționare 308, iar încărcarea
  // rămânea agățată. Fără el, panoul vorbește relativ cu gazda pe care e
  // deschis, iar protecția CSRF stă în lista explicită de mai jos.
  csrf: trustedOrigins(),
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

  // „Ai uitat parola?" din panou, prin Resend. Fără cheie rămâne adaptorul de
  // consolă al Payload: linkul de resetare apare în log, nu într-un inbox.
  email: resendEmailAdapter(),

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

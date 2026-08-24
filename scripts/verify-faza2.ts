/**
 * Verificările de acceptanță ale fazei 2 (prompt §4, „Verificare fază 2").
 * Script temporar de verificare — nu face parte din livrare.
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const results: { name: string; ok: boolean; detail: string }[] = []

function check(name: string, ok: boolean, detail = ''): void {
  results.push({ name, ok, detail })
}

const payload = await getPayload({ config })

/* -------------------------------------------------------------------------- */
/* 1. Etichete în română: niciun câmp fără `label` explicit                     */
/* -------------------------------------------------------------------------- */

type AnyField = {
  name?: string
  type: string
  label?: unknown
  fields?: AnyField[]
  tabs?: { label?: unknown; name?: string; fields: AnyField[] }[]
  options?: unknown[]
}

// Câmpuri pe care Payload le adaugă singur și le traduce din propriul dicționar.
const AUTO = new Set([
  'id',
  'updatedAt',
  'createdAt',
  '_status',
  'email',
  'resetPasswordToken',
  'resetPasswordExpiration',
  'salt',
  'hash',
  'loginAttempts',
  'lockUntil',
  'sessions',
  'filename',
  'mimeType',
  'filesize',
  'width',
  'height',
  'focalX',
  'focalY',
  'sizes',
  'url',
  'thumbnailURL',
  'prefix',
])

const missing: string[] = []

function walk(fields: AnyField[], path: string): void {
  for (const field of fields) {
    const here = field.name ? `${path}.${field.name}` : `${path}.<${field.type}>`

    if (field.tabs) {
      for (const tab of field.tabs) {
        if (!tab.label) missing.push(`${here} (tab fără etichetă)`)
        walk(tab.fields, tab.name ? `${here}.${tab.name}` : here)
      }
      continue
    }

    // Câmpurile interne ale Payload (ex. `sessions`) au copii pe care nu îi
    // controlăm; nu coborâm în ele.
    if (field.name && AUTO.has(field.name)) continue

    if (field.name && !field.label && field.type !== 'ui') {
      missing.push(here)
    }

    if (field.fields) walk(field.fields, here)
  }
}

for (const collection of payload.config.collections) {
  if (collection.slug.startsWith('payload-')) continue
  if (!collection.labels?.singular) missing.push(`${collection.slug} (colecție fără etichetă)`)
  walk(collection.fields as AnyField[], collection.slug)
}

for (const global of payload.config.globals) {
  if (!global.label) missing.push(`${global.slug} (global fără etichetă)`)
  walk(global.fields as AnyField[], global.slug)
}

check(
  'Toate etichetele din admin sunt scrise explicit (în română)',
  missing.length === 0,
  missing.length ? `fără etichetă: ${missing.join(', ')}` : `${'toate câmpurile au label'}`,
)

/* -------------------------------------------------------------------------- */
/* 2. Redactorul publică articole, dar nu vede comenzile                       */
/* -------------------------------------------------------------------------- */

const EDITOR_EMAIL = 'verificare-redactor@example.invalid'

// Curățăm o eventuală rulare anterioară.
const stale = await payload.find({
  collection: 'users',
  where: { email: { equals: EDITOR_EMAIL } },
  overrideAccess: true,
})
for (const doc of stale.docs) {
  await payload.delete({ collection: 'users', id: doc.id, overrideAccess: true })
}

const editor = await payload.create({
  collection: 'users',
  data: {
    email: EDITOR_EMAIL,
    password: 'verificare-temporara-123',
    name: 'Redactor de verificare',
    role: 'editor',
  },
  overrideAccess: true,
})

const admin = (
  await payload.find({
    collection: 'users',
    where: { role: { equals: 'admin' } },
    limit: 1,
    overrideAccess: true,
  })
).docs[0]

// 2a. Redactorul NU vede comenzile.
let ordersVisible = true
try {
  await payload.find({
    collection: 'orders',
    user: editor,
    overrideAccess: false,
  })
} catch {
  ordersVisible = false
}
check('Redactorul nu vede colecția Comenzi', !ordersVisible)

// 2b. Administratorul le vede.
let adminSeesOrders = false
try {
  await payload.find({ collection: 'orders', user: admin, overrideAccess: false })
  adminSeesOrders = true
} catch (error) {
  adminSeesOrders = false
  check('!! eroare la citirea comenzilor ca admin', false, String(error))
}
check('Administratorul vede colecția Comenzi', adminSeesOrders)

// 2c. Redactorul poate publica un articol.
const draft = (
  await payload.find({
    collection: 'posts',
    limit: 1,
    draft: true,
    overrideAccess: true,
  })
).docs[0]

let published = false
let publishError = ''
if (draft) {
  try {
    const updated = await payload.update({
      collection: 'posts',
      id: draft.id,
      data: { _status: 'published' },
      user: editor,
      overrideAccess: false,
    })
    published = updated._status === 'published'
    // Îl punem la loc pe ciornă: articolele nu au încă text.
    await payload.update({
      collection: 'posts',
      id: draft.id,
      data: { _status: 'draft' },
      overrideAccess: true,
    })
  } catch (error) {
    publishError = error instanceof Error ? error.message : String(error)
  }
}
check('Redactorul poate publica un articol', published, publishError)

// 2d. Redactorul NU poate schimba rolurile.
let roleEscalated = false
try {
  const promoted = await payload.update({
    collection: 'users',
    id: editor.id,
    data: { role: 'admin' },
    user: editor,
    overrideAccess: false,
  })
  roleEscalated = promoted.role === 'admin'
} catch {
  roleEscalated = false
}
check('Redactorul nu își poate ridica singur rolul la administrator', !roleEscalated)

/* -------------------------------------------------------------------------- */
/* 3. `alt` la media este blocant                                              */
/* -------------------------------------------------------------------------- */

// PNG 1×1, cel mai mic fișier valid pe care îl poate procesa sharp.
const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

let altBlocked = false
let altMessage = ''
try {
  await payload.create({
    collection: 'media',
    // Tipul generat impune deja `alt`, deci cazul "lipsește complet" nici nu
    // compilează. Ce verificăm aici e cazul realist: câmpul lăsat gol.
    data: { alt: '   ' },
    file: {
      data: PNG_1X1,
      mimetype: 'image/png',
      name: 'verificare-fara-alt.png',
      size: PNG_1X1.byteLength,
    },
    overrideAccess: true,
  })
} catch (error) {
  altBlocked = true
  altMessage = error instanceof Error ? error.message : String(error)
}
check('Încărcarea cu text alternativ gol este respinsă', altBlocked, altMessage)

// Cu `alt` completat, aceeași încărcare trebuie să treacă.
let altAccepted = false
let uploadedId: number | string | null = null
try {
  const created = await payload.create({
    collection: 'media',
    data: { alt: 'Fișier de verificare, un pixel alb' },
    file: {
      data: PNG_1X1,
      mimetype: 'image/png',
      name: 'verificare-cu-alt.png',
      size: PNG_1X1.byteLength,
    },
    overrideAccess: true,
  })
  altAccepted = true
  uploadedId = created.id
} catch (error) {
  altMessage = error instanceof Error ? error.message : String(error)
}
check('Încărcarea cu text alternativ trece', altAccepted, altAccepted ? '' : altMessage)

/* -------------------------------------------------------------------------- */
/* 4. Conținutul public nu scapă                                               */
/* -------------------------------------------------------------------------- */

const publicPosts = await payload.find({ collection: 'posts', overrideAccess: false })
check(
  'Publicul nu vede articolele nepublicate',
  publicPosts.totalDocs === 0,
  `vizibile public: ${publicPosts.totalDocs}`,
)

const publicPackages = await payload.find({ collection: 'packages', overrideAccess: false })
check(
  'Publicul nu vede pachetele ascunse',
  publicPackages.totalDocs === 0,
  `vizibile public: ${publicPackages.totalDocs}`,
)

const publicSubmissions = await payload
  .find({ collection: 'submissions', overrideAccess: false })
  .then((r) => r.totalDocs)
  .catch(() => -1)
check('Publicul nu poate citi mesajele din formular', publicSubmissions === -1)

/* -------------------------------------------------------------------------- */
/* Curățenie                                                                   */
/* -------------------------------------------------------------------------- */

await payload.delete({ collection: 'users', id: editor.id, overrideAccess: true })
if (uploadedId !== null) {
  await payload.delete({ collection: 'media', id: uploadedId, overrideAccess: true })
}

/* -------------------------------------------------------------------------- */

console.log('\n  VERIFICARE FAZA 2\n')
let failed = 0
for (const result of results) {
  if (!result.ok) failed += 1
  console.log(`  ${result.ok ? 'OK  ' : 'PICĂ'}  ${result.name}`)
  if (result.detail) console.log(`         ${result.detail}`)
}
console.log(`\n  ${results.length - failed}/${results.length} verificări trecute\n`)

await payload.destroy()
process.exit(failed === 0 ? 0 : 1)

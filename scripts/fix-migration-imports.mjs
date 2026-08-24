/**
 * Repară importurile din migrațiile generate de Payload.
 *
 * Generatorul scrie:
 *   import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
 *
 * `MigrateUpArgs` și `MigrateDownArgs` sunt însă doar TIPURI. Proiectul rulează
 * ca ESM nativ (`"type": "module"`), iar Node le caută la execuție ca exporturi
 * reale și cade cu:
 *   SyntaxError: does not provide an export named 'MigrateDownArgs'
 *
 * Scriptul separă importul de tip. Este idempotent, deci se poate rula oricând:
 * după fiecare `pnpm payload migrate:create`, și automat înainte de deploy.
 */
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.join(process.cwd(), 'src', 'migrations')

const BAD = "import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'"
const GOOD = [
  '// Tipurile se importă separat: generatorul Payload le scrie ca import de',
  '// valoare, iar Node le caută la rulare și cade. Vezi scripts/fix-migration-imports.mjs.',
  "import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'",
  "import { sql } from '@payloadcms/db-postgres'",
].join('\n')

if (!fs.existsSync(DIR)) {
  console.log('Nu există src/migrations — nimic de reparat.')
  process.exit(0)
}

let fixed = 0
for (const file of fs.readdirSync(DIR)) {
  if (!file.endsWith('.ts') || file === 'index.ts') continue
  const full = path.join(DIR, file)
  const source = fs.readFileSync(full, 'utf8')
  if (!source.includes(BAD)) continue
  fs.writeFileSync(full, source.replace(BAD, GOOD))
  console.log(`reparat: ${file}`)
  fixed += 1
}

console.log(fixed === 0 ? 'Toate migrațiile erau deja corecte.' : `${fixed} migrații reparate.`)

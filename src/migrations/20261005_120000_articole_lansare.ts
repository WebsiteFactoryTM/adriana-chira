// Tipurile se importă separat: generatorul Payload le scrie ca import de
// valoare, iar Node le caută la rulare și cade. Vezi scripts/fix-migration-imports.mjs.
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { seedLaunchPosts } from '../seed/posts'

/**
 * 5 octombrie 2026: articolele de lansare, cu textul livrat de clientă.
 *
 * Nicio schimbare de schemă (snapshot-ul `.json` e copia celui anterior). Până
 * acum, cele trei articole din design stăteau în CMS ca ciorne cu
 * `[ DE COMPLETAT ]`, deci `/blog` era gol și cardurile de pe homepage duceau
 * la 404. Migrația le completează și le publică, plus încă patru noi, chiar la
 * deploy (`pnpm build:deploy` rulează `payload migrate`), fără ca cineva să
 * aibă nevoie de credențialele bazei de producție.
 *
 * Aceeași regulă ca în `texte_pozitive`: se scrie doar peste textul exact
 * livrat de seed. Un articol pe care Adriana l-a scris în admin rămâne neatins.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const report = await seedLaunchPosts(payload, { req })
  payload.logger.info(
    `Articole de lansare: ${report.created} create, ${report.published} publicate, ${report.skipped.length} sărite.`,
  )
  for (const reason of report.skipped) payload.logger.info(`  sărit: ${reason}`)
}

/**
 * Fără `down`: ar însemna să depublicăm sau să ștergem text real, posibil deja
 * corectat în admin. Un articol se retrage din admin, nu dintr-o migrație.
 */
export async function down(_args: MigrateDownArgs): Promise<void> {}

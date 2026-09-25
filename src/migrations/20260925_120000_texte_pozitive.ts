// Tipurile se importă separat: generatorul Payload le scrie ca import de
// valoare, iar Node le caută la rulare și cade. Vezi scripts/fix-migration-imports.mjs.
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Cerut pe 25 septembrie 2026: fără formulări negative în apelurile la acțiune.
 * „Dacă nu este potrivit să lucrăm împreună, îți spun" devine o promisiune spusă
 * pozitiv. Nicio schimbare de schemă — doar text scris de seed.
 *
 * Aceeași regulă ca în `pret_la_cerere`: se înlocuiește numai textul exact
 * livrat de seed. Ce a rescris Adriana în admin rămâne neatins.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "home_page"
   SET "cta_body" = 'Prima discuție este despre situația ta, nu despre pachete. La final știi clar care este pasul potrivit pentru tine.'
   WHERE "cta_body" = 'Prima discuție este despre situația ta, nu despre pachete. Dacă nu este potrivit să lucrăm împreună, îți spun.';`)

  await db.execute(sql`
   UPDATE "faqs"
   SET "answer" = 'Începem cu o discuție inițială în care clarificăm împreună obiectivul și direcția de lucru. Urmează o etapă de evaluare și analiză, apoi sesiuni de lucru structurate în jurul situației și a deciziei tale. Durata și formatul depind de pachetul ales.'
   WHERE "answer" = 'Începem cu o discuție inițială în care stabilim împreună dacă este potrivit să lucrăm. Urmează o etapă de evaluare și analiză, apoi sesiuni de lucru structurate în jurul situației și a deciziei tale. Durata și formatul depind de pachetul ales.';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "home_page"
   SET "cta_body" = 'Prima discuție este despre situația ta, nu despre pachete. Dacă nu este potrivit să lucrăm împreună, îți spun.'
   WHERE "cta_body" = 'Prima discuție este despre situația ta, nu despre pachete. La final știi clar care este pasul potrivit pentru tine.';`)

  await db.execute(sql`
   UPDATE "faqs"
   SET "answer" = 'Începem cu o discuție inițială în care stabilim împreună dacă este potrivit să lucrăm. Urmează o etapă de evaluare și analiză, apoi sesiuni de lucru structurate în jurul situației și a deciziei tale. Durata și formatul depind de pachetul ales.'
   WHERE "answer" = 'Începem cu o discuție inițială în care clarificăm împreună obiectivul și direcția de lucru. Urmează o etapă de evaluare și analiză, apoi sesiuni de lucru structurate în jurul situației și a deciziei tale. Durata și formatul depind de pachetul ales.';`)
}

// Tipurile se importă separat: generatorul Payload le scrie ca import de
// valoare, iar Node le caută la rulare și cade. Vezi scripts/fix-migration-imports.mjs.
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "testimonials" ALTER COLUMN "role" DROP NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "testimonials" ALTER COLUMN "role" SET NOT NULL;`)
}

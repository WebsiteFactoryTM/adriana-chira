// Tipurile se importă separat: generatorul Payload le scrie ca import de
// valoare, iar Node le caută la rulare și cade. Vezi scripts/fix-migration-imports.mjs.
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "packages" ADD COLUMN "price_on_request" boolean DEFAULT false;`)

  // Cerut de clientă pe 25 septembrie 2026: CLAR™ și Executive Performance
  // Program™ se vând pe ofertă. Seed-ul creează pachetele o singură dată
  // (`createOnly`), deci pe o bază deja populată — producția — doar migrația
  // poate aduce bifa. Potrivirea e pe slug, ca în tot restul proiectului.
  await db.execute(sql`
   UPDATE "packages" SET "price_on_request" = true
   WHERE "slug" IN ('program-performanta-clar', 'executive-performance-program');`)

  // Două întrebări frecvente scrise de seed pomeneau suma. Cu prețul la
  // cerere, ar fi fost singurul loc din pagină care îl mai afișa. Se înlocuiesc
  // doar textele exacte livrate de seed: dacă Adriana le-a rescris deja în
  // admin, condiția nu se potrivește și textul ei rămâne neatins.
  await db.execute(sql`
   UPDATE "packages_faq"
   SET "answer" = 'Da. Investiția poate fi achitată integral sau în două tranșe egale. Calendarul plății îl stabilim împreună, odată cu oferta.'
   WHERE "answer" = 'Da. Investiția de 5.100 lei poate fi achitată integral sau în două tranșe egale de 2.550 lei. Dacă alegi plata în tranșe, scrie-mi înainte de plată ca să stabilim calendarul.';`)
  await db.execute(sql`
   UPDATE "packages_faq"
   SET "question" = 'Ce include investiția?'
   WHERE "question" = 'Ce include investiția de 15.000 lei?';`)

  // Introducerea secțiunii de servicii de pe prima pagină promitea că „poți
  // achiziționa direct din pagină" — adevărat acum doar pentru evaluare.
  // Aceeași regulă: se schimbă doar textul exact scris de seed.
  await db.execute(sql`
   UPDATE "home_page"
   SET "servicii_intro" = 'Fiecare pachet spune clar ce conține, cât durează și pentru cine este potrivit. Evaluarea se achiziționează direct din pagină, cu plata securizată prin card; pentru programele de durată primești o ofertă personalizată.'
   WHERE "servicii_intro" = 'Fiecare pachet spune clar ce conține, cât durează și pentru cine este potrivit. Poți achiziționa direct din pagină, cu plata securizată prin card.';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "packages" DROP COLUMN "price_on_request";`)
}

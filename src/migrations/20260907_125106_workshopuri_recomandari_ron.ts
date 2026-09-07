// Tipurile se importă separat: generatorul Payload le scrie ca import de
// valoare, iar Node le caută la rulare și cade. Vezi scripts/fix-migration-imports.mjs.
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_workshops_stripe_sync_status" AS ENUM('synced', 'skipped', 'error');
  CREATE TYPE "public"."enum_orders_item_type" AS ENUM('pachet', 'workshop');
  ALTER TYPE "public"."enum_faqs_page" ADD VALUE 'workshopuri' BEFORE 'ambele';
  CREATE TABLE "workshops_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "workshops_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "workshops" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"subtitle" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"session_date" timestamp(3) with time zone,
  	"price" numeric DEFAULT 510 NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"active" boolean DEFAULT true,
  	"what" varchar NOT NULL,
  	"problems" varchar NOT NULL,
  	"work_method" varchar NOT NULL,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"stripe_product_id" varchar,
  	"stripe_price_id" varchar,
  	"stripe_sync_status" "enum_workshops_stripe_sync_status" DEFAULT 'skipped',
  	"stripe_sync_message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"context" varchar,
  	"excerpt" varchar NOT NULL,
  	"featured" boolean DEFAULT true,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "orders" ALTER COLUMN "currency" SET DEFAULT 'RON';
  ALTER TABLE "orders" ADD COLUMN "item_type" "enum_orders_item_type" DEFAULT 'pachet' NOT NULL;
  ALTER TABLE "orders" ADD COLUMN "workshop_id" integer;
  ALTER TABLE "orders" ADD COLUMN "session_date_snapshot" varchar;
  ALTER TABLE "orders" ADD COLUMN "quantity" numeric DEFAULT 1 NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "workshops_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "workshops_outcomes" ADD CONSTRAINT "workshops_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."workshops"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "workshops_keywords" ADD CONSTRAINT "workshops_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."workshops"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "workshops" ADD CONSTRAINT "workshops_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials_paragraphs" ADD CONSTRAINT "testimonials_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "workshops_outcomes_order_idx" ON "workshops_outcomes" USING btree ("_order");
  CREATE INDEX "workshops_outcomes_parent_id_idx" ON "workshops_outcomes" USING btree ("_parent_id");
  CREATE INDEX "workshops_keywords_order_idx" ON "workshops_keywords" USING btree ("_order");
  CREATE INDEX "workshops_keywords_parent_id_idx" ON "workshops_keywords" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "workshops_slug_idx" ON "workshops" USING btree ("slug");
  CREATE INDEX "workshops_session_date_idx" ON "workshops" USING btree ("session_date");
  CREATE INDEX "workshops_seo_seo_og_image_idx" ON "workshops" USING btree ("seo_og_image_id");
  CREATE INDEX "workshops_updated_at_idx" ON "workshops" USING btree ("updated_at");
  CREATE INDEX "workshops_created_at_idx" ON "workshops" USING btree ("created_at");
  CREATE INDEX "testimonials_paragraphs_order_idx" ON "testimonials_paragraphs" USING btree ("_order");
  CREATE INDEX "testimonials_paragraphs_parent_id_idx" ON "testimonials_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "testimonials_slug_idx" ON "testimonials" USING btree ("slug");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  ALTER TABLE "orders" ADD CONSTRAINT "orders_workshop_id_workshops_id_fk" FOREIGN KEY ("workshop_id") REFERENCES "public"."workshops"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_workshops_fk" FOREIGN KEY ("workshops_id") REFERENCES "public"."workshops"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "orders_workshop_idx" ON "orders" USING btree ("workshop_id");
  CREATE INDEX "payload_locked_documents_rels_workshops_id_idx" ON "payload_locked_documents_rels" USING btree ("workshops_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "workshops_outcomes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "workshops_keywords" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "workshops" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "testimonials_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "testimonials" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "workshops_outcomes" CASCADE;
  DROP TABLE "workshops_keywords" CASCADE;
  DROP TABLE "workshops" CASCADE;
  DROP TABLE "testimonials_paragraphs" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  ALTER TABLE "orders" DROP CONSTRAINT "orders_workshop_id_workshops_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_workshops_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_testimonials_fk";
  
  ALTER TABLE "faqs" ALTER COLUMN "page" SET DATA TYPE text;
  ALTER TABLE "faqs" ALTER COLUMN "page" SET DEFAULT 'homepage'::text;
  DROP TYPE "public"."enum_faqs_page";
  CREATE TYPE "public"."enum_faqs_page" AS ENUM('homepage', 'servicii', 'ambele');
  ALTER TABLE "faqs" ALTER COLUMN "page" SET DEFAULT 'homepage'::"public"."enum_faqs_page";
  ALTER TABLE "faqs" ALTER COLUMN "page" SET DATA TYPE "public"."enum_faqs_page" USING "page"::"public"."enum_faqs_page";
  DROP INDEX "orders_workshop_idx";
  DROP INDEX "payload_locked_documents_rels_workshops_id_idx";
  DROP INDEX "payload_locked_documents_rels_testimonials_id_idx";
  ALTER TABLE "orders" ALTER COLUMN "currency" SET DEFAULT 'EUR';
  ALTER TABLE "orders" DROP COLUMN "item_type";
  ALTER TABLE "orders" DROP COLUMN "workshop_id";
  ALTER TABLE "orders" DROP COLUMN "session_date_snapshot";
  ALTER TABLE "orders" DROP COLUMN "quantity";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "workshops_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "testimonials_id";
  DROP TYPE "public"."enum_workshops_stripe_sync_status";
  DROP TYPE "public"."enum_orders_item_type";`)
}

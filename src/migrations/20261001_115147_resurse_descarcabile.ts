// Tipurile se importă separat: generatorul Payload le scrie ca import de
// valoare, iar Node le caută la rulare și cade. Vezi scripts/fix-migration-imports.mjs.
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_resources_access" AS ENUM('free', 'gated');
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"access" "enum_resources_access" DEFAULT 'gated' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "resource_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"resource_id" integer,
  	"post_id" integer,
  	"consent" boolean DEFAULT false NOT NULL,
  	"policy_version" varchar,
  	"marketing_consent" boolean DEFAULT false,
  	"expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "posts_rels" ADD COLUMN "resources_id" integer;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "resources_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "resources_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "resource_requests_id" integer;
  ALTER TABLE "resource_requests" ADD CONSTRAINT "resource_requests_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resource_requests" ADD CONSTRAINT "resource_requests_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "resources_slug_idx" ON "resources" USING btree ("slug");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE UNIQUE INDEX "resources_filename_idx" ON "resources" USING btree ("filename");
  CREATE INDEX "resource_requests_resource_idx" ON "resource_requests" USING btree ("resource_id");
  CREATE INDEX "resource_requests_post_idx" ON "resource_requests" USING btree ("post_id");
  CREATE INDEX "resource_requests_updated_at_idx" ON "resource_requests" USING btree ("updated_at");
  CREATE INDEX "resource_requests_created_at_idx" ON "resource_requests" USING btree ("created_at");
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resource_requests_fk" FOREIGN KEY ("resource_requests_id") REFERENCES "public"."resource_requests"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_rels_resources_id_idx" ON "posts_rels" USING btree ("resources_id");
  CREATE INDEX "_posts_v_rels_resources_id_idx" ON "_posts_v_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_resource_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("resource_requests_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "resources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "resource_requests" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "resource_requests" CASCADE;
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_resources_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_resources_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_resources_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_resource_requests_fk";
  
  DROP INDEX "posts_rels_resources_id_idx";
  DROP INDEX "_posts_v_rels_resources_id_idx";
  DROP INDEX "payload_locked_documents_rels_resources_id_idx";
  DROP INDEX "payload_locked_documents_rels_resource_requests_id_idx";
  ALTER TABLE "posts_rels" DROP COLUMN "resources_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "resources_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "resources_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "resource_requests_id";
  DROP TYPE "public"."enum_resources_access";`)
}

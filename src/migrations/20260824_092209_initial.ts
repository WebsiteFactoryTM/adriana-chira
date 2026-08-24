// Tipurile se importă separat: generatorul Payload le scrie ca import de
// valoare, iar Node le caută la rulare și cade. Vezi scripts/fix-migration-imports.mjs.
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_packages_format" AS ENUM('online', 'fata-in-fata', 'hibrid');
  CREATE TYPE "public"."enum_packages_stripe_sync_status" AS ENUM('synced', 'skipped', 'error');
  CREATE TYPE "public"."enum_faqs_page" AS ENUM('homepage', 'servicii', 'ambele');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('paid', 'refunded', 'failed');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('LinkedIn', 'Instagram', 'Facebook', 'YouTube', 'TikTok');
  CREATE TYPE "public"."enum_home_page_problema_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum_home_page_metoda_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum_home_page_pentru_cine_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum_home_page_univers_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum_home_page_despre_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum_home_page_valori_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum_home_page_servicii_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum_home_page_blog_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum_home_page_faq_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum_home_page_cta_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum__home_page_v_version_problema_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum__home_page_v_version_metoda_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum__home_page_v_version_pentru_cine_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum__home_page_v_version_univers_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum__home_page_v_version_despre_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum__home_page_v_version_valori_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum__home_page_v_version_servicii_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum__home_page_v_version_blog_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum__home_page_v_version_faq_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TYPE "public"."enum__home_page_v_version_cta_eyebrow_ornament" AS ENUM('line', 'pulse', 'none');
  CREATE TABLE "posts_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"category_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"reading_time" numeric,
  	"content" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "_posts_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_category_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_reading_time" numeric,
  	"version_content" jsonb,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "packages_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "packages_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "packages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"tagline" varchar,
  	"for_who" varchar,
  	"duration" varchar,
  	"format" "enum_packages_format" DEFAULT 'hibrid',
  	"price" numeric,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"featured" boolean DEFAULT false,
  	"active" boolean DEFAULT true,
  	"long_description" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"stripe_product_id" varchar,
  	"stripe_price_id" varchar,
  	"stripe_sync_status" "enum_packages_stripe_sync_status" DEFAULT 'skipped',
  	"stripe_sync_message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_comparison_table_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "faqs_comparison_table_rows_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "faqs_comparison_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"page" "enum_faqs_page" DEFAULT 'homepage' NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"comparison_table_caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"credit" varchar,
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
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stripe_session_id" varchar NOT NULL,
  	"stripe_payment_intent_id" varchar,
  	"package_id" integer,
  	"package_name_snapshot" varchar NOT NULL,
  	"amount" numeric NOT NULL,
  	"currency" varchar DEFAULT 'EUR' NOT NULL,
  	"customer_name" varchar,
  	"customer_email" varchar NOT NULL,
  	"customer_phone" varchar,
  	"status" "enum_orders_status" DEFAULT 'paid' NOT NULL,
  	"raw_event" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"message" varchar NOT NULL,
  	"consent" boolean DEFAULT false NOT NULL,
  	"handled" boolean DEFAULT false,
  	"expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"packages_id" integer,
  	"faqs_id" integer,
  	"media_id" integer,
  	"orders_id" integer,
  	"submissions_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar NOT NULL,
  	"role" varchar,
  	"tagline" varchar,
  	"default_og_image_id" integer,
  	"email" varchar,
  	"phone" varchar,
  	"city" varchar DEFAULT 'Timișoara',
  	"region" varchar DEFAULT 'Timiș',
  	"country" varchar DEFAULT 'România',
  	"response_time" varchar,
  	"availability" varchar,
  	"booking_url" varchar,
  	"company_legal_name" varchar,
  	"cui" varchar,
  	"reg_com" varchar,
  	"registered_address" varchar,
  	"ga4_measurement_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_hero_headline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_hero_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_problema_signs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"index" varchar NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "home_page_metoda_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"index" varchar NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "home_page_pentru_cine_segments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "home_page_univers_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"numeral" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"trademark" boolean DEFAULT false,
  	"body" varchar
  );
  
  CREATE TABLE "home_page_despre_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_despre_credentials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_valori_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"index" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "home_page_citat_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_servicii_reassurance" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_lead" varchar,
  	"hero_intro" varchar,
  	"hero_primary_cta_label" varchar,
  	"hero_primary_cta_href" varchar,
  	"hero_secondary_cta_label" varchar,
  	"hero_secondary_cta_href" varchar,
  	"hero_image_id" integer,
  	"problema_visible" boolean DEFAULT true,
  	"problema_eyebrow_text" varchar NOT NULL,
  	"problema_eyebrow_ornament" "enum_home_page_problema_eyebrow_ornament" DEFAULT 'line',
  	"problema_heading" varchar,
  	"problema_body" varchar,
  	"metoda_visible" boolean DEFAULT true,
  	"metoda_eyebrow_text" varchar NOT NULL,
  	"metoda_eyebrow_ornament" "enum_home_page_metoda_eyebrow_ornament" DEFAULT 'line',
  	"metoda_heading" varchar,
  	"metoda_body" varchar,
  	"pentru_cine_visible" boolean DEFAULT true,
  	"pentru_cine_eyebrow_text" varchar NOT NULL,
  	"pentru_cine_eyebrow_ornament" "enum_home_page_pentru_cine_eyebrow_ornament" DEFAULT 'line',
  	"pentru_cine_heading" varchar,
  	"pentru_cine_aside" varchar,
  	"univers_visible" boolean DEFAULT true,
  	"univers_eyebrow_text" varchar NOT NULL,
  	"univers_eyebrow_ornament" "enum_home_page_univers_eyebrow_ornament" DEFAULT 'line',
  	"univers_heading" varchar,
  	"univers_body" varchar,
  	"univers_note" varchar,
  	"despre_visible" boolean DEFAULT true,
  	"despre_eyebrow_text" varchar NOT NULL,
  	"despre_eyebrow_ornament" "enum_home_page_despre_eyebrow_ornament" DEFAULT 'line',
  	"despre_heading" varchar,
  	"despre_link_label" varchar,
  	"despre_link_href" varchar,
  	"despre_portrait_id" integer,
  	"valori_visible" boolean DEFAULT true,
  	"valori_eyebrow_text" varchar NOT NULL,
  	"valori_eyebrow_ornament" "enum_home_page_valori_eyebrow_ornament" DEFAULT 'line',
  	"citat_visible" boolean DEFAULT true,
  	"citat_attribution" varchar,
  	"servicii_visible" boolean DEFAULT true,
  	"servicii_eyebrow_text" varchar NOT NULL,
  	"servicii_eyebrow_ornament" "enum_home_page_servicii_eyebrow_ornament" DEFAULT 'line',
  	"servicii_heading" varchar,
  	"servicii_intro" varchar,
  	"servicii_footer_link_label" varchar,
  	"servicii_footer_link_href" varchar,
  	"blog_visible" boolean DEFAULT true,
  	"blog_eyebrow_text" varchar NOT NULL,
  	"blog_eyebrow_ornament" "enum_home_page_blog_eyebrow_ornament" DEFAULT 'line',
  	"blog_heading" varchar,
  	"blog_link_label" varchar,
  	"blog_link_href" varchar,
  	"faq_visible" boolean DEFAULT true,
  	"faq_eyebrow_text" varchar NOT NULL,
  	"faq_eyebrow_ornament" "enum_home_page_faq_eyebrow_ornament" DEFAULT 'line',
  	"faq_heading" varchar,
  	"cta_visible" boolean DEFAULT true,
  	"cta_eyebrow_text" varchar NOT NULL,
  	"cta_eyebrow_ornament" "enum_home_page_cta_eyebrow_ornament" DEFAULT 'line',
  	"cta_heading" varchar,
  	"cta_body" varchar,
  	"cta_cta_link_label" varchar,
  	"cta_cta_link_href" varchar,
  	"cta_note" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_home_page_v_version_hero_headline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_hero_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_problema_signs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"index" varchar NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_metoda_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"index" varchar NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_pentru_cine_segments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_univers_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"numeral" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"trademark" boolean DEFAULT false,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_despre_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_despre_credentials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_valori_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"index" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_citat_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_servicii_reassurance" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar,
  	"version_hero_lead" varchar,
  	"version_hero_intro" varchar,
  	"version_hero_primary_cta_label" varchar,
  	"version_hero_primary_cta_href" varchar,
  	"version_hero_secondary_cta_label" varchar,
  	"version_hero_secondary_cta_href" varchar,
  	"version_hero_image_id" integer,
  	"version_problema_visible" boolean DEFAULT true,
  	"version_problema_eyebrow_text" varchar NOT NULL,
  	"version_problema_eyebrow_ornament" "enum__home_page_v_version_problema_eyebrow_ornament" DEFAULT 'line',
  	"version_problema_heading" varchar,
  	"version_problema_body" varchar,
  	"version_metoda_visible" boolean DEFAULT true,
  	"version_metoda_eyebrow_text" varchar NOT NULL,
  	"version_metoda_eyebrow_ornament" "enum__home_page_v_version_metoda_eyebrow_ornament" DEFAULT 'line',
  	"version_metoda_heading" varchar,
  	"version_metoda_body" varchar,
  	"version_pentru_cine_visible" boolean DEFAULT true,
  	"version_pentru_cine_eyebrow_text" varchar NOT NULL,
  	"version_pentru_cine_eyebrow_ornament" "enum__home_page_v_version_pentru_cine_eyebrow_ornament" DEFAULT 'line',
  	"version_pentru_cine_heading" varchar,
  	"version_pentru_cine_aside" varchar,
  	"version_univers_visible" boolean DEFAULT true,
  	"version_univers_eyebrow_text" varchar NOT NULL,
  	"version_univers_eyebrow_ornament" "enum__home_page_v_version_univers_eyebrow_ornament" DEFAULT 'line',
  	"version_univers_heading" varchar,
  	"version_univers_body" varchar,
  	"version_univers_note" varchar,
  	"version_despre_visible" boolean DEFAULT true,
  	"version_despre_eyebrow_text" varchar NOT NULL,
  	"version_despre_eyebrow_ornament" "enum__home_page_v_version_despre_eyebrow_ornament" DEFAULT 'line',
  	"version_despre_heading" varchar,
  	"version_despre_link_label" varchar,
  	"version_despre_link_href" varchar,
  	"version_despre_portrait_id" integer,
  	"version_valori_visible" boolean DEFAULT true,
  	"version_valori_eyebrow_text" varchar NOT NULL,
  	"version_valori_eyebrow_ornament" "enum__home_page_v_version_valori_eyebrow_ornament" DEFAULT 'line',
  	"version_citat_visible" boolean DEFAULT true,
  	"version_citat_attribution" varchar,
  	"version_servicii_visible" boolean DEFAULT true,
  	"version_servicii_eyebrow_text" varchar NOT NULL,
  	"version_servicii_eyebrow_ornament" "enum__home_page_v_version_servicii_eyebrow_ornament" DEFAULT 'line',
  	"version_servicii_heading" varchar,
  	"version_servicii_intro" varchar,
  	"version_servicii_footer_link_label" varchar,
  	"version_servicii_footer_link_href" varchar,
  	"version_blog_visible" boolean DEFAULT true,
  	"version_blog_eyebrow_text" varchar NOT NULL,
  	"version_blog_eyebrow_ornament" "enum__home_page_v_version_blog_eyebrow_ornament" DEFAULT 'line',
  	"version_blog_heading" varchar,
  	"version_blog_link_label" varchar,
  	"version_blog_link_href" varchar,
  	"version_faq_visible" boolean DEFAULT true,
  	"version_faq_eyebrow_text" varchar NOT NULL,
  	"version_faq_eyebrow_ornament" "enum__home_page_v_version_faq_eyebrow_ornament" DEFAULT 'line',
  	"version_faq_heading" varchar,
  	"version_cta_visible" boolean DEFAULT true,
  	"version_cta_eyebrow_text" varchar NOT NULL,
  	"version_cta_eyebrow_ornament" "enum__home_page_v_version_cta_eyebrow_ornament" DEFAULT 'line',
  	"version_cta_heading" varchar,
  	"version_cta_body" varchar,
  	"version_cta_cta_link_label" varchar,
  	"version_cta_cta_link_href" varchar,
  	"version_cta_note" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "about_page_credentials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"detail" varchar
  );
  
  CREATE TABLE "about_page_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"lead" varchar,
  	"narrative" jsonb,
  	"portrait_id" integer,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_about_page_v_version_credentials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v_version_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_title" varchar,
  	"version_lead" varchar,
  	"version_narrative" jsonb,
  	"version_portrait_id" integer,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "posts_faq" ADD CONSTRAINT "posts_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_faq" ADD CONSTRAINT "_posts_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "packages_includes" ADD CONSTRAINT "packages_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "packages_faq" ADD CONSTRAINT "packages_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "packages" ADD CONSTRAINT "packages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faqs_comparison_table_columns" ADD CONSTRAINT "faqs_comparison_table_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_comparison_table_rows_cells" ADD CONSTRAINT "faqs_comparison_table_rows_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs_comparison_table_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_comparison_table_rows" ADD CONSTRAINT "faqs_comparison_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_packages_fk" FOREIGN KEY ("packages_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_submissions_fk" FOREIGN KEY ("submissions_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_hero_headline" ADD CONSTRAINT "home_page_hero_headline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hero_badges" ADD CONSTRAINT "home_page_hero_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_problema_signs" ADD CONSTRAINT "home_page_problema_signs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_metoda_steps" ADD CONSTRAINT "home_page_metoda_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_pentru_cine_segments" ADD CONSTRAINT "home_page_pentru_cine_segments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_univers_items" ADD CONSTRAINT "home_page_univers_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_despre_paragraphs" ADD CONSTRAINT "home_page_despre_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_despre_credentials" ADD CONSTRAINT "home_page_despre_credentials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_valori_values" ADD CONSTRAINT "home_page_valori_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_citat_lines" ADD CONSTRAINT "home_page_citat_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_servicii_reassurance" ADD CONSTRAINT "home_page_servicii_reassurance_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_despre_portrait_id_media_id_fk" FOREIGN KEY ("despre_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_hero_headline" ADD CONSTRAINT "_home_page_v_version_hero_headline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_hero_badges" ADD CONSTRAINT "_home_page_v_version_hero_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_problema_signs" ADD CONSTRAINT "_home_page_v_version_problema_signs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_metoda_steps" ADD CONSTRAINT "_home_page_v_version_metoda_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_pentru_cine_segments" ADD CONSTRAINT "_home_page_v_version_pentru_cine_segments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_univers_items" ADD CONSTRAINT "_home_page_v_version_univers_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_despre_paragraphs" ADD CONSTRAINT "_home_page_v_version_despre_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_despre_credentials" ADD CONSTRAINT "_home_page_v_version_despre_credentials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_valori_values" ADD CONSTRAINT "_home_page_v_version_valori_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_citat_lines" ADD CONSTRAINT "_home_page_v_version_citat_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_servicii_reassurance" ADD CONSTRAINT "_home_page_v_version_servicii_reassurance_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_despre_portrait_id_media_id_fk" FOREIGN KEY ("version_despre_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_credentials" ADD CONSTRAINT "about_page_credentials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_principles" ADD CONSTRAINT "about_page_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_credentials" ADD CONSTRAINT "_about_page_v_version_credentials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_version_principles" ADD CONSTRAINT "_about_page_v_version_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v" ADD CONSTRAINT "_about_page_v_version_portrait_id_media_id_fk" FOREIGN KEY ("version_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_page_v" ADD CONSTRAINT "_about_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_faq_order_idx" ON "posts_faq" USING btree ("_order");
  CREATE INDEX "posts_faq_parent_id_idx" ON "posts_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "posts_seo_seo_og_image_idx" ON "posts" USING btree ("seo_og_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_version_faq_order_idx" ON "_posts_v_version_faq" USING btree ("_order");
  CREATE INDEX "_posts_v_version_faq_parent_id_idx" ON "_posts_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_seo_version_seo_og_image_idx" ON "_posts_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "packages_includes_order_idx" ON "packages_includes" USING btree ("_order");
  CREATE INDEX "packages_includes_parent_id_idx" ON "packages_includes" USING btree ("_parent_id");
  CREATE INDEX "packages_faq_order_idx" ON "packages_faq" USING btree ("_order");
  CREATE INDEX "packages_faq_parent_id_idx" ON "packages_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "packages_slug_idx" ON "packages" USING btree ("slug");
  CREATE INDEX "packages_seo_seo_og_image_idx" ON "packages" USING btree ("seo_og_image_id");
  CREATE INDEX "packages_updated_at_idx" ON "packages" USING btree ("updated_at");
  CREATE INDEX "packages_created_at_idx" ON "packages" USING btree ("created_at");
  CREATE INDEX "faqs_comparison_table_columns_order_idx" ON "faqs_comparison_table_columns" USING btree ("_order");
  CREATE INDEX "faqs_comparison_table_columns_parent_id_idx" ON "faqs_comparison_table_columns" USING btree ("_parent_id");
  CREATE INDEX "faqs_comparison_table_rows_cells_order_idx" ON "faqs_comparison_table_rows_cells" USING btree ("_order");
  CREATE INDEX "faqs_comparison_table_rows_cells_parent_id_idx" ON "faqs_comparison_table_rows_cells" USING btree ("_parent_id");
  CREATE INDEX "faqs_comparison_table_rows_order_idx" ON "faqs_comparison_table_rows" USING btree ("_order");
  CREATE INDEX "faqs_comparison_table_rows_parent_id_idx" ON "faqs_comparison_table_rows" USING btree ("_parent_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "orders_stripe_session_id_idx" ON "orders" USING btree ("stripe_session_id");
  CREATE INDEX "orders_package_idx" ON "orders" USING btree ("package_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "submissions_updated_at_idx" ON "submissions" USING btree ("updated_at");
  CREATE INDEX "submissions_created_at_idx" ON "submissions" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_packages_id_idx" ON "payload_locked_documents_rels" USING btree ("packages_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("submissions_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  CREATE INDEX "home_page_hero_headline_order_idx" ON "home_page_hero_headline" USING btree ("_order");
  CREATE INDEX "home_page_hero_headline_parent_id_idx" ON "home_page_hero_headline" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_badges_order_idx" ON "home_page_hero_badges" USING btree ("_order");
  CREATE INDEX "home_page_hero_badges_parent_id_idx" ON "home_page_hero_badges" USING btree ("_parent_id");
  CREATE INDEX "home_page_problema_signs_order_idx" ON "home_page_problema_signs" USING btree ("_order");
  CREATE INDEX "home_page_problema_signs_parent_id_idx" ON "home_page_problema_signs" USING btree ("_parent_id");
  CREATE INDEX "home_page_metoda_steps_order_idx" ON "home_page_metoda_steps" USING btree ("_order");
  CREATE INDEX "home_page_metoda_steps_parent_id_idx" ON "home_page_metoda_steps" USING btree ("_parent_id");
  CREATE INDEX "home_page_pentru_cine_segments_order_idx" ON "home_page_pentru_cine_segments" USING btree ("_order");
  CREATE INDEX "home_page_pentru_cine_segments_parent_id_idx" ON "home_page_pentru_cine_segments" USING btree ("_parent_id");
  CREATE INDEX "home_page_univers_items_order_idx" ON "home_page_univers_items" USING btree ("_order");
  CREATE INDEX "home_page_univers_items_parent_id_idx" ON "home_page_univers_items" USING btree ("_parent_id");
  CREATE INDEX "home_page_despre_paragraphs_order_idx" ON "home_page_despre_paragraphs" USING btree ("_order");
  CREATE INDEX "home_page_despre_paragraphs_parent_id_idx" ON "home_page_despre_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "home_page_despre_credentials_order_idx" ON "home_page_despre_credentials" USING btree ("_order");
  CREATE INDEX "home_page_despre_credentials_parent_id_idx" ON "home_page_despre_credentials" USING btree ("_parent_id");
  CREATE INDEX "home_page_valori_values_order_idx" ON "home_page_valori_values" USING btree ("_order");
  CREATE INDEX "home_page_valori_values_parent_id_idx" ON "home_page_valori_values" USING btree ("_parent_id");
  CREATE INDEX "home_page_citat_lines_order_idx" ON "home_page_citat_lines" USING btree ("_order");
  CREATE INDEX "home_page_citat_lines_parent_id_idx" ON "home_page_citat_lines" USING btree ("_parent_id");
  CREATE INDEX "home_page_servicii_reassurance_order_idx" ON "home_page_servicii_reassurance" USING btree ("_order");
  CREATE INDEX "home_page_servicii_reassurance_parent_id_idx" ON "home_page_servicii_reassurance" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_image_idx" ON "home_page" USING btree ("hero_image_id");
  CREATE INDEX "home_page_despre_despre_portrait_idx" ON "home_page" USING btree ("despre_portrait_id");
  CREATE INDEX "_home_page_v_version_hero_headline_order_idx" ON "_home_page_v_version_hero_headline" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_hero_headline_parent_id_idx" ON "_home_page_v_version_hero_headline" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_hero_badges_order_idx" ON "_home_page_v_version_hero_badges" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_hero_badges_parent_id_idx" ON "_home_page_v_version_hero_badges" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_problema_signs_order_idx" ON "_home_page_v_version_problema_signs" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_problema_signs_parent_id_idx" ON "_home_page_v_version_problema_signs" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_metoda_steps_order_idx" ON "_home_page_v_version_metoda_steps" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_metoda_steps_parent_id_idx" ON "_home_page_v_version_metoda_steps" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_pentru_cine_segments_order_idx" ON "_home_page_v_version_pentru_cine_segments" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_pentru_cine_segments_parent_id_idx" ON "_home_page_v_version_pentru_cine_segments" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_univers_items_order_idx" ON "_home_page_v_version_univers_items" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_univers_items_parent_id_idx" ON "_home_page_v_version_univers_items" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_despre_paragraphs_order_idx" ON "_home_page_v_version_despre_paragraphs" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_despre_paragraphs_parent_id_idx" ON "_home_page_v_version_despre_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_despre_credentials_order_idx" ON "_home_page_v_version_despre_credentials" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_despre_credentials_parent_id_idx" ON "_home_page_v_version_despre_credentials" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_valori_values_order_idx" ON "_home_page_v_version_valori_values" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_valori_values_parent_id_idx" ON "_home_page_v_version_valori_values" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_citat_lines_order_idx" ON "_home_page_v_version_citat_lines" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_citat_lines_parent_id_idx" ON "_home_page_v_version_citat_lines" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_servicii_reassurance_order_idx" ON "_home_page_v_version_servicii_reassurance" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_servicii_reassurance_parent_id_idx" ON "_home_page_v_version_servicii_reassurance" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_version_hero_image_idx" ON "_home_page_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_home_page_v_version_despre_version_despre_portrait_idx" ON "_home_page_v" USING btree ("version_despre_portrait_id");
  CREATE INDEX "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
  CREATE INDEX "about_page_credentials_order_idx" ON "about_page_credentials" USING btree ("_order");
  CREATE INDEX "about_page_credentials_parent_id_idx" ON "about_page_credentials" USING btree ("_parent_id");
  CREATE INDEX "about_page_principles_order_idx" ON "about_page_principles" USING btree ("_order");
  CREATE INDEX "about_page_principles_parent_id_idx" ON "about_page_principles" USING btree ("_parent_id");
  CREATE INDEX "about_page_portrait_idx" ON "about_page" USING btree ("portrait_id");
  CREATE INDEX "about_page_seo_seo_og_image_idx" ON "about_page" USING btree ("seo_og_image_id");
  CREATE INDEX "_about_page_v_version_credentials_order_idx" ON "_about_page_v_version_credentials" USING btree ("_order");
  CREATE INDEX "_about_page_v_version_credentials_parent_id_idx" ON "_about_page_v_version_credentials" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_version_principles_order_idx" ON "_about_page_v_version_principles" USING btree ("_order");
  CREATE INDEX "_about_page_v_version_principles_parent_id_idx" ON "_about_page_v_version_principles" USING btree ("_parent_id");
  CREATE INDEX "_about_page_v_version_version_portrait_idx" ON "_about_page_v" USING btree ("version_portrait_id");
  CREATE INDEX "_about_page_v_version_seo_version_seo_og_image_idx" ON "_about_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_about_page_v_created_at_idx" ON "_about_page_v" USING btree ("created_at");
  CREATE INDEX "_about_page_v_updated_at_idx" ON "_about_page_v" USING btree ("updated_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "posts_faq" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_faq" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "packages_includes" CASCADE;
  DROP TABLE "packages_faq" CASCADE;
  DROP TABLE "packages" CASCADE;
  DROP TABLE "faqs_comparison_table_columns" CASCADE;
  DROP TABLE "faqs_comparison_table_rows_cells" CASCADE;
  DROP TABLE "faqs_comparison_table_rows" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "submissions" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "home_page_hero_headline" CASCADE;
  DROP TABLE "home_page_hero_badges" CASCADE;
  DROP TABLE "home_page_problema_signs" CASCADE;
  DROP TABLE "home_page_metoda_steps" CASCADE;
  DROP TABLE "home_page_pentru_cine_segments" CASCADE;
  DROP TABLE "home_page_univers_items" CASCADE;
  DROP TABLE "home_page_despre_paragraphs" CASCADE;
  DROP TABLE "home_page_despre_credentials" CASCADE;
  DROP TABLE "home_page_valori_values" CASCADE;
  DROP TABLE "home_page_citat_lines" CASCADE;
  DROP TABLE "home_page_servicii_reassurance" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "_home_page_v_version_hero_headline" CASCADE;
  DROP TABLE "_home_page_v_version_hero_badges" CASCADE;
  DROP TABLE "_home_page_v_version_problema_signs" CASCADE;
  DROP TABLE "_home_page_v_version_metoda_steps" CASCADE;
  DROP TABLE "_home_page_v_version_pentru_cine_segments" CASCADE;
  DROP TABLE "_home_page_v_version_univers_items" CASCADE;
  DROP TABLE "_home_page_v_version_despre_paragraphs" CASCADE;
  DROP TABLE "_home_page_v_version_despre_credentials" CASCADE;
  DROP TABLE "_home_page_v_version_valori_values" CASCADE;
  DROP TABLE "_home_page_v_version_citat_lines" CASCADE;
  DROP TABLE "_home_page_v_version_servicii_reassurance" CASCADE;
  DROP TABLE "_home_page_v" CASCADE;
  DROP TABLE "about_page_credentials" CASCADE;
  DROP TABLE "about_page_principles" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "_about_page_v_version_credentials" CASCADE;
  DROP TABLE "_about_page_v_version_principles" CASCADE;
  DROP TABLE "_about_page_v" CASCADE;
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_packages_format";
  DROP TYPE "public"."enum_packages_stripe_sync_status";
  DROP TYPE "public"."enum_faqs_page";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_site_settings_social_links_platform";
  DROP TYPE "public"."enum_home_page_problema_eyebrow_ornament";
  DROP TYPE "public"."enum_home_page_metoda_eyebrow_ornament";
  DROP TYPE "public"."enum_home_page_pentru_cine_eyebrow_ornament";
  DROP TYPE "public"."enum_home_page_univers_eyebrow_ornament";
  DROP TYPE "public"."enum_home_page_despre_eyebrow_ornament";
  DROP TYPE "public"."enum_home_page_valori_eyebrow_ornament";
  DROP TYPE "public"."enum_home_page_servicii_eyebrow_ornament";
  DROP TYPE "public"."enum_home_page_blog_eyebrow_ornament";
  DROP TYPE "public"."enum_home_page_faq_eyebrow_ornament";
  DROP TYPE "public"."enum_home_page_cta_eyebrow_ornament";
  DROP TYPE "public"."enum__home_page_v_version_problema_eyebrow_ornament";
  DROP TYPE "public"."enum__home_page_v_version_metoda_eyebrow_ornament";
  DROP TYPE "public"."enum__home_page_v_version_pentru_cine_eyebrow_ornament";
  DROP TYPE "public"."enum__home_page_v_version_univers_eyebrow_ornament";
  DROP TYPE "public"."enum__home_page_v_version_despre_eyebrow_ornament";
  DROP TYPE "public"."enum__home_page_v_version_valori_eyebrow_ornament";
  DROP TYPE "public"."enum__home_page_v_version_servicii_eyebrow_ornament";
  DROP TYPE "public"."enum__home_page_v_version_blog_eyebrow_ornament";
  DROP TYPE "public"."enum__home_page_v_version_faq_eyebrow_ornament";
  DROP TYPE "public"."enum__home_page_v_version_cta_eyebrow_ornament";`)
}

CREATE TABLE IF NOT EXISTS "attributes" (
	"attribute_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"type" varchar NOT NULL,
	"list" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companies" (
	"company_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"address" varchar NOT NULL,
	"phone" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contacts" (
	"contact_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"address" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"type" text DEFAULT 'customer' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_logs" (
	"item_log_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" text NOT NULL,
	"note" varchar(255) NOT NULL,
	"ref" varchar(255) NOT NULL,
	"activity" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items" (
	"item_id" varchar(255) PRIMARY KEY NOT NULL,
	"rfid" varchar(255) NOT NULL,
	"qr" varchar(500) NOT NULL,
	"in_stock" boolean NOT NULL,
	"gin" varchar(255) NOT NULL,
	"on_transfer" boolean NOT NULL,
	"attribute1_value" varchar(255),
	"attribute2_value" varchar(255),
	"attribute3_value" varchar(255),
	"product_id" integer NOT NULL,
	"location_id" integer,
	"warehouse_id" integer NOT NULL,
	"supplier_id" integer NOT NULL,
	"has_expired_date" boolean NOT NULL,
	"expired_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "items_rfid_unique" UNIQUE("rfid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "locations" (
	"location_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"parent_id" integer,
	"path" varchar DEFAULT '' NOT NULL,
	"path_name" varchar DEFAULT '' NOT NULL,
	"warehouse_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"image" varchar NOT NULL,
	"category_id" integer NOT NULL,
	"attribute1_id" integer,
	"attribute2_id" integer,
	"attribute3_id" integer,
	"qty_min" integer NOT NULL,
	"qty_max" integer NOT NULL,
	"unit_base_id" integer NOT NULL,
	"unit_sub_id" integer NOT NULL,
	"convertion_factor" integer NOT NULL,
	"product_code" varchar DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "unit_converts" (
	"unit_convert_id" serial PRIMARY KEY NOT NULL,
	"unit_base_id" integer NOT NULL,
	"unit_sub_id" integer NOT NULL,
	"conversion_factor" integer NOT NULL,
	"created_at" varchar(255) NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "units" (
	"unit_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"symbol" varchar(255) NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "warehouses" (
	"warehouse_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"address" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"company_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inbound_details" (
	"inbound_detail_id" uuid PRIMARY KEY NOT NULL,
	"inbound_id" varchar NOT NULL,
	"item_id" text NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inbounds" (
	"inbound_id" varchar PRIMARY KEY NOT NULL,
	"inbound_date" timestamp NOT NULL,
	"supplier_id" integer NOT NULL,
	"user_id" uuid NOT NULL,
	"warehouse_id" integer NOT NULL,
	"location_id" integer NOT NULL,
	"ref" varchar NOT NULL,
	"note" varchar NOT NULL,
	"scan_type" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "outbound_details" (
	"outbound_detail_id" uuid PRIMARY KEY NOT NULL,
	"outbound_id" varchar NOT NULL,
	"item_id" text NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "outbounds" (
	"outbound_id" varchar PRIMARY KEY NOT NULL,
	"outbound_date" timestamp NOT NULL,
	"customer_id" integer NOT NULL,
	"user_id" uuid NOT NULL,
	"warehouse_id" integer NOT NULL,
	"location_id" integer NOT NULL,
	"ref" varchar NOT NULL,
	"note" varchar NOT NULL,
	"scan_type" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_opname_profiles" (
	"stock_opname_profile_id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"warehouse_id" integer NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_opname_details" (
	"stock_opname_id" varchar NOT NULL,
	"stock_opname_detail_id" varchar(255) PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"item_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_opnames" (
	"stock_opname_id" varchar(255) PRIMARY KEY NOT NULL,
	"stock_opname_date" date NOT NULL,
	"stock_opname_profile_id" varchar NOT NULL,
	"location_id" integer NOT NULL,
	"scan_type" varchar(10) NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transfer_details" (
	"transfer_detail_id" uuid PRIMARY KEY NOT NULL,
	"transfer_id" varchar NOT NULL,
	"item_id" text NOT NULL,
	"item_id_missing" text DEFAULT '' NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transfers" (
	"transfer_id" varchar PRIMARY KEY NOT NULL,
	"transfer_date" timestamp NOT NULL,
	"received_date" timestamp,
	"origin_id" integer NOT NULL,
	"destination_id" integer NOT NULL,
	"origin_user_id" uuid NOT NULL,
	"destination_user_id" uuid,
	"ref" varchar NOT NULL,
	"note" varchar NOT NULL,
	"receive_note" varchar DEFAULT '' NOT NULL,
	"scan_type" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "relocations" (
	"relocation_id" varchar PRIMARY KEY NOT NULL,
	"relocation_date" timestamp NOT NULL,
	"origin_id" integer NOT NULL,
	"destination_id" integer NOT NULL,
	"user_id" uuid NOT NULL,
	"ref" varchar NOT NULL,
	"note" varchar NOT NULL,
	"scan_type" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "relocation_details" (
	"relocation_detail_id" uuid PRIMARY KEY NOT NULL,
	"relocation_id" varchar NOT NULL,
	"item_id" text NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menus" (
	"menu_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"parent" varchar DEFAULT '0' NOT NULL,
	"url_menu" varchar NOT NULL,
	"sort" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role_menus" (
	"role_menu_id" serial PRIMARY KEY NOT NULL,
	"role_id" integer NOT NULL,
	"menu_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"role_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"phone" varchar DEFAULT '' NOT NULL,
	"username" varchar DEFAULT '' NOT NULL,
	"role_id" integer NOT NULL,
	"company_id" integer,
	"url_picture" varchar DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_logs" (
	"user_log_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"device" json NOT NULL,
	"version" varchar(255) NOT NULL,
	"activity" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"ref" varchar(255) NOT NULL,
	"note" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_warehouses" (
	"user_warehouse_id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"warehouse_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_logs" ADD CONSTRAINT "item_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_location_id_locations_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("location_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_warehouse_id_warehouses_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("warehouse_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items" ADD CONSTRAINT "items_supplier_id_contacts_contact_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."contacts"("contact_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "locations" ADD CONSTRAINT "locations_warehouse_id_warehouses_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("warehouse_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_attribute1_id_attributes_attribute_id_fk" FOREIGN KEY ("attribute1_id") REFERENCES "public"."attributes"("attribute_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_attribute2_id_attributes_attribute_id_fk" FOREIGN KEY ("attribute2_id") REFERENCES "public"."attributes"("attribute_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_attribute3_id_attributes_attribute_id_fk" FOREIGN KEY ("attribute3_id") REFERENCES "public"."attributes"("attribute_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_unit_base_id_units_unit_id_fk" FOREIGN KEY ("unit_base_id") REFERENCES "public"."units"("unit_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_unit_sub_id_units_unit_id_fk" FOREIGN KEY ("unit_sub_id") REFERENCES "public"."units"("unit_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "unit_converts" ADD CONSTRAINT "unit_converts_unit_base_id_units_unit_id_fk" FOREIGN KEY ("unit_base_id") REFERENCES "public"."units"("unit_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "unit_converts" ADD CONSTRAINT "unit_converts_unit_sub_id_units_unit_id_fk" FOREIGN KEY ("unit_sub_id") REFERENCES "public"."units"("unit_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_company_id_companies_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("company_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inbound_details" ADD CONSTRAINT "inbound_details_inbound_id_inbounds_inbound_id_fk" FOREIGN KEY ("inbound_id") REFERENCES "public"."inbounds"("inbound_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inbound_details" ADD CONSTRAINT "inbound_details_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inbounds" ADD CONSTRAINT "inbounds_supplier_id_contacts_contact_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."contacts"("contact_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inbounds" ADD CONSTRAINT "inbounds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inbounds" ADD CONSTRAINT "inbounds_warehouse_id_warehouses_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("warehouse_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inbounds" ADD CONSTRAINT "inbounds_location_id_locations_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("location_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "outbound_details" ADD CONSTRAINT "outbound_details_outbound_id_outbounds_outbound_id_fk" FOREIGN KEY ("outbound_id") REFERENCES "public"."outbounds"("outbound_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "outbound_details" ADD CONSTRAINT "outbound_details_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "outbounds" ADD CONSTRAINT "outbounds_customer_id_contacts_contact_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."contacts"("contact_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "outbounds" ADD CONSTRAINT "outbounds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "outbounds" ADD CONSTRAINT "outbounds_warehouse_id_warehouses_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("warehouse_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "outbounds" ADD CONSTRAINT "outbounds_location_id_locations_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("location_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_opname_profiles" ADD CONSTRAINT "stock_opname_profiles_warehouse_id_warehouses_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("warehouse_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_opname_profiles" ADD CONSTRAINT "stock_opname_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_opname_details" ADD CONSTRAINT "stock_opname_details_stock_opname_id_stock_opnames_stock_opname_id_fk" FOREIGN KEY ("stock_opname_id") REFERENCES "public"."stock_opnames"("stock_opname_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_opname_details" ADD CONSTRAINT "stock_opname_details_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_opnames" ADD CONSTRAINT "stock_opnames_stock_opname_profile_id_stock_opname_profiles_stock_opname_profile_id_fk" FOREIGN KEY ("stock_opname_profile_id") REFERENCES "public"."stock_opname_profiles"("stock_opname_profile_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_opnames" ADD CONSTRAINT "stock_opnames_location_id_locations_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("location_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_opnames" ADD CONSTRAINT "stock_opnames_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transfer_details" ADD CONSTRAINT "transfer_details_transfer_id_transfers_transfer_id_fk" FOREIGN KEY ("transfer_id") REFERENCES "public"."transfers"("transfer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transfer_details" ADD CONSTRAINT "transfer_details_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transfers" ADD CONSTRAINT "transfers_origin_id_warehouses_warehouse_id_fk" FOREIGN KEY ("origin_id") REFERENCES "public"."warehouses"("warehouse_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transfers" ADD CONSTRAINT "transfers_destination_id_warehouses_warehouse_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."warehouses"("warehouse_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transfers" ADD CONSTRAINT "transfers_origin_user_id_users_id_fk" FOREIGN KEY ("origin_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transfers" ADD CONSTRAINT "transfers_destination_user_id_users_id_fk" FOREIGN KEY ("destination_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relocations" ADD CONSTRAINT "relocations_origin_id_locations_location_id_fk" FOREIGN KEY ("origin_id") REFERENCES "public"."locations"("location_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relocations" ADD CONSTRAINT "relocations_destination_id_locations_location_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."locations"("location_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relocations" ADD CONSTRAINT "relocations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relocation_details" ADD CONSTRAINT "relocation_details_relocation_id_relocations_relocation_id_fk" FOREIGN KEY ("relocation_id") REFERENCES "public"."relocations"("relocation_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relocation_details" ADD CONSTRAINT "relocation_details_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("role_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("company_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_logs" ADD CONSTRAINT "user_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_warehouses" ADD CONSTRAINT "user_warehouses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_warehouses" ADD CONSTRAINT "user_warehouses_warehouse_id_warehouses_warehouse_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("warehouse_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

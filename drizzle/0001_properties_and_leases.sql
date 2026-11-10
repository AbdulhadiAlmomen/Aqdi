CREATE TABLE "buildings" (
	"id" text PRIMARY KEY NOT NULL,
	"office_id" text NOT NULL,
	"city" text,
	"district" text,
	"street" text,
	"building_number" text,
	"postal_code" text,
	"additional_number" text,
	"deed_number" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" text PRIMARY KEY NOT NULL,
	"office_id" text NOT NULL,
	"unit_id" text NOT NULL,
	"tenant_id" text NOT NULL,
	"contract_number" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"annual_rent" numeric(12, 2) NOT NULL,
	"payment_cycle" text NOT NULL,
	"source" text DEFAULT 'ejar_import' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "installments" (
	"id" text PRIMARY KEY NOT NULL,
	"office_id" text NOT NULL,
	"contract_id" text NOT NULL,
	"sequence" integer NOT NULL,
	"due_date" date NOT NULL,
	"amount" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" text PRIMARY KEY NOT NULL,
	"office_id" text NOT NULL,
	"name" text NOT NULL,
	"nationality" text,
	"id_type" text NOT NULL,
	"id_last4" text NOT NULL,
	"mobile" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" text PRIMARY KEY NOT NULL,
	"office_id" text NOT NULL,
	"building_id" text NOT NULL,
	"unit_number" text NOT NULL,
	"unit_type" text,
	"floor" text,
	"area_sqm" numeric(10, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "offices" ADD COLUMN "paid" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_office_id_offices_id_fk" FOREIGN KEY ("office_id") REFERENCES "public"."offices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_office_id_offices_id_fk" FOREIGN KEY ("office_id") REFERENCES "public"."offices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "installments" ADD CONSTRAINT "installments_office_id_offices_id_fk" FOREIGN KEY ("office_id") REFERENCES "public"."offices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "installments" ADD CONSTRAINT "installments_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_office_id_offices_id_fk" FOREIGN KEY ("office_id") REFERENCES "public"."offices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_office_id_offices_id_fk" FOREIGN KEY ("office_id") REFERENCES "public"."offices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_building_id_buildings_id_fk" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "buildings_office_idx" ON "buildings" USING btree ("office_id");--> statement-breakpoint
CREATE UNIQUE INDEX "contracts_office_number_idx" ON "contracts" USING btree ("office_id","contract_number");--> statement-breakpoint
CREATE INDEX "contracts_unit_idx" ON "contracts" USING btree ("unit_id");--> statement-breakpoint
CREATE INDEX "installments_contract_idx" ON "installments" USING btree ("contract_id");--> statement-breakpoint
CREATE INDEX "tenants_office_idx" ON "tenants" USING btree ("office_id");--> statement-breakpoint
CREATE UNIQUE INDEX "units_building_number_idx" ON "units" USING btree ("building_id","unit_number");--> statement-breakpoint
CREATE INDEX "units_office_idx" ON "units" USING btree ("office_id");
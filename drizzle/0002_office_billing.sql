ALTER TABLE "offices" ADD COLUMN "paid_units" integer;--> statement-breakpoint
ALTER TABLE "offices" ADD COLUMN "paid_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "offices" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "offices" ADD COLUMN "stripe_subscription_id" text;
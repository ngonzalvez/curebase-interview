CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor" text NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"request_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"birth_date" date,
	"height_cm" numeric,
	"weight_kg" numeric,
	"bmi" numeric GENERATED ALWAYS AS (weight_kg / ((nullif(height_cm, 0) / 100) ^ 2)) STORED,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "participants_email_unique" UNIQUE("email"),
	CONSTRAINT "participants_email_lowercase" CHECK ("participants"."email" = lower("participants"."email")),
	CONSTRAINT "participants_height_cm_positive" CHECK ("participants"."height_cm" > 0),
	CONSTRAINT "participants_weight_kg_positive" CHECK ("participants"."weight_kg" > 0)
);
--> statement-breakpoint
CREATE INDEX "audit_events_entity_type_entity_id_index" ON "audit_events" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "participants_bmi_index" ON "participants" USING btree ("bmi");
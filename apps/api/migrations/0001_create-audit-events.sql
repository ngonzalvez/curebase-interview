-- -------------------------------------------------------------------------------------------------
--                                        AUDIT EVENTS TABLE
-- -------------------------------------------------------------------------------------------------

CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor" text NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"changes" jsonb,
	"reason" text,
	"request_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- -------------------------------------------------------------------------------------------------
--                                             INDEXES
-- -------------------------------------------------------------------------------------------------

CREATE INDEX "audit_events_entity_type_entity_id_index" ON "audit_events" USING btree ("entity_type","entity_id");
--> statement-breakpoint

-- -------------------------------------------------------------------------------------------------
--                                       APPEND-ONLY TRIGGER
-- -------------------------------------------------------------------------------------------------

-- Drizzle can't describe triggers, so this part is written by hand.
--
-- Once something is in the audit trail, it should never change. This trigger makes
-- Postgres refuse any UPDATE or DELETE on the table, no matter who tries.
--
-- You might wonder why we don't just revoke those permissions. We should, and in
-- production the API should connect as a role that can only read and insert here,
-- which also stops TRUNCATE. But the table's owner and superusers skip permission
-- checks entirely, and right now the API connects as the owner, so a REVOKE on its
-- own wouldn't stop anything. The trigger works for everyone, so it stays as a safety net.
CREATE FUNCTION reject_audit_event_changes() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_events is append-only';
END;
$$;
--> statement-breakpoint

CREATE TRIGGER audit_events_append_only
  BEFORE UPDATE OR DELETE ON "audit_events"
  FOR EACH ROW EXECUTE FUNCTION reject_audit_event_changes();

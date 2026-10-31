-- -------------------------------------------------------------------------------------------------
--                                           AUDIT TRAIL
-- -------------------------------------------------------------------------------------------------

-- The audit trail is out of scope for now. Dropping the table also removes its
-- append-only trigger; the function behind it was written by hand, so it goes by hand.
DROP TABLE "audit_events" CASCADE;
--> statement-breakpoint

DROP FUNCTION reject_audit_event_changes();

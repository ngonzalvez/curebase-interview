-- -------------------------------------------------------------------------------------------------
--                                     REQUIRED PROFILE FIELDS
-- -------------------------------------------------------------------------------------------------

-- Participants now register with their whole profile in one form, so every field becomes
-- required and phone is added. This only works on a table without incomplete rows, which
-- is fine here because nothing has been deployed yet. With real data, the missing values
-- would have to be filled in first, or the columns added as nullable and tightened later.
ALTER TABLE "participants" ALTER COLUMN "first_name" SET NOT NULL;
--> statement-breakpoint

ALTER TABLE "participants" ALTER COLUMN "last_name" SET NOT NULL;
--> statement-breakpoint

ALTER TABLE "participants" ALTER COLUMN "birth_date" SET NOT NULL;
--> statement-breakpoint

ALTER TABLE "participants" ALTER COLUMN "height_cm" SET NOT NULL;
--> statement-breakpoint

ALTER TABLE "participants" ALTER COLUMN "weight_kg" SET NOT NULL;
--> statement-breakpoint

ALTER TABLE "participants" ADD COLUMN "phone" text NOT NULL;

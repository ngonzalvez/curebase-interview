-- -------------------------------------------------------------------------------------------------
--                                             INDEXES
-- -------------------------------------------------------------------------------------------------

-- New participants are listed first by default, so the list is sorted by this column.
CREATE INDEX "participants_created_at_index" ON "participants" USING btree ("created_at");

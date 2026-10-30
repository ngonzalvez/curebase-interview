import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// One row per change, written in the same transaction as the change itself.
// Stores identifiers only, never health data.
export const auditEvents = pgTable(
  'audit_events',
  {
    id: uuid().primaryKey().defaultRandom(),
    actor: text().notNull(),
    action: text().notNull(),
    entityType: text().notNull(),
    entityId: uuid().notNull(),
    requestId: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index().on(table.entityType, table.entityId)],
)

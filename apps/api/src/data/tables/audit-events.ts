import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export type AuditChanges = Record<string, { from: unknown; to: unknown }>

// The audit trail: one row per change, written in the same transaction as the change
// itself. Each row keeps the old and new value of every field it touched, so it holds
// participant data and needs the same protection as the participants table. Rows can
// only be added: a trigger in the migrations rejects any update or delete, and in
// production the API's database role should only be allowed to select and insert.
export const auditEvents = pgTable(
  'audit_events',
  {
    id: uuid().primaryKey().defaultRandom(),
    actor: text().notNull(),
    action: text().notNull(),
    entityType: text().notNull(),
    entityId: uuid().notNull(),
    changes: jsonb().$type<AuditChanges>(),
    reason: text(),
    requestId: text(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index().on(table.entityType, table.entityId)],
)

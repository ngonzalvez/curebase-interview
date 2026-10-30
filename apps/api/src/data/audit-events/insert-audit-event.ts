import type { DbOrTx } from '../../plugins/database.ts'
import { auditEvents } from '../tables/audit-events.ts'

/**
 * Records who did what to which record. Pass the same transaction as the change
 * itself, so the change and its audit event are saved together or not at all.
 */
export async function insertAuditEvent(db: DbOrTx, event: typeof auditEvents.$inferInsert) {
  await db.insert(auditEvents).values(event)
}

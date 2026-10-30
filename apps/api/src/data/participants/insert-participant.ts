import type { DbOrTx } from '../../plugins/database.ts'
import { participants } from '../tables/participants.ts'

/**
 * Inserts a participant and returns the saved row, including the id and BMI that
 * Postgres fills in.
 */
export async function insertParticipant(db: DbOrTx, values: typeof participants.$inferInsert) {
  const [participant] = await db.insert(participants).values(values).returning()
  return participant!
}

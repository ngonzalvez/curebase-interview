import { sql } from 'drizzle-orm'
import { check, date, index, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * This table stores participants.
 *
 * A participant registers with their whole profile at once, so every field is required.
 * They're identified by their email, kept in lowercase so the same person can't register
 * twice. BMI is never written by the API: Postgres calculates it from height and weight
 * whenever either changes, and indexes it so the list can be filtered and sorted by it.
 *
 * BMI isn't marked NOT NULL even though it's always there. If it were, a height of 0
 * would be reported as a missing BMI instead of failing the height check, which is the
 * error that actually explains the problem.
 */
export const participants = pgTable(
  'participants',
  {
    id: uuid().primaryKey().defaultRandom(),
    email: text().notNull().unique(),
    firstName: text().notNull(),
    lastName: text().notNull(),
    phone: text().notNull(),
    birthDate: date({ mode: 'string' }).notNull(),
    heightCm: numeric({ mode: 'number' }).notNull(),
    weightKg: numeric({ mode: 'number' }).notNull(),
    bmi: numeric({ mode: 'number' }).generatedAlwaysAs(
      sql`weight_kg / ((nullif(height_cm, 0) / 100) ^ 2)`,
    ),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index().on(table.bmi),
    index().on(table.createdAt),
    check('participants_email_lowercase', sql`${table.email} = lower(${table.email})`),
    check('participants_height_cm_positive', sql`${table.heightCm} > 0`),
    check('participants_weight_kg_positive', sql`${table.weightKg} > 0`),
  ],
)

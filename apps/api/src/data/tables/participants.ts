import { sql } from 'drizzle-orm'
import { check, date, index, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const participants = pgTable(
  'participants',
  {
    id: uuid().primaryKey().defaultRandom(),
    email: text().notNull().unique(),
    firstName: text(),
    lastName: text(),
    birthDate: date({ mode: 'string' }),
    heightCm: numeric({ mode: 'number' }),
    weightKg: numeric({ mode: 'number' }),
    bmi: numeric({ mode: 'number' }).generatedAlwaysAs(
      sql`weight_kg / ((nullif(height_cm, 0) / 100) ^ 2)`,
    ),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index().on(table.bmi),
    check('participants_email_lowercase', sql`${table.email} = lower(${table.email})`),
    check('participants_height_cm_positive', sql`${table.heightCm} > 0`),
    check('participants_weight_kg_positive', sql`${table.weightKg} > 0`),
  ],
)

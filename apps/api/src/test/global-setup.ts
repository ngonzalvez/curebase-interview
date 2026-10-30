import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import pg from 'pg'

/**
 * Runs once before all tests. Creates the test database if needed and applies migrations.
 */
export async function setup() {
  const testUrl = new URL(process.env.DATABASE_URL ?? '')
  const testDbName = testUrl.pathname.slice(1)

  // Postgres won't let you create a database while you're connected to it, so we
  // connect to the built-in postgres database first and create the test one from there.
  const adminUrl = new URL(testUrl)
  adminUrl.pathname = '/postgres'
  const admin = new pg.Client({ connectionString: adminUrl.toString() })
  await admin.connect()

  const { rowCount } = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [
    testDbName,
  ])
  if (!rowCount) await admin.query(`CREATE DATABASE "${testDbName}"`)
  await admin.end()

  const pool = new pg.Pool({ connectionString: testUrl.toString() })
  await migrate(drizzle({ client: pool }), { migrationsFolder: './migrations' })
  await pool.end()
}

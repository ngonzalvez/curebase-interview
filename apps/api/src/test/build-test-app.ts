import { sql } from 'drizzle-orm'
import { buildApp, type App } from '../app.ts'
import type { Config } from '../config.ts'

const testConfig: Config = {
  host: '127.0.0.1',
  port: 0,
  logLevel: 'silent',
  webOrigin: 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL ?? '',
}

/**
 * Builds the app the way every test needs it: pointed at the test database, booted,
 * and with every table emptied, so each test starts from scratch. Tests that need
 * routes of their own can add them through `addRoutes`, since Fastify only accepts
 * new routes before the app has booted.
 */
export async function buildTestApp(addRoutes?: (app: App) => void) {
  const app = buildApp(testConfig)
  addRoutes?.(app)
  await app.ready()
  await app.db.execute(sql`TRUNCATE participants, audit_events`)
  return app
}

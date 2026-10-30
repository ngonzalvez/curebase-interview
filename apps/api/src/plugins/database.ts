import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import fp from 'fastify-plugin'
import pg from 'pg'

export type Db = NodePgDatabase

// A database or an open transaction. Data functions accept either, so callers
// decide whether several writes share a transaction.
export type DbOrTx = Db | Parameters<Parameters<Db['transaction']>[0]>[0]

declare module 'fastify' {
  interface FastifyInstance {
    db: Db
  }
}

/**
 * Opens a pool of connections to Postgres and makes it available to every endpoint
 * as app.db. The pool is closed when the app closes, so nothing is left hanging on
 * shutdown or between tests. fastify-plugin lets app.db be seen outside this plugin.
 */
export const databasePlugin = fp<{ url: string }>(
  async (app, { url }) => {
    const pool = new pg.Pool({ connectionString: url })
    app.decorate('db', drizzle({ client: pool, casing: 'snake_case' }))
    app.addHook('onClose', () => pool.end())
  },
  { name: 'database' },
)

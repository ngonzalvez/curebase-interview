import pg from 'pg'

/**
 * Tells whether a query failed because it broke a specific unique constraint.
 * Drizzle wraps the driver's error, so the Postgres details live in `cause`.
 */
export function isUniqueViolation(error: unknown, constraint: string) {
  const cause = error instanceof Error ? error.cause : undefined
  return cause instanceof pg.DatabaseError && cause.code === '23505' && cause.constraint === constraint
}

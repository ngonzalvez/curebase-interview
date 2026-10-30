import { defineConfig } from 'vitest/config'

// Tests read the root .env.test instead of .env, so they always run against
// their own database and never touch development data.
try {
  process.loadEnvFile('../../.env.test')
} catch {
  // No .env.test file, e.g. in CI: DATABASE_URL comes from the environment.
}

// Every test empties the tables, so a URL copied from .env by mistake would wipe
// development data. Refusing anything not named *_test makes that impossible.
const testDbName = new URL(process.env.DATABASE_URL ?? 'postgres://unset').pathname.slice(1)
if (!testDbName.endsWith('_test')) {
  throw new Error(`Tests only run against a database ending in _test, got "${testDbName}".`)
}

export default defineConfig({
  test: {
    globalSetup: './src/test/global-setup.ts',
    // Test files share one database, so they run one at a time.
    fileParallelism: false,
  },
})

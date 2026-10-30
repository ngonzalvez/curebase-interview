import { defineConfig } from 'drizzle-kit'

try {
  process.loadEnvFile('../../.env')
} catch {
  // No .env file, e.g. in CI: DATABASE_URL comes from the environment.
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/data/tables/!(*.test).ts',
  out: './migrations',
  casing: 'snake_case',
  dbCredentials: { url: process.env.DATABASE_URL! },
})

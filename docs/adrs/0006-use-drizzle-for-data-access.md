# 0006. Use Drizzle for data access

- Status: Accepted
- Date: 2026-10-30
- Related: [0005](0005-api-architecture.md)

## Context

We need to decide which library `apps/api` uses to define the database schema, run queries and manage migrations.

## Decision

We will use Drizzle ORM with drizzle-kit for migrations.

We chose it because:

- It supports generated columns in the schema, so derived values like BMI stay in sync with their inputs, with no hand-edited migrations.
- The schema is TypeScript and types are inferred from it, with no codegen step.
- Queries read like SQL, so they are easy to review.
- Transactions are passed as an argument, which fits our data functions.
- Migrations are generated as plain SQL files that we commit and review.

## Consequences

- The schema lives in `apps/api` as TypeScript.
- Smaller community and less polished tooling than Prisma.

## Alternatives considered

- **Prisma.** The most popular and polished, but it cannot express generated columns, so they need hand-edited migrations that later migrations may undo.
- **Kysely.** Excellent SQL types, but migrations are written by hand and types are generated from the database.
- **Sequelize.** Mature, but weak TypeScript support, and its Active Record style clashes with our data functions.

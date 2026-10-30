# 0008. Store participants with a generated BMI

- Status: Accepted
- Date: 2026-10-30
- Related: [0006](0006-use-drizzle-for-data-access.md)

## Context

We need to decide how participants are identified and how their height, weight and BMI are stored. Participants are listed, sorted and filtered by BMI.

## Options considered

- **BMI computed in the API and saved with the row.** Easy to test in TypeScript, but any write that skips that code leaves BMI stale.
- **BMI computed on every read.** Never stale, but cannot be indexed, so sorting and filtering by BMI scan the whole table.
- **BMI set by a database trigger.** Always in sync and indexable, but more code, and easy to get wrong across inserts and updates.
- **BMI as a stored generated column.** PostgreSQL computes it on every insert and update, saves it and can index it. The formula lives in the database schema.

## Decision

We will store participants in one table, identified by email, with height and weight in metric units and BMI as a stored generated column.

- Emails are unique and stored in lowercase, so the same address cannot be registered twice with different casing.
- Height is stored in centimeters and weight in kilograms. The UI may convert units for display and input.
- Height and weight are optional, so a participant can be created with only an email. Until both are set, BMI is empty.
- Height and weight must be positive and have no upper bound.
- BMI is indexed. The API never writes it.

We chose it because:

- BMI is always in sync with height and weight, whichever code writes them.
- It is indexed, so lists can be sorted and filtered by BMI efficiently.
- The formula is defined once.

## Consequences

- The BMI formula lives in the database schema, not in TypeScript.
- Changing the formula requires a migration, which recomputes every row, although this is very unlikely to happen.

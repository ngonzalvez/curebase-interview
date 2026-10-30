# 0007. Store questionnaires as JSON documents

- Status: Accepted
- Date: 2026-10-30
- Related: [0004](0004-use-zod-for-validation.md), [0006](0006-use-drizzle-for-data-access.md)

## Context

We need to decide how questionnaires and their responses are stored in the database.

## Options considered

- **Two tables: questionnaires and questionnaire items.** The database enforces each item's fields, and answers can reference items by foreign key. Editing or versioning writes many rows, and the API reassembles the form from rows to render or validate it.
- **One table, with the definition as JSONB.** A questionnaire is read and written as one row, in the same shape the UI renders and the validator uses. The database does not check the JSON's contents, and answers cannot reference questions by foreign key.

## Decision

We will store each questionnaire as one row with its definition in a `jsonb` column, and each response as one row with its answers in a `jsonb` column:

```
questionnaires            id, slug (unique), title, definition jsonb, created_at
questionnaire_responses   id, questionnaire_id, participant_id, answers jsonb, created_at
                          unique (questionnaire_id, participant_id)
```

- Each question in the definition has a `key` that is unique within the questionnaire and never changes once responses exist.
- Answers are keyed by question key: `{ "cough_severity": 2 }`.
- The API validates definitions with Zod before saving them, and validates answers against the definition before saving a response.

We chose it because:

- It is simpler: one row per questionnaire and one per response.
- Versioning can be added later by storing each version as a new row.
- Auditing a change means recording one document, not a set of rows.

## Consequences

- The database does not enforce the structure of definitions or answers. The API does, through Zod.
- Queries on individual answers use JSON operators, and need an expression index if they become frequent.
- Renaming a question key after responses exist would break those responses, so keys are immutable.

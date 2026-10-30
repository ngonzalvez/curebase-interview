# 0005. API architecture

- Status: Accepted
- Date: 2026-10-30
- Related: [0002](0002-run-the-api-as-a-separate-service.md), [0003](0003-use-fastify-for-the-api.md)

## Context

We need to decide how code inside `apps/api` is organized and where authentication, authorization and auditing will live.

## Decision

We will organize `apps/api/src/` in two layers, with a folder per resource and one function per file:

```
app.ts                                  registers plugins and routes
config.ts                               the only module that reads process.env
plugins/                                CORS, security headers, rate limiting, error handler
routes/participants/
  create-participant-endpoint.ts        POST /participants
  create-participant-endpoint.test.ts
  index.ts                              registers the resource's routes
data/participants/
  insert-participant.ts
```

- **Endpoints** run the use case: validate with `packages/contracts`, apply rules from `packages/domain`, run the transaction, call data functions and write audit events.
- **Data functions** read and write rows, with no business rules. They use database verbs: `insert`, `find`, `update`, `delete`.
- Endpoints import data functions, never the reverse.
- Audit events are written in the same transaction as the change.
- Endpoints throw typed errors. One error handler maps them to HTTP statuses and hides internal details on 500s.
- Authentication and authorization are not implemented yet. When they are, a plugin will set `request.actor` and endpoints will check permissions. Until then, audit events use a placeholder actor.

We chose it because:

- One function per file keeps code easy to find, test and change.
- HTTP is the only entry point, so a service layer would only forward calls.
- A shared transaction means a change is never saved without its audit event.

## Consequences

- Many small files.
- If a second entry point appears, use cases move from endpoints into services.

## Alternatives considered

- **A service layer.** Lets non-HTTP callers reuse use cases, but we have none.
- **Organize by feature** (`modules/participants/{routes,data}`). More structure than a few resources need.
- **One file per resource** (`data/participants.ts`). Files grow large and mix unrelated functions.

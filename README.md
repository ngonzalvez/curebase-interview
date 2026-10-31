# Clinical trial participants

A small full-stack app for site staff to register clinical trial participants and browse them.
The registration form collects each participant's details, height and weight. The database
calculates the BMI, and a table lists everyone, filtered by a BMI range, sorted and paginated.

Stack: TypeScript, React with Next.js, Node.js with Fastify, PostgreSQL with Drizzle, Zod for
validation.

## Running it

You need Node.js 22 or newer and Docker.

```sh
cp .env.example .env              # then fill in the Postgres user, password and database
cp .env.test.example .env.test    # same credentials, database name ending in _test
docker compose up -d              # Postgres on port 5433
npm install
npm run db:migrate -w @curebase/api

npm run dev:api                   # API on http://localhost:3001
npm run dev                       # web app on http://localhost:3000, in a second terminal
```

Checks: `npm test`, `npm run typecheck`, `npm run lint` and `npm run build`. The API tests run
against a real Postgres database, the one named in `.env.test`, which they create and migrate
themselves.

## How it's organized

```
apps/
  api/          Fastify API. The only part that talks to the database.
  web/          Next.js app. Talks to the API over HTTP, never to the database.
packages/
  domain/       Business rules, as Zod schemas: what makes a participant valid.
  contracts/    The API's requests and responses, shared by the API and the web app.
docs/adrs/      Architecture decision records: what we chose, and why.
```

The API and the web app are separate services, so no server code can ever end up in a browser
bundle ([ADR 0002](docs/adrs/0002-run-the-api-as-a-separate-service.md)). Inside the API, each
endpoint is one file holding its schemas and its handler. Endpoints call small data functions,
one per file, that only read and write rows
([ADR 0005](docs/adrs/0005-api-architecture.md)).

**Validation** happens in layers, each with its own job:

- The **web form** checks input with the domain schema, so mistakes show up before anything is
  sent. This is only for the user's convenience.
- The **API** validates every request with the same schemas and rejects unknown fields. This is
  the check that counts.
- The **database** enforces the invariants that must hold no matter who writes: required fields,
  unique lowercase emails, and positive height and weight.

**BMI** is a stored, generated column, so Postgres calculates it from height and weight and it
can never be out of date. It's indexed for filtering and sorting
([ADR 0008](docs/adrs/0008-store-participants-with-a-generated-bmi.md)). Heights and weights are
stored in centimeters and kilograms. The form also accepts inches and pounds, and converts them
before sending.

**Errors** come back from the API in one shape (RFC 9457 Problem Details), with a message that's
safe to show and the fields that failed, so the form can show each error next to its input.
Unexpected errors are logged in full on the server and return a bare 500.

## Known gaps

Things a real deployment would still need, left out on purpose:

- **Authentication and authorization.** Anyone who can reach the app can register and read
  participants.
- **An audit trail.** Healthcare data usually needs a record of who created, changed or viewed
  each record, and when. It would be an append-only table written in the same transaction as
  each change, with the actor coming from authentication, so it belongs with that work.
- **A least-privilege database role.** The API connects as the table owner. In production it
  should use a role with only the permissions it needs.
- **Regulatory review.** If this data counts as clinical trial records, FDA 21 CFR Part 11 and
  ICH GCP apply, which require that audit trail, with old and new values and a reason for each
  change. That's a call for compliance, not engineering.
- **Edit and delete** aren't implemented. Phone numbers are checked loosely, not against an
  international format.

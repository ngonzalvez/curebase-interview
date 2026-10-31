# Clinical trial participants

A small full-stack app for site staff to register clinical trial participants and browse them.
Staff enter each participant's details, height and weight; the database calculates the BMI; and a
table lists everyone, filtered by a BMI range, sorted and paginated.

Stack: TypeScript, React with Next.js, Node.js with Fastify, PostgreSQL with Drizzle, and Zod for
validation.

## Running it

You need Node.js 22 or newer and Docker.

```sh
cp .env.example .env              # then fill in the Postgres user, password and database
cp .env.test.example .env.test    # same credentials, with a database name ending in _test
docker compose up -d              # Postgres on port 5433
npm install
npm run db:migrate -w @curebase/api

npm run dev:api                   # API on http://localhost:3001
npm run dev                       # web app on http://localhost:3000, in a second terminal
```

Open http://localhost:3000, which takes you to the participants.

## Using it

- **`/participants`** lists everyone, newest first. Filter by a minimum and maximum BMI, sort by
  BMI or registration date by clicking the column heading, and page through the results. The
  filters, sort and page live in the URL, so a view survives a reload and can be shared.
- **`/participants/new`** is the registration form. After each registration the form clears and
  a confirmation pops up, ready for the next participant.
- **Units**: heights and weights can be typed and read in centimeters and kilograms, or inches and
  pounds. The list remembers each person's choice in a cookie. Everything is stored in metric.

## How it's organized

```
apps/
  api/          Fastify API. The only part that talks to the database.
  web/          Next.js app. Talks to the API over HTTP, never to the database.
packages/
  domain/       Business rules, as Zod schemas: what makes a participant valid.
  contracts/    The API's requests and responses, shared by the API and the web app.
docs/adrs/      Architecture decision records: what was chosen, what wasn't, and why.
```

The API and the web app are separate services, so no server code can ever end up in a browser
bundle ([ADR 0002](docs/adrs/0002-run-the-api-as-a-separate-service.md)). Inside the API, each
endpoint is one file holding its schemas and its handler, and it calls small data functions, one
per file, that only read and write rows ([ADR 0005](docs/adrs/0005-api-architecture.md)).

In the web app, the participants list renders on the server for every request, so its data is
always current and it ships almost no JavaScript. Only the registration form, the filter inputs
and the unit switch run in the browser.

**BMI** is a stored, generated column, so Postgres calculates it from height and weight and it can
never be out of date. It's indexed for filtering and sorting
([ADR 0008](docs/adrs/0008-store-participants-with-a-generated-bmi.md)).

## Validation

Every rule is written once, in the shared Zod schemas, and checked in three places, each with its
own job:

- The **browser** checks the form with the same schema before sending, so mistakes show up right
  away, next to the field. This is only for the user's convenience.
- The **API** validates every request with that schema, rejects unknown fields, and is the check
  that counts.
- The **database** enforces what must hold no matter who writes: required fields, unique lowercase
  emails, and positive height and weight.

Error messages are written for people ("First name is required"), and the API returns them in one
shape (RFC 9457 Problem Details), so the form can show each one next to its input.

## Handling user input safely

- **Validated at the boundary.** Every request body and query string goes through a strict schema
  before any code uses it; unknown fields are rejected, strings have length limits, and numbers
  must be in range.
- **No SQL injection.** Queries are built with Drizzle, which always sends values as parameters,
  never as part of the SQL text.
- **No script injection.** React escapes everything it renders, and the app never inserts raw
  HTML.
- **Safe errors.** Clients only ever see messages written to be shown. Anything unexpected is
  logged in full on the server and returned as a bare 500, with no stack traces or SQL.
- **Limited exposure.** The API sends secure headers (Helmet), accepts browser requests only from
  the web app's origin (CORS), limits how many requests each client can make, and drops any field
  that isn't part of a response's schema. Logs mask emails, and personal data never goes in URLs.
- **Race-safe writes.** Duplicate emails are caught by a unique constraint rather than a lookup,
  so two simultaneous registrations can't both get through.

## Checks

```sh
npm test            # API tests against a real Postgres database, plus web unit tests
npm run typecheck
npm run lint
npm run format:check
npm run build
```

The API tests use the database named in `.env.test`, which they create and migrate themselves,
and refuse to run against any database whose name doesn't end in `_test`.

## Known gaps

Things a real deployment would still need, left out on purpose:

- **Authentication and authorization.** Anyone who can reach the app can register and read
  participants.
- **An audit trail.** Healthcare data usually needs a record of who created, changed or viewed
  each record, and when. It would be an append-only table written in the same transaction as each
  change, with the actor coming from authentication, so it belongs with that work.
- **A least-privilege database role.** The API connects as the table owner. In production it
  should use a role with only the permissions it needs.
- **Regulatory review.** If this data counts as clinical trial records, FDA 21 CFR Part 11 and ICH
  GCP apply, which require that audit trail, with old and new values and a reason for each change.
  That's a call for compliance, not engineering.
- **Edit and delete** aren't implemented. Phone numbers are checked loosely, not against an
  international format.

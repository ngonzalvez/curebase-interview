# 0002. Run the API as a separate service

- Status: Accepted
- Date: 2026-10-30
- Related: [0001](0001-use-an-npm-workspaces-monorepo.md)

## Context

Staff use a web UI to collect health data from clinical trial participants, and a server stores that data in a database. The UI and the server can be deployed together as one app, or apart as a UI app and an API service.

We need to decide whether to deploy them as one app or two.

## Decision

We will run the UI and the API as separate apps:

```
apps/web             UI. No database access.
apps/api             HTTP API. The only app that accesses the database.
packages/domain      business rules shared by both apps
packages/contracts   API request and response schemas shared by both apps
```

The browser calls the API directly, with CORS restricted to the web app's origin. The web app's server also calls the API to render pages.

We chose this because the data is sensitive, and security by design calls for making leaks impossible rather than relying on discipline. With the API in its own app, a wrong import cannot put sensitive server code into a UI bundle, and UI code can never reach the database or its credentials. It also lets the API scale on its own and serve future clients, such as a participant app.

## Consequences

- Database credentials and data access exist only in `apps/api`.
- The UI cannot bundle API code, because `apps/web` does not depend on `apps/api`.
- The API can scale and deploy independently of the UI.
- The API is reachable from the internet, so it handles authentication, CORS and rate limiting itself.
- Two apps to build, deploy and monitor.

## Alternatives considered

- **One Next.js app serving UI and API.** Simpler to run, but database access and secrets share a process and a codebase with the UI.
- **Web proxies to an API on a private network.** Keeps the API off the internet, but adds a proxy hop and setup.

# 0001. Use an npm workspaces monorepo

- Status: Accepted
- Date: 2026-10-30
- Related: none

## Context

For now we need one app: a web app where staff submit intake forms for clinical trial participants. It has a UI and a server.

Later we may need a participant-facing app, and we may need to run the backend as a separate service that scales independently of the UI. Those apps would share code with the first one, such as validation schemas and types.

We need to decide how the repository is organized to hold one app now and possibly more later.

## Decision

We will keep all apps and shared code in one repository, managed with npm workspaces.

```
apps/        deployable apps, one folder each   (@curebase/web, ...)
packages/    code shared by two or more apps    (@curebase/<name>)
```

- Workspace packages are named `@curebase/<name>` and are private.
- There is one lockfile, at the root. Dependencies are installed from the root.
- Root scripts delegate to the workspaces (`npm run build --workspaces --if-present`).
- Code moves into `packages/` only when a second workspace consumes it. Until then it lives inside the app that uses it.
- How packages are built and consumed (TypeScript source or compiled output) is decided when the first package is created.

## Consequences

- A change to a shared schema, the API and its clients lands in one commit and one review.
- A new app or a backend split moves existing folders into a workspace instead of creating a new repo.
- Every app shares one dependency tree, so upgrading a shared dependency touches all apps at once.
- CI builds and tests the whole repo until we add per-workspace change detection.
- Git grants read access per repository, not per folder, so developers can read code from apps they do not work on. This goes beyond least privilege for reading code. The risk is very low as long as:
  - security does not depend on keeping code secret, and the code holds no secrets or PHI;
  - `main` is protected, with required reviews and CODEOWNERS on sensitive paths;
  - deploys and production access are restricted separately from code access.
- If some code must not be readable by every developer (for example vendor code under NDA, or contractors limited to one app), that part moves to its own repository and is consumed as a private package.

## Alternatives considered

- **A single Next.js app with no workspaces.** The simplest option today, but the expected second app and backend split would require restructuring the repo later, at a point when more code depends on its layout.
- **One repository per app, shared code published as private npm packages.** Independent deploys and access control, but every shared change needs publishing, versioning and coordination across repos, and client and server schemas can drift apart. With health data, that drift is a correctness and safety risk.
- **pnpm workspaces.** Stricter dependency isolation and faster installs. Not worth adding another tool while npm workspaces covers our needs.
- **Turborepo or Nx on top of workspaces.** Task caching and affected-only builds. Not needed with one app; we can add one when build times justify it.

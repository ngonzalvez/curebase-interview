# 0003. Use Fastify for the API

- Status: Accepted
- Date: 2026-10-30
- Related: [0002](0002-run-the-api-as-a-separate-service.md)

## Context

We need to decide which HTTP framework to use for `apps/api`.

## Options considered

- **Fastify.** Mature, with Zod schema support, a built-in logger that redacts listed fields, and response filtering. Its plugin and hook model takes some learning.
- **Hono.** Light and has a typed client, but no response filtering and minimal logging. It runs anywhere, which we don't need.
- **NestJS.** Strong structure, but built on classes, decorators and dependency injection, which add abstraction and are harder to audit.
- **Express 5.** The most familiar, but validation, response filtering and log redaction are all add-ons we would have to remember.

## Decision

We will use Fastify.

We chose it because:

- It is mature and governed by the OpenJS Foundation.
- It supports Zod schemas for request validation and response serialization.
- Its built-in logger (pino) redacts sensitive fields we list.
- Responses include only the fields declared in the route's schema, so an extra database column cannot reach a client by accident.
- It generates an OpenAPI spec from the same schemas.
- It has official plugins for security headers, CORS and rate limiting.

## Consequences

- Every route declares request and response schemas.
- Log redaction paths must be kept up to date as fields are added.
- Developers need to learn Fastify's plugin and hook model.
- The API runs on Node.js only.

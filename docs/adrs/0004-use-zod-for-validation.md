# 0004. Use Zod for validation

- Status: Accepted
- Date: 2026-10-30
- Related: [0002](0002-run-the-api-as-a-separate-service.md), [0003](0003-use-fastify-for-the-api.md)

## Context

We need to decide which library to use to define and validate data schemas in the API, the web app and the shared packages.

## Decision

We will use Zod 4.

We chose it because:

- Fastify supports it.
- It is mature.
- The team already knows it.
- It infers TypeScript types from schemas, so validation and types cannot drift apart.

## Consequences

- Every schema in the codebase is a Zod schema.
- Zod is part of the web app's bundle.
- OpenAPI is generated from Zod schemas, not written as JSON Schema by hand.

## Alternatives considered

- **Valibot.** Smaller bundle, but less ecosystem and Fastify support.
- **TypeBox.** Native JSON Schema and native Fastify support, but more verbose and less common in frontend code.
- **ArkType.** Fast and concise, but young.
- **Yup.** Weaker TypeScript type inference.
- **class-validator.** Built on classes and decorators, which don't fit our plain functions.

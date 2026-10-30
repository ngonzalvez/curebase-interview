## Application context

This is a medical application operating in a highly regulated environment. Treat patient safety, privacy, security, correctness, and auditability as core requirements in every design and implementation decision.

- Consider HIPAA and other applicable healthcare, privacy, and security regulations when handling data or changing workflows. Applicability depends on the deployment, jurisdiction, data, and organizational role; do not assume that a technical implementation alone establishes compliance.
- Make compliance-sensitive assumptions explicit. Verify current authoritative requirements when implementing behavior that depends on them, and identify decisions requiring legal, security, or clinical review.
- Treat protected health information (PHI) and other sensitive data as sensitive throughout their lifecycle, including development, testing, integrations, backups, and deletion.

## Simple, extensible architecture

- Choose the simplest architecture that meets the actual requirements, including safety, security, and reliability. Favor a modular monolith and existing platform capabilities unless concrete needs justify more complexity.
- Keep responsibilities clear, business rules explicit, and module boundaries easy to extend. Avoid speculative abstractions, premature optimization, unnecessary dependencies, and distributed services without a demonstrated need.
- Design for expected growth through bounded queries, pagination, appropriate indexes, and controlled resource usage. Use evidence to guide scaling decisions.
- Document meaningful tradeoffs and operational assumptions close to the relevant code or in a concise architecture decision record.

## Security and privacy by design

- Minimize collection, access, storage, and exposure of sensitive data. Use synthetic or appropriately de-identified data for development and tests; never copy production PHI into fixtures or examples.
- Enforce authentication, authorization, and applicable organization or tenant boundaries on the server for every protected operation. Apply least privilege and deny access by default.
- Validate untrusted input at system boundaries. Keep secrets server-side and out of source control, browser bundles, and logs. Use established security libraries and managed secret storage rather than custom cryptography.
- Protect sensitive data in transit and at rest. Consider retention, deletion, backup recovery, and access controls as part of the feature, not as later additions.
- Keep PHI, credentials, tokens, and sensitive payloads out of URLs, application logs, analytics, error messages, and unnecessary client responses. Review caching behavior to prevent disclosure across users or organizations.

## Correctness, concurrency, and failures

- Assume requests can overlap, clients can disconnect, workers can restart, and external systems can fail or time out. Define observable outcomes and recovery behavior for these cases.
- Protect invariants with database constraints, atomic operations, and transactions where appropriate. Use optimistic concurrency checks, versioning, or suitable locking to prevent lost updates; do not rely on process-local locks across instances.
- Design retryable mutations and external side effects for idempotency. When needed, use durable idempotency keys scoped to the caller and operation, associate them with the request and result, and handle concurrent duplicates atomically. Reject reuse with a different payload and define retention behavior.
- Retry only appropriate transient failures with bounded attempts, backoff, and jitter. Distinguish retryable failures from validation, authorization, and permanent failures. After an ambiguous timeout, reconcile the outcome before repeating a potentially non-idempotent action.
- Keep database changes and external side effects consistent. Use an outbox or equivalent durable handoff when required; introduce queues and orchestration only when simpler mechanisms cannot provide the necessary guarantees.
- Surface actionable errors without exposing sensitive details. Avoid silent data loss, partial success presented as complete success, or unsafe fallback behavior. Make migrations and recovery procedures safe for existing data.

## Auditability and operations

- Provide audit trails for sensitive data access, consequential changes, permission changes, and security-relevant events as required by the workflow and applicable obligations.
- Capture the actor, action, affected record identifier, timestamp, outcome, and correlation identifier as appropriate. Keep audit events useful without duplicating PHI or secrets; record only the minimum necessary change metadata.
- Protect audit records from unauthorized access, modification, and deletion. Define retention and access policies, and ensure required audit events cannot be silently lost when an operation succeeds or fails.
- Use structured, privacy-conscious logs, metrics, and correlation identifiers to investigate failures. Consider monitoring, backup restoration, and operational recovery when delivering persistent or critical workflows.

## Testing and verification

- Include meaningful automated tests for business rules, authorization boundaries, data integrity, and critical user workflows. Match the level of testing to the risk and behavior being changed.
- Exercise failure paths as well as success paths: concurrent updates, duplicate requests, idempotency key conflicts, retries, timeouts, partial failures, and recovery where relevant.
- Use integration tests for guarantees that depend on real database constraints, transactions, or external service contracts; mocks alone do not establish those guarantees.
- Verify sensitive information is excluded from responses, logs, and audit payloads where it should not appear. Test isolation between users and organizations where applicable.
- Run the relevant tests, lint, type checks, and production build before considering a code change complete. Report any checks that could not run and any remaining risks; do not describe unverified behavior as validated.

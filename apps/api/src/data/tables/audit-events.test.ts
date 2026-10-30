import { randomUUID } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { App } from '../../app.ts'
import { buildTestApp } from '../../test/build-test-app.ts'
import { auditEvents } from './audit-events.ts'

describe('audit_events table', () => {
  let app: App

  // ----------------------------------------- SETUP -----------------------------------------------

  beforeEach(async () => {
    app = await buildTestApp()
    await app.db.insert(auditEvents).values({
      actor: 'anonymous',
      action: 'participant.created',
      entityType: 'participant',
      entityId: randomUUID(),
    })
  })

  // ---------------------------------------- TEARDOWN ---------------------------------------------

  afterEach(async () => {
    await app.close()
  })

  // ----------------------------------------- TESTS -----------------------------------------------

  it('rejects updates', async () => {
    await expect(app.db.update(auditEvents).set({ actor: 'someone else' })).rejects.toMatchObject({
      cause: { message: 'audit_events is append-only' },
    })
  })

  it('rejects deletes', async () => {
    await expect(app.db.delete(auditEvents)).rejects.toMatchObject({
      cause: { message: 'audit_events is append-only' },
    })
  })
})

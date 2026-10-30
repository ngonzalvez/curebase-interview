import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { App } from '../../app.ts'
import { auditEvents } from '../../data/tables/audit-events.ts'
import { buildTestApp } from '../../test/build-test-app.ts'

describe('POST /participants', () => {
  let app: App

  // ----------------------------------------- SETUP -----------------------------------------------

  beforeEach(async () => {
    app = await buildTestApp()
  })

  // ---------------------------------------- TEARDOWN ---------------------------------------------

  afterEach(async () => {
    await app.close()
  })

  // ----------------------------------------- TESTS -----------------------------------------------

  it('creates a participant and returns it with its BMI', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/participants',
      payload: { email: 'Ada@Example.com', firstName: 'Ada', heightCm: 180, weightKg: 81 },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toEqual({
      id: expect.any(String),
      email: 'ada@example.com',
      firstName: 'Ada',
      lastName: null,
      birthDate: null,
      heightCm: 180,
      weightKg: 81,
      bmi: expect.closeTo(25, 5),
      createdAt: expect.any(String),
    })
  })

  it('creates a participant from just an email, leaving the rest of the profile empty', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/participants',
      payload: { email: 'ada@example.com' },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toEqual({
      id: expect.any(String),
      email: 'ada@example.com',
      firstName: null,
      lastName: null,
      birthDate: null,
      heightCm: null,
      weightKg: null,
      bmi: null,
      createdAt: expect.any(String),
    })
  })

  it('records who created the participant and with which values', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/participants',
      payload: { email: 'ada@example.com', heightCm: 180, weightKg: 81 },
    })

    const events = await app.db.select().from(auditEvents)
    expect(events).toEqual([
      {
        id: expect.any(String),
        actor: 'anonymous',
        action: 'participant.created',
        entityType: 'participant',
        entityId: response.json().id,
        changes: {
          email: { from: null, to: 'ada@example.com' },
          heightCm: { from: null, to: 180 },
          weightKg: { from: null, to: 81 },
        },
        reason: null,
        requestId: expect.any(String),
        createdAt: expect.any(Date),
      },
    ])
  })

  it('rejects an invalid body with the fields that are wrong', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/participants',
      payload: { email: 'not-an-email', heightCm: 0, nickname: 'ada' },
    })

    expect(response.statusCode).toBe(400)
    expect(response.json().errors.map((error: { path: string }) => error.path)).toEqual(
      expect.arrayContaining(['email', 'heightCm']),
    )
    expect(await app.db.select().from(auditEvents)).toEqual([])
  })

  it('rejects an email that is already registered, whatever its casing', async () => {
    await app.inject({ method: 'POST', url: '/participants', payload: { email: 'ada@example.com' } })

    const response = await app.inject({
      method: 'POST',
      url: '/participants',
      payload: { email: 'ADA@example.com' },
    })

    expect(response.statusCode).toBe(409)
    expect(response.json().detail).toBe('A participant with this email already exists.')
    expect(await app.db.select().from(auditEvents)).toHaveLength(1)
  })

  it('creates only one participant when the same email arrives twice at once', async () => {
    const send = () => app.inject({ method: 'POST', url: '/participants', payload: { email: 'ada@example.com' } })

    const statuses = (await Promise.all([send(), send()])).map((response) => response.statusCode)

    expect(statuses.sort()).toEqual([201, 409])
    expect(await app.db.select().from(auditEvents)).toHaveLength(1)
  })
})

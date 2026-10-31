import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { App } from '../../app.ts'
import { participants } from '../../data/tables/participants.ts'
import { buildTestApp } from '../../test/build-test-app.ts'
import { validParticipant } from '../../test/valid-participant.ts'

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

  // Registers a participant through the API, the same way the web form does.
  const register = (payload: object) =>
    app.inject({ method: 'POST', url: '/participants', payload })

  it('registers a participant and returns it with its BMI', async () => {
    const response = await register(validParticipant({ email: 'Ada@Example.com' }))

    expect(response.statusCode).toBe(201)
    expect(response.json()).toEqual({
      id: expect.any(String),
      email: 'ada@example.com',
      firstName: 'Ada',
      lastName: 'Example',
      phone: '+1 555 0100',
      birthDate: '1990-12-10',
      heightCm: 180,
      weightKg: 81,
      bmi: expect.closeTo(25, 5),
      createdAt: expect.any(String),
    })
  })

  it('says which fields are missing, in words a person can act on', async () => {
    const response = await register({ email: 'ada@example.com' })

    expect(response.statusCode).toBe(400)
    expect(response.json().errors).toEqual([
      { path: 'firstName', message: 'First name is required' },
      { path: 'lastName', message: 'Last name is required' },
      { path: 'phone', message: 'Phone is required' },
      { path: 'birthDate', message: 'Date of birth is required' },
      { path: 'heightCm', message: 'Height is required' },
      { path: 'weightKg', message: 'Weight is required' },
    ])
  })

  it('rejects invalid values with the fields that are wrong', async () => {
    const response = await register(
      validParticipant({
        email: 'not-an-email',
        heightCm: 0,
        birthDate: '2999-01-01',
        nickname: 'ada',
      }),
    )

    expect(response.statusCode).toBe(400)
    expect(response.json().errors.map((error: { path: string }) => error.path)).toEqual(
      expect.arrayContaining(['email', 'heightCm', 'birthDate']),
    )
    expect(await app.db.select().from(participants)).toEqual([])
  })

  it('rejects an email that is already registered, whatever its casing', async () => {
    await register(validParticipant())

    const response = await register(validParticipant({ email: 'ADA@example.com' }))

    expect(response.statusCode).toBe(409)
    expect(response.json().detail).toBe('A participant with this email already exists.')
    expect(await app.db.select().from(participants)).toHaveLength(1)
  })

  it('registers only one participant when the same email arrives twice at once', async () => {
    const responses = await Promise.all([
      register(validParticipant()),
      register(validParticipant()),
    ])

    expect(responses.map((response) => response.statusCode).sort()).toEqual([201, 409])
    expect(await app.db.select().from(participants)).toHaveLength(1)
  })
})

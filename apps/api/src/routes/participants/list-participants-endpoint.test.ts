import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { App } from '../../app.ts'
import { participants } from '../../data/tables/participants.ts'
import { buildTestApp } from '../../test/build-test-app.ts'
import { validParticipant } from '../../test/valid-participant.ts'

describe('GET /participants', () => {
  let app: App

  // Fetches the list and returns just the emails, in order, which is what most tests compare.
  const listEmails = async (query = '') => {
    const response = await app.inject({ method: 'GET', url: `/participants${query}` })
    return response.json().items.map((participant: { email: string }) => participant.email)
  }

  // ----------------------------------------- SETUP -----------------------------------------------

  beforeEach(async () => {
    app = await buildTestApp()

    // Everyone is 2 m tall, so the weights give BMIs of exactly 20, 25, 30 and 35.
    // They registered a day apart, in that same order.
    await app.db.insert(participants).values([
      validParticipant({ email: 'low@example.com', heightCm: 200, weightKg: 80, createdAt: new Date('2026-01-01') }),
      validParticipant({ email: 'mid@example.com', heightCm: 200, weightKg: 100, createdAt: new Date('2026-01-02') }),
      validParticipant({ email: 'high@example.com', heightCm: 200, weightKg: 120, createdAt: new Date('2026-01-03') }),
      validParticipant({ email: 'top@example.com', heightCm: 200, weightKg: 140, createdAt: new Date('2026-01-04') }),
    ])
  })

  // ---------------------------------------- TEARDOWN ---------------------------------------------

  afterEach(async () => {
    await app.close()
  })

  // ----------------------------------------- TESTS -----------------------------------------------

  it('lists the newest participants first, with the total', async () => {
    const response = await app.inject({ method: 'GET', url: '/participants' })

    expect(response.statusCode).toBe(200)
    expect(response.json().total).toBe(4)
    expect(response.json().items[0]).toEqual({
      id: expect.any(String),
      email: 'top@example.com',
      firstName: 'Ada',
      lastName: 'Example',
      phone: '+1 555 0100',
      birthDate: '1990-12-10',
      heightCm: 200,
      weightKg: 140,
      bmi: 35,
      createdAt: '2026-01-04T00:00:00.000Z',
    })
    expect(await listEmails()).toEqual(['top@example.com', 'high@example.com', 'mid@example.com', 'low@example.com'])
  })

  it('filters by a BMI range, including both ends', async () => {
    const response = await app.inject({ method: 'GET', url: '/participants?minBmi=25&maxBmi=30' })

    expect(response.json().total).toBe(2)
    expect(await listEmails('?minBmi=25&maxBmi=30')).toEqual(['high@example.com', 'mid@example.com'])
  })

  it('sorts by BMI in either direction', async () => {
    expect(await listEmails('?sort=bmi&order=asc')).toEqual([
      'low@example.com',
      'mid@example.com',
      'high@example.com',
      'top@example.com',
    ])
    expect(await listEmails('?sort=bmi&order=desc')).toEqual([
      'top@example.com',
      'high@example.com',
      'mid@example.com',
      'low@example.com',
    ])
  })

  it('pages through the results without changing the total', async () => {
    const response = await app.inject({ method: 'GET', url: '/participants?limit=2&offset=2' })

    expect(response.json().total).toBe(4)
    expect(await listEmails('?limit=2&offset=2')).toEqual(['mid@example.com', 'low@example.com'])
  })

  it('rejects a minimum BMI above the maximum', async () => {
    const response = await app.inject({ method: 'GET', url: '/participants?minBmi=30&maxBmi=20' })

    expect(response.statusCode).toBe(400)
    expect(response.json().errors).toEqual([{ path: 'maxBmi', message: 'Must be greater than or equal to minBmi' }])
  })

  it('rejects page sizes over 100 and unknown parameters', async () => {
    const tooBig = await app.inject({ method: 'GET', url: '/participants?limit=101' })
    const unknown = await app.inject({ method: 'GET', url: '/participants?email=ada@example.com' })

    expect(tooBig.statusCode).toBe(400)
    expect(unknown.statusCode).toBe(400)
  })
})

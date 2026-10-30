import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { z } from 'zod'
import type { App } from '../app.ts'
import { ConflictError } from '../errors/conflict-error.ts'
import { buildTestApp } from '../test/build-test-app.ts'

describe('error handler', () => {
  let app: App

  // ----------------------------------------- SETUP -----------------------------------------------

  beforeEach(async () => {
    app = await buildTestApp((app) => {
      app.post('/validated', { schema: { body: z.object({ email: z.email() }) } }, async () => ({}))
      app.get('/conflict', async () => {
        throw new ConflictError('Email already registered.')
      })
      app.get('/crash', async () => {
        throw new Error('connection string postgres://secret')
      })
    })
  })

  // ---------------------------------------- TEARDOWN ---------------------------------------------

  afterEach(async () => {
    await app.close()
  })

  // ----------------------------------------- TESTS -----------------------------------------------

  it('returns field errors for invalid requests', async () => {
    const response = await app.inject({ method: 'POST', url: '/validated', payload: { email: 'nope' } })

    expect(response.statusCode).toBe(400)
    expect(response.headers['content-type']).toContain('application/problem+json')
    expect(response.json()).toMatchObject({ status: 400, errors: [{ path: 'email' }] })
  })

  it('maps app errors to their status and message', async () => {
    const response = await app.inject({ method: 'GET', url: '/conflict' })

    expect(response.statusCode).toBe(409)
    expect(response.json()).toMatchObject({ status: 409, detail: 'Email already registered.' })
  })

  it('hides internal details on unexpected errors', async () => {
    const response = await app.inject({ method: 'GET', url: '/crash' })

    expect(response.statusCode).toBe(500)
    expect(response.body).not.toContain('secret')
  })

  it('returns problem details for unknown routes', async () => {
    const response = await app.inject({ method: 'GET', url: '/nope' })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toMatchObject({ status: 404, title: 'Not Found' })
  })
})

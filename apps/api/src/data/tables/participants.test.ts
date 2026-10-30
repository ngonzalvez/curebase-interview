import { eq } from 'drizzle-orm'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { App } from '../../app.ts'
import { buildTestApp } from '../../test/build-test-app.ts'
import { participants } from './participants.ts'

describe('participants table', () => {
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

  it('computes BMI from height and weight', async () => {
    const [row] = await app.db
      .insert(participants)
      .values({ email: 'ada@example.com', heightCm: 180, weightKg: 81 })
      .returning()

    expect(row?.bmi).toBeCloseTo(25, 5)
  })

  it('recomputes BMI when weight changes', async () => {
    const [row] = await app.db
      .insert(participants)
      .values({ email: 'ada@example.com', heightCm: 200, weightKg: 80 })
      .returning()

    const [updated] = await app.db
      .update(participants)
      .set({ weightKg: 100 })
      .where(eq(participants.id, row!.id))
      .returning()

    expect(updated?.bmi).toBeCloseTo(25, 5)
  })

  it('leaves BMI empty until height and weight are set', async () => {
    const [row] = await app.db.insert(participants).values({ email: 'ada@example.com' }).returning()

    expect(row?.bmi).toBeNull()
  })

  it('rejects non-positive height and weight', async () => {
    await expect(
      app.db.insert(participants).values({ email: 'ada@example.com', heightCm: 0, weightKg: 70 }),
    ).rejects.toMatchObject({ cause: { constraint: 'participants_height_cm_positive' } })
    await expect(
      app.db.insert(participants).values({ email: 'ada@example.com', heightCm: 170, weightKg: -1 }),
    ).rejects.toMatchObject({ cause: { constraint: 'participants_weight_kg_positive' } })
  })

  it('rejects emails that are not lowercase', async () => {
    await expect(app.db.insert(participants).values({ email: 'Ada@Example.com' })).rejects.toMatchObject({
      cause: { constraint: 'participants_email_lowercase' },
    })
  })

  it('rejects duplicate emails', async () => {
    await app.db.insert(participants).values({ email: 'ada@example.com' })

    await expect(app.db.insert(participants).values({ email: 'ada@example.com' })).rejects.toMatchObject({
      cause: { constraint: 'participants_email_unique' },
    })
  })
})

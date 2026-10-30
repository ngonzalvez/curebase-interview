import { describe, expect, it } from 'vitest'
import { toParticipantData } from './to-participant-data.ts'

describe('toParticipantData', () => {
  // Builds the FormData a browser would send for these fields.
  const formWith = (fields: Record<string, string>) => {
    const form = new FormData()
    for (const [name, value] of Object.entries(fields)) form.set(name, value)
    return form
  }

  // ----------------------------------------- TESTS -----------------------------------------------

  it('keeps metric values as they are', () => {
    const data = toParticipantData(formWith({ height: '180', weight: '81' }), 'metric')

    expect(data).toMatchObject({ heightCm: 180, weightKg: 81 })
  })

  it('converts inches and pounds to centimeters and kilograms', () => {
    const data = toParticipantData(formWith({ height: '70', weight: '195' }), 'imperial')

    expect(data).toMatchObject({ heightCm: 177.8, weightKg: 88.5 })
  })

  it('trims text and leaves blank fields out', () => {
    const data = toParticipantData(formWith({ firstName: '  Ada  ', lastName: '   ', height: '' }), 'metric')

    expect(data.firstName).toBe('Ada')
    expect(data.lastName).toBeUndefined()
    expect(data.heightCm).toBeUndefined()
  })
})

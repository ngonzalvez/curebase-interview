import { describe, expect, it } from 'vitest'
import { fromCentimeters, fromKilograms, toCentimeters, toKilograms } from './units.ts'

describe('units', () => {
  // ----------------------------------------- TESTS -----------------------------------------------

  it('converts inches and pounds to centimeters and kilograms', () => {
    expect(toCentimeters(70, 'imperial')).toBe(177.8)
    expect(toKilograms(195, 'imperial')).toBe(88.5)
  })

  it('converts centimeters and kilograms to inches and pounds', () => {
    expect(fromCentimeters(177.8, 'imperial')).toBe(70)
    expect(fromKilograms(88.5, 'imperial')).toBe(195.1)
  })

  it('leaves metric values as they are', () => {
    expect(toCentimeters(180, 'metric')).toBe(180)
    expect(fromKilograms(81, 'metric')).toBe(81)
  })
})

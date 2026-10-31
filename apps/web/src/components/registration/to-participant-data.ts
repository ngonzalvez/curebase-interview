import type { ParticipantData } from '../../api/register-participant.ts'
import { toCentimeters, toKilograms, type Units } from '../../lib/units.ts'

/**
 * Turns what was typed into the registration form into the data the API expects.
 * Text is trimmed and blank fields are left out, so validation reports them as
 * missing rather than as empty text. Height and weight can be typed in inches and
 * pounds, but the API always stores centimeters and kilograms, so they're converted
 * here, rounded to one decimal.
 */
export function toParticipantData(form: FormData, units: Units): Partial<ParticipantData> {
  const text = (name: string) => String(form.get(name) ?? '').trim() || undefined
  const number = (name: string, convert: (value: number, units: Units) => number) => {
    const value = text(name)
    return value === undefined ? undefined : convert(Number(value), units)
  }

  return {
    email: text('email'),
    firstName: text('firstName'),
    lastName: text('lastName'),
    phone: text('phone'),
    birthDate: text('birthDate'),
    heightCm: number('height', toCentimeters),
    weightKg: number('weight', toKilograms),
  }
}

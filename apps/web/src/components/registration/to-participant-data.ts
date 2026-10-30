import type { ParticipantData } from '../../api/register-participant.ts'

export type Units = 'metric' | 'imperial'

const CM_PER_INCH = 2.54
const KG_PER_POUND = 0.45359237

/**
 * Turns what was typed into the registration form into the data the API expects.
 * Text is trimmed and blank fields are left out, so validation reports them as
 * missing rather than as empty text. Height and weight can be typed in inches and
 * pounds, but the API always stores centimeters and kilograms, so they're converted
 * here, rounded to one decimal.
 */
export function toParticipantData(form: FormData, units: Units): Partial<ParticipantData> {
  const text = (name: string) => String(form.get(name) ?? '').trim() || undefined
  const number = (name: string, factor: number) => {
    const value = text(name)
    return value === undefined ? undefined : round(Number(value) * factor)
  }

  return {
    email: text('email'),
    firstName: text('firstName'),
    lastName: text('lastName'),
    phone: text('phone'),
    birthDate: text('birthDate'),
    heightCm: number('height', units === 'imperial' ? CM_PER_INCH : 1),
    weightKg: number('weight', units === 'imperial' ? KG_PER_POUND : 1),
  }
}

function round(value: number) {
  return Math.round(value * 10) / 10
}

/**
 * The two unit systems staff can work in. The API always stores centimeters and
 * kilograms; inches and pounds only exist in the browser, for typing and reading.
 */
export type Units = 'metric' | 'imperial'

/**
 * The cookie that remembers which units each person prefers to read the list in.
 */
export const UNITS_COOKIE = 'units'

/**
 * Reads the units from the cookie's value, falling back to metric for anything else.
 */
export function parseUnits(value: string | undefined): Units {
  return value === 'imperial' ? 'imperial' : 'metric'
}

/**
 * Remembers the units in the browser for a year. The server reads the same cookie to
 * render the list, so a page refresh is needed to see the change.
 */
export function saveUnits(units: Units) {
  document.cookie = `${UNITS_COOKIE}=${units}; path=/; max-age=31536000; samesite=lax`
}

const CM_PER_INCH = 2.54
const KG_PER_POUND = 0.45359237

/**
 * The unit labels to show next to heights and weights.
 */
export const unitLabels = {
  metric: { height: 'cm', weight: 'kg' },
  imperial: { height: 'in', weight: 'lbs' },
} as const

/**
 * Converts a height typed in the given units to centimeters, rounded to one decimal.
 */
export function toCentimeters(height: number, units: Units) {
  return round(units === 'imperial' ? height * CM_PER_INCH : height)
}

/**
 * Converts a weight typed in the given units to kilograms, rounded to one decimal.
 */
export function toKilograms(weight: number, units: Units) {
  return round(units === 'imperial' ? weight * KG_PER_POUND : weight)
}

/**
 * Converts a height in centimeters to the given units, rounded to one decimal.
 */
export function fromCentimeters(heightCm: number, units: Units) {
  return round(units === 'imperial' ? heightCm / CM_PER_INCH : heightCm)
}

/**
 * Converts a weight in kilograms to the given units, rounded to one decimal.
 */
export function fromKilograms(weightKg: number, units: Units) {
  return round(units === 'imperial' ? weightKg / KG_PER_POUND : weightKg)
}

/**
 * Rounds to one decimal, which is as precise as anyone measures height or weight.
 */
function round(value: number) {
  return Math.round(value * 10) / 10
}

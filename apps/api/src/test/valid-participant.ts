/**
 * A made-up participant that passes every rule, for tests that only care about one or
 * two fields. Pass the fields you want to change, and everything else stays valid.
 * With 180 cm and 81 kg, the BMI comes out at exactly 25.
 */
export function validParticipant<T extends object>(overrides?: T) {
  return {
    email: 'ada@example.com',
    firstName: 'Ada',
    lastName: 'Example',
    phone: '+1 555 0100',
    birthDate: '1990-12-10',
    heightCm: 180,
    weightKg: 81,
    ...overrides,
  }
}

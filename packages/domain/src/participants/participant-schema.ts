import { z } from 'zod'

/**
 * What makes a participant valid, wherever one is created or changed. Participants
 * register with their whole profile at once, so every field is required.
 *
 * Emails are stored in lowercase so the same person can't register twice with
 * different casing. Height and weight are metric and only need to be positive;
 * the form can accept other units, but converts them before sending.
 *
 * The messages are written for the person filling in the form, since the web app shows
 * them next to each field and the API sends the same ones back when a request is invalid.
 */
export const ParticipantSchema = z.object({
  email: z
    .email('Enter a valid email address')
    .max(254, 'Email must be at most 254 characters')
    .toLowerCase(),
  firstName: z
    .string('First name is required')
    .trim()
    .min(1, 'First name is required')
    .max(100, 'First name must be at most 100 characters'),
  lastName: z
    .string('Last name is required')
    .trim()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be at most 100 characters'),
  phone: z
    .string('Phone is required')
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, 'Enter a valid phone number, like +1 555 010 0100'),
  birthDate: z.iso
    .date('Date of birth is required')
    .refine(isNotInTheFuture, "Date of birth can't be in the future"),
  heightCm: z.number('Height is required').positive('Height must be greater than 0'),
  weightKg: z.number('Weight is required').positive('Weight must be greater than 0'),
})

function isNotInTheFuture(isoDate: string) {
  return isoDate <= new Date().toISOString().slice(0, 10)
}

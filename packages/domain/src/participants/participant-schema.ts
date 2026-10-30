import { z } from 'zod'

/**
 * What makes a participant valid, wherever one is created or changed. Participants
 * register with their whole profile at once, so every field is required.
 *
 * Emails are stored in lowercase so the same person can't register twice with
 * different casing. Height and weight are metric and only need to be positive;
 * the form can accept other units, but converts them before sending.
 */
export const ParticipantSchema = z.object({
  email: z.email().max(254).toLowerCase(),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, 'Use digits, spaces, dashes or brackets, with an optional leading +'),
  birthDate: z.iso.date().refine(isNotInTheFuture, 'Must not be in the future'),
  heightCm: z.number().positive(),
  weightKg: z.number().positive(),
})

function isNotInTheFuture(isoDate: string) {
  return isoDate <= new Date().toISOString().slice(0, 10)
}

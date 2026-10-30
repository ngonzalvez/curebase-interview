import { z } from 'zod'

/**
 * What makes a participant valid, wherever one is created or changed. Only the email
 * is required, because a participant exists before filling in the intake; the rest of
 * the profile arrives later. Emails are stored in lowercase so the same person can't
 * sign up twice with different casing. Height and weight are metric and only need to
 * be positive; whether someone is eligible for a study is decided by the questionnaire.
 */
export const ParticipantSchema = z.object({
  email: z.email().max(254).toLowerCase(),
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
  birthDate: z.iso.date().optional(),
  heightCm: z.number().positive().optional(),
  weightKg: z.number().positive().optional(),
})

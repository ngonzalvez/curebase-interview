import { z } from 'zod'

/**
 * A participant as the API returns it. Fields that haven't been filled in yet come
 * back as null, and BMI stays null until both height and weight are known. Anything
 * not listed here, like internal timestamps, is dropped before the response is sent.
 */
export const ParticipantResponseSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  birthDate: z.iso.date().nullable(),
  heightCm: z.number().nullable(),
  weightKg: z.number().nullable(),
  bmi: z.number().nullable(),
})

import { z } from 'zod'

/**
 * A participant as the API returns it, including the BMI that Postgres calculated.
 * Anything not listed here, like updatedAt, is dropped before the response is sent.
 *
 * JSON has no date type, so createdAt travels as an ISO string. The codec turns the
 * API's Date into that string on the way out, and back into a Date for whoever parses
 * the response with this same schema.
 */
export const ParticipantResponseSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  birthDate: z.iso.date(),
  heightCm: z.number(),
  weightKg: z.number(),
  bmi: z.number(),
  createdAt: z.codec(z.iso.datetime(), z.date(), {
    decode: (iso) => new Date(iso),
    encode: (date) => date.toISOString(),
  }),
})

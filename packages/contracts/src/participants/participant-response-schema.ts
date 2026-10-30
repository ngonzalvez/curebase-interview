import { z } from 'zod'

/**
 * A participant as the API returns it. Fields that haven't been filled in yet come
 * back as null, and BMI stays null until both height and weight are known. Anything
 * not listed here, like updatedAt, is dropped before the response is sent.
 *
 * JSON has no date type, so createdAt travels as an ISO string. The codec turns the
 * API's Date into that string on the way out, and back into a Date for whoever parses
 * the response with this same schema.
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
  createdAt: z.codec(z.iso.datetime(), z.date(), {
    decode: (iso) => new Date(iso),
    encode: (date) => date.toISOString(),
  }),
})

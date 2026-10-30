import { z } from 'zod'
import { ParticipantResponseSchema } from './participant-response-schema.ts'

/**
 * The query string of GET /participants. Everything arrives as text in a URL, so
 * numbers are coerced before they're checked. Without any parameters you get the
 * 20 newest participants. The page size is capped at 100 so no request can ask
 * for the whole table at once.
 */
export const ListParticipantsQuerySchema = z
  .object({
    minBmi: z.coerce.number().positive().optional(),
    maxBmi: z.coerce.number().positive().optional(),
    sort: z.enum(['createdAt', 'bmi']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict()
  .refine(({ minBmi, maxBmi }) => minBmi === undefined || maxBmi === undefined || minBmi <= maxBmi, {
    message: 'Must be greater than or equal to minBmi',
    path: ['maxBmi'],
  })

/**
 * One page of participants, plus how many participants match the filters in total,
 * so the client can work out how many pages there are.
 */
export const ListParticipantsResponseSchema = z.object({
  items: z.array(ParticipantResponseSchema),
  total: z.number().int(),
})

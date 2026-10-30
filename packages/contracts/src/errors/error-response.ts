import { z } from 'zod'

/**
 * The body of every error the API returns, in the RFC 9457 Problem Details format.
 * `detail` is a message that's safe to show, and `errors` lists the fields that
 * failed validation, so a form can show each message next to its input.
 */
export const ErrorResponseSchema = z.object({
  title: z.string(),
  status: z.number().int(),
  detail: z.string().optional(),
  errors: z.array(z.object({ path: z.string(), message: z.string() })).optional(),
})

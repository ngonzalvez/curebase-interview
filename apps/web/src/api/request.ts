import { ErrorResponseSchema } from '@curebase/contracts/errors/error-response'
import type { z } from 'zod'
import { ApiError } from './api-error.ts'

/**
 * Sends a request to the API and parses the answer with the endpoint's response
 * schema, so callers get typed data, with dates already turned back into Dates.
 * Error answers become an ApiError. Responses are never cached: participant data
 * changes all the time and must not be shared between requests.
 */
export async function request<T extends z.ZodType>(path: string, schema: T, init?: { method: string; body: unknown }) {
  const response = await fetch(new URL(path, process.env.NEXT_PUBLIC_API_URL), {
    method: init?.method ?? 'GET',
    cache: 'no-store',
    ...(init && { headers: { 'content-type': 'application/json' }, body: JSON.stringify(init.body) }),
  })
  const body = await response.json()

  if (!response.ok) throw new ApiError(ErrorResponseSchema.parse(body))
  return schema.parse(body) as z.output<T>
}

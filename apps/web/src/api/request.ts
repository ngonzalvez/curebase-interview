import { ErrorResponseSchema } from '@curebase/contracts/errors/error-response'
import type { z } from 'zod'
import { toSearchParams } from '../lib/to-search-params.ts'
import { ApiError } from './api-error.ts'

type RequestOptions = {
  method?: 'GET' | 'POST'
  query?: Record<string, string | number | undefined>
  body?: unknown
}

/**
 * Sends a request to the API and parses the answer with the endpoint's response
 * schema, so callers get typed data, with dates already turned back into Dates.
 * Error answers become an ApiError. Responses are never cached: participant data
 * changes all the time and must not be shared between requests.
 */
export async function request<T extends z.ZodType>(
  path: string,
  schema: T,
  { method = 'GET', query = {}, body }: RequestOptions = {},
) {
  const url = new URL(path, process.env.NEXT_PUBLIC_API_URL)
  url.search = toSearchParams(query).toString()

  const response = await fetch(url, {
    method,
    cache: 'no-store',
    ...(body !== undefined && {
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  })
  const json = await response.json()

  if (!response.ok) throw new ApiError(ErrorResponseSchema.parse(json))
  return schema.parse(json) as z.output<T>
}

import type { ErrorResponseSchema } from '@curebase/contracts/errors/error-response'
import type { z } from 'zod'

type ErrorResponse = z.infer<typeof ErrorResponseSchema>

/**
 * Thrown when the API answers with an error. It carries the status and the API's
 * safe message, plus any field errors, so the UI can decide what to show without
 * parsing anything itself.
 */
export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: NonNullable<ErrorResponse['errors']>

  constructor({ status, title, detail, errors }: ErrorResponse) {
    super(detail ?? title)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = errors ?? []
  }
}

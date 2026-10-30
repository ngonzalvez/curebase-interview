import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'
import { AppError } from '../errors/app-error.ts'
import { sendErrorResponse } from '../errors/send-error-response.ts'

/**
 * Fastify's global error handler. Every error thrown by a route or plugin ends here
 * and is turned into an RFC 9457 Problem Details response, so clients always get the
 * same error shape and never see internal details.
 *
 * - Request validation errors (Zod): 400 with the path and message of each invalid field.
 * - AppError subclasses (ValidationError, NotFoundError, ConflictError): their own
 *   status and message, which are written to be safe for clients.
 * - Fastify's own client errors (malformed JSON, body too large, rate limited):
 *   the status only, because their messages can echo request content.
 * - Anything else: logged with full details, and returned as a bare 500.
 */
export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (hasZodFastifySchemaValidationErrors(error)) {
    const errors = error.validation.map((issue) => ({
      path: issue.instancePath.replace(/^\//, '').replaceAll('/', '.'),
      message: issue.message ?? 'Invalid value',
    }))
    return sendErrorResponse(reply, { status: 400, detail: 'The request is invalid.', errors })
  }

  if (error instanceof AppError) {
    return sendErrorResponse(reply, { status: error.statusCode, detail: error.message, errors: error.errors })
  }

  // Fastify's own client errors (malformed JSON, body too large, rate limited).
  // Their messages can echo request content, so only the status is sent.
  if (error.statusCode && error.statusCode < 500) {
    return sendErrorResponse(reply, { status: error.statusCode })
  }

  request.log.error({ err: error }, 'Unhandled error')
  return sendErrorResponse(reply, { status: 500 })
}

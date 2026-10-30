import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'
import { AppError } from '../errors/app-error.ts'
import { sendErrorResponse } from '../errors/send-error-response.ts'

/**
 * Every error thrown by a route ends up here. Whatever went wrong, the client gets
 * the same Problem Details shape back, and never anything internal like a stack trace.
 */
export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (hasZodFastifySchemaValidationErrors(error)) {
    const errors = error.validation.map((issue) => ({
      path: issue.instancePath.replace(/^\//, '').replaceAll('/', '.'),
      message: issue.message ?? 'Invalid value',
    }))
    return sendErrorResponse(reply, { status: 400, detail: 'The request is invalid.', errors })
  }

  // Our own errors, whose status and message were written to be shown to the client.
  if (error instanceof AppError) {
    return sendErrorResponse(reply, { status: error.statusCode, detail: error.message, errors: error.errors })
  }

  // Fastify's own client errors (malformed JSON, body too large, rate limited).
  // Their messages can echo request content, so only the status is sent.
  if (error.statusCode && error.statusCode < 500) {
    return sendErrorResponse(reply, { status: error.statusCode })
  }

  // Anything else is a bug. We log the full error for ourselves, and the client
  // only learns that something went wrong on our side.
  request.log.error({ err: error }, 'Unhandled error')
  return sendErrorResponse(reply, { status: 500 })
}

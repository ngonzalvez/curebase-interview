import { STATUS_CODES } from 'node:http'
import type { FastifyReply } from 'fastify'
import type { FieldError } from './app-error.ts'

type ErrorResponse = { status: number; detail?: string; errors?: FieldError[] }

/**
 * Sends an error response in the RFC 9457 Problem Details format, which every API
 * error uses so clients can handle errors in one place.
 */
export function sendErrorResponse(reply: FastifyReply, { status, detail, errors }: ErrorResponse) {
  return reply
    .code(status)
    .type('application/problem+json')
    .send({
      type: 'about:blank',
      title: STATUS_CODES[status] ?? 'Error',
      status,
      ...(detail && { detail }),
      ...(errors?.length && { errors }),
    })
}

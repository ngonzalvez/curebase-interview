import { STATUS_CODES } from 'node:http'
import type { FastifyReply } from 'fastify'
import type { FieldError } from './app-error.ts'

type ErrorResponse = { status: number; detail?: string; errors?: FieldError[] }

/**
 * Sends an error in the RFC 9457 Problem Details format. Every error the API returns
 * goes through here, so clients only ever have to handle one error shape.
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

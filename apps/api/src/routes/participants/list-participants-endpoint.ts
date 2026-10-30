import {
  ListParticipantsQuerySchema,
  ListParticipantsResponseSchema,
} from '@curebase/contracts/participants/list-participants'
import type { FastifyRequest } from 'fastify'
import type { z } from 'zod'
import { findParticipants } from '../../data/participants/find-participants.ts'

type Request = FastifyRequest<{ Querystring: z.infer<typeof ListParticipantsQuerySchema> }>

/**
 * Lists participants one page at a time, optionally filtered by a BMI range. The query
 * is validated, coerced and given its defaults before the handler runs, so the handler
 * can pass it straight to the database.
 *
 * Reads aren't written to the audit trail yet. Until people sign in, every entry
 * would say "anonymous", which tells an auditor nothing. Recording who viewed which
 * participants belongs with authentication, once there's a real person to record.
 */
export const listParticipantsEndpoint = {
  schema: {
    querystring: ListParticipantsQuerySchema,
    response: { 200: ListParticipantsResponseSchema },
  },
  async handler(request: Request) {
    return findParticipants(request.server.db, request.query)
  },
}

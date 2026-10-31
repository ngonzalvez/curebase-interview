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

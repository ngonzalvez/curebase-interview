import {
  CreateParticipantBodySchema,
  CreateParticipantResponseSchema,
} from '@curebase/contracts/participants/create-participant'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { z } from 'zod'
import { insertParticipant } from '../../data/participants/insert-participant.ts'
import { isUniqueViolation } from '../../data/is-unique-violation.ts'
import { ConflictError } from '../../errors/conflict-error.ts'

type Request = FastifyRequest<{ Body: z.infer<typeof CreateParticipantBodySchema> }>

/**
 * Registers a new participant. We don't look the email up first: two requests could
 * both find it free and then race to insert, so we let the unique constraint decide
 * and turn a duplicate into a 409.
 */
export const createParticipantEndpoint = {
  schema: {
    body: CreateParticipantBodySchema,
    response: { 201: CreateParticipantResponseSchema },
  },
  async handler(request: Request, reply: FastifyReply) {
    try {
      const participant = await insertParticipant(request.server.db, request.body)
      return reply.code(201).send(participant)
    } catch (error) {
      if (isUniqueViolation(error, 'participants_email_unique')) {
        throw new ConflictError('A participant with this email already exists.')
      }
      throw error
    }
  },
}

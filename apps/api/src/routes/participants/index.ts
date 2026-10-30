import { CreateParticipantBodySchema } from '@curebase/contracts/participants/create-participant-body-schema'
import { ParticipantResponseSchema } from '@curebase/contracts/participants/participant-response-schema'
import type { FastifyInstance } from 'fastify'
import { createParticipantEndpoint } from './create-participant-endpoint.ts'

/**
 * Registers the participant routes, each with the schemas its requests are
 * validated against and its responses are shaped by.
 */
export async function participantRoutes(app: FastifyInstance) {
  app.post(
    '/participants',
    { schema: { body: CreateParticipantBodySchema, response: { 201: ParticipantResponseSchema } } },
    createParticipantEndpoint,
  )
}

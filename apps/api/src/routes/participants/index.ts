import type { FastifyInstance } from 'fastify'
import { createParticipantEndpoint } from './create-participant-endpoint.ts'
import { listParticipantsEndpoint } from './list-participants-endpoint.ts'

/**
 * Maps the participant URLs to their endpoints. Each endpoint brings its own schemas
 * and handler, so this file only says which method and path lead where.
 */
export async function participantRoutes(app: FastifyInstance) {
  app.get('/participants', listParticipantsEndpoint)
  app.post('/participants', createParticipantEndpoint)
}

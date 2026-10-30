import type { CreateParticipantBodySchema } from '@curebase/contracts/participants/create-participant-body-schema'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { z } from 'zod'
import { insertAuditEvent } from '../../data/audit-events/insert-audit-event.ts'
import { insertParticipant } from '../../data/participants/insert-participant.ts'
import { isUniqueViolation } from '../../data/is-unique-violation.ts'
import { ConflictError } from '../../errors/conflict-error.ts'

type Request = FastifyRequest<{ Body: z.infer<typeof CreateParticipantBodySchema> }>

/**
 * Registers a new participant and records it in the audit log, both in one
 * transaction. We don't look the email up first: two requests could both find it
 * free and then race to insert, so we let the unique constraint decide and turn a
 * duplicate into a 409.
 */
export async function createParticipantEndpoint(request: Request, reply: FastifyReply) {
  const participant = await request.server.db.transaction(async (tx) => {
    try {
      const participant = await insertParticipant(tx, request.body)
      await insertAuditEvent(tx, {
        // Nobody is signed in yet. Once authentication exists, this becomes the user.
        actor: 'anonymous',
        action: 'participant.created',
        entityType: 'participant',
        entityId: participant.id,
        // A new record has no previous values, so every field goes from null to what was sent.
        changes: Object.fromEntries(
          Object.entries(request.body).map(([field, value]) => [field, { from: null, to: value }]),
        ),
        requestId: request.id,
      })
      return participant
    } catch (error) {
      if (isUniqueViolation(error, 'participants_email_unique')) {
        throw new ConflictError('A participant with this email already exists.')
      }
      throw error
    }
  })

  return reply.code(201).send(participant)
}

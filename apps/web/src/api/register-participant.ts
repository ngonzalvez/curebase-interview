import {
  type CreateParticipantBodySchema,
  CreateParticipantResponseSchema,
} from '@curebase/contracts/participants/create-participant'
import type { z } from 'zod'
import { request } from './request.ts'

export type ParticipantData = z.input<typeof CreateParticipantBodySchema>

/**
 * Registers a new participant and returns them as saved, with their BMI. A duplicate
 * email or an invalid field comes back as an ApiError with the API's explanation.
 */
export function registerParticipant(participant: ParticipantData) {
  return request('/participants', {
    schema: CreateParticipantResponseSchema,
    method: 'POST',
    body: participant,
  })
}

import {
  type ListParticipantsQuerySchema,
  ListParticipantsResponseSchema,
} from '@curebase/contracts/participants/list-participants'
import type { z } from 'zod'
import { request } from './request.ts'

export type ListParticipantsQuery = z.output<typeof ListParticipantsQuerySchema>

/**
 * Fetches one page of participants, filtered and sorted as the query says.
 */
export function listParticipants(query: ListParticipantsQuery) {
  return request('/participants', { schema: ListParticipantsResponseSchema, query })
}

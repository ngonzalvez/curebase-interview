import {
  type ListParticipantsQuerySchema,
  ListParticipantsResponseSchema,
} from '@curebase/contracts/participants/list-participants'
import type { z } from 'zod'
import { request } from './request.ts'

// Every filter is optional, and a filter that isn't set can be undefined or null.
export type ListParticipantsQuery = {
  [Key in keyof z.output<typeof ListParticipantsQuerySchema>]?:
    z.output<typeof ListParticipantsQuerySchema>[Key] | null
}

/**
 * Fetches one page of participants, filtered and sorted as the query says.
 */
export function listParticipants(query: ListParticipantsQuery) {
  return request('/participants', { schema: ListParticipantsResponseSchema, query })
}

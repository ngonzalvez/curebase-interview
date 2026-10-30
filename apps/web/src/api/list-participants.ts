import {
  type ListParticipantsQuerySchema,
  ListParticipantsResponseSchema,
} from '@curebase/contracts/participants/list-participants'
import type { z } from 'zod'
import { request } from './request.ts'

export type ListParticipantsQuery = z.output<typeof ListParticipantsQuerySchema>

/**
 * Fetches one page of participants. Filters that aren't set are left out of the URL.
 */
export function listParticipants(query: ListParticipantsQuery) {
  const params = new URLSearchParams()
  for (const [name, value] of Object.entries(query)) {
    if (value !== undefined) params.set(name, String(value))
  }
  return request(`/participants?${params}`, ListParticipantsResponseSchema)
}

import { ListParticipantsQuerySchema } from '@curebase/contracts/participants/list-participants'
import type { ListParticipantsQuery } from '../../api/list-participants.ts'

type SearchParams = Record<string, string | string[] | undefined>

/**
 * Turns the page's URL parameters into a list query, using the same schema the API
 * validates with, so both sides agree on the defaults. Empty fields from the filter
 * form are ignored, so submitting it blank simply shows everyone.
 */
export function parseListQuery(searchParams: SearchParams) {
  const filled = Object.fromEntries(
    Object.entries(searchParams).filter(([, value]) => typeof value === 'string' && value.trim() !== ''),
  )
  return ListParticipantsQuerySchema.safeParse(filled)
}

/**
 * Builds a link to the list with some of the query changed. Changing anything other
 * than the page sends you back to the first page, because the old page number no
 * longer means anything once the filters or the order change.
 */
export function listHref(query: ListParticipantsQuery, changes: Partial<ListParticipantsQuery>) {
  const next = { ...query, offset: 0, ...changes }
  const params = new URLSearchParams()
  for (const [name, value] of Object.entries(next)) {
    if (value !== undefined) params.set(name, String(value))
  }
  return `/?${params}`
}

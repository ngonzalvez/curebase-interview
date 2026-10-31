import { toSearchParams } from './to-search-params.ts'

type Query = Record<string, string | number | undefined>

/**
 * Builds a link to a list with some of its query changed, like a new sort order or the
 * next page. Changing anything other than the page goes back to the first page,
 * because the old page number means nothing once the filters or the order change.
 */
export function listHref<T extends Query>(path: string, query: T, changes: Partial<T>) {
  return `${path}?${toSearchParams({ ...query, offset: 0, ...changes })}`
}

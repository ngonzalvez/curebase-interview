import type { z } from 'zod'

type SearchParams = Record<string, string | string[] | undefined>

/**
 * Reads a page's URL parameters with a schema, usually the same one the API validates
 * that list with, so the page and the API agree on what's allowed and on the defaults.
 * Empty values, like a filter input left blank, are ignored instead of being rejected,
 * and so are repeated parameters, which no list uses.
 */
export function parseSearchParams<T extends z.ZodType>(schema: T, searchParams: SearchParams) {
  const filled = Object.entries(searchParams).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].trim() !== '',
  )
  return schema.safeParse(Object.fromEntries(filled))
}

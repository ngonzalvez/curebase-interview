import type { z } from 'zod'

type SearchParams = Record<string, string | string[] | undefined>

/**
 * Reads a page's URL parameters with a schema, usually the one the API validates that
 * list with, so both agree on the types and the defaults. Blank values, like a filter
 * left empty, count as not set. Throws when the parameters break the schema's rules.
 */
export async function parseSearchParams<T extends z.ZodType>(
  searchParams: Promise<SearchParams>,
  schema: T,
): Promise<z.output<T>> {
  const filled = Object.entries(await searchParams).filter(([, value]) => value !== '')
  return schema.parse(Object.fromEntries(filled))
}

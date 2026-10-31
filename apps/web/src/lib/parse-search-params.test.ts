import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { parseSearchParams } from './parse-search-params.ts'

describe('parseSearchParams', () => {
  const schema = z.object({
    minBmi: z.coerce.number().optional(),
    limit: z.coerce.number().default(20),
  })

  // ----------------------------------------- TESTS -----------------------------------------------

  it('parses the parameters with the schema, filling in its defaults', () => {
    expect(parseSearchParams(schema, { minBmi: '18.5' }).data).toEqual({ minBmi: 18.5, limit: 20 })
  })

  it('ignores blank and repeated parameters', () => {
    expect(parseSearchParams(schema, { minBmi: '  ', limit: ['10', '20'] }).data).toEqual({
      limit: 20,
    })
  })

  it('reports parameters the schema rejects', () => {
    expect(parseSearchParams(schema, { limit: 'many' }).success).toBe(false)
  })
})

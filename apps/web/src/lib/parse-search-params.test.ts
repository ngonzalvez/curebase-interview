import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { parseSearchParams } from './parse-search-params.ts'

describe('parseSearchParams', () => {
  const schema = z.object({
    minBmi: z.coerce.number().optional(),
    limit: z.coerce.number().default(20),
  })

  // ----------------------------------------- TESTS -----------------------------------------------

  it('converts the values and fills in the defaults', async () => {
    const params = await parseSearchParams(Promise.resolve({ minBmi: '18.5' }), schema)

    expect(params).toEqual({ minBmi: 18.5, limit: 20 })
  })

  it('treats blank values as not set', async () => {
    const params = await parseSearchParams(Promise.resolve({ minBmi: '' }), schema)

    expect(params).toEqual({ limit: 20 })
  })

  it('throws when a value breaks the schema', async () => {
    await expect(parseSearchParams(Promise.resolve({ limit: 'many' }), schema)).rejects.toThrow()
  })
})

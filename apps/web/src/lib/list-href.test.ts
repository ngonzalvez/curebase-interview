import { describe, expect, it } from 'vitest'
import { listHref } from './list-href.ts'

describe('listHref', () => {
  const query = { minBmi: 18.5, sort: 'bmi', offset: 40 }

  // ----------------------------------------- TESTS -----------------------------------------------

  it('keeps the current page when only the page changes', () => {
    expect(listHref('/', query, { offset: 60 })).toBe('/?minBmi=18.5&sort=bmi&offset=60')
  })

  it('goes back to the first page when anything else changes', () => {
    expect(listHref('/', query, { sort: 'createdAt' })).toBe(
      '/?minBmi=18.5&sort=createdAt&offset=0',
    )
  })

  it('leaves out values that are not set', () => {
    expect(listHref('/visits', { minBmi: undefined, offset: 0 }, {})).toBe('/visits?offset=0')
  })
})

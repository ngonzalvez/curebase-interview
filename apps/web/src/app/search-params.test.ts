import { describe, expect, it } from 'vitest'
import { loadParticipantsParams, participantsHref } from './search-params.ts'

describe('participants URL parameters', () => {
  // ----------------------------------------- TESTS -----------------------------------------------

  it('reads the URL, falling back to the defaults for anything missing or unreadable', () => {
    expect(loadParticipantsParams('?minBmi=18.5&maxBmi=&limit=abc')).toEqual({
      minBmi: 18.5,
      maxBmi: null,
      sort: 'createdAt',
      order: 'desc',
      limit: 20,
      offset: 0,
    })
  })

  it('builds links that leave the defaults out of the URL', () => {
    const params = loadParticipantsParams('?minBmi=18.5')

    expect(participantsHref('/', { ...params, sort: 'bmi' })).toBe('/?minBmi=18.5&sort=bmi')
  })
})

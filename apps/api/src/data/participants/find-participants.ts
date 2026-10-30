import { and, asc, desc, gte, lte } from 'drizzle-orm'
import type { DbOrTx } from '../../plugins/database.ts'
import { participants } from '../tables/participants.ts'

type ParticipantSearch = {
  minBmi?: number
  maxBmi?: number
  sort: 'createdAt' | 'bmi'
  order: 'asc' | 'desc'
  limit: number
  offset: number
}

/**
 * Returns one page of participants and how many match in total. The id breaks ties,
 * so the same participant can't show up on two pages when several share a BMI or a
 * creation time.
 */
export async function findParticipants(db: DbOrTx, search: ParticipantSearch) {
  const where = and(
    search.minBmi === undefined ? undefined : gte(participants.bmi, search.minBmi),
    search.maxBmi === undefined ? undefined : lte(participants.bmi, search.maxBmi),
  )
  const direction = search.order === 'asc' ? asc : desc

  const [items, total] = await Promise.all([
    db
      .select()
      .from(participants)
      .where(where)
      .orderBy(direction(participants[search.sort]), participants.id)
      .limit(search.limit)
      .offset(search.offset),
    db.$count(participants, where),
  ])

  return { items, total }
}

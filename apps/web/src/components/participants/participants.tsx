import { ListParticipantsQuerySchema } from '@curebase/contracts/participants/list-participants'
import Link from 'next/link'
import { ApiError } from '../../api/api-error.ts'
import { listParticipants } from '../../api/list-participants.ts'
import { parseSearchParams } from '../../lib/parse-search-params.ts'
import { BmiFilter } from './bmi-filter.tsx'
import { Pagination } from './pagination.tsx'
import { ParticipantsTable } from './participants-table.tsx'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/**
 * The participants list: one page of the table, the links to the other pages and the
 * BMI filter. It renders on the server for every request, so the data is always
 * current, and filtering or paging is just following a link to a new URL.
 */
export async function Participants({ searchParams }: Props) {
  const parsed = parseSearchParams(ListParticipantsQuerySchema, await searchParams)
  if (!parsed.success) {
    return (
      <p role="alert">
        These filters aren&apos;t valid, for example the minimum BMI is above the maximum.{' '}
        <Link href="/">Clear filters</Link>
      </p>
    )
  }

  const query = parsed.data
  const page = await listParticipants(query).catch((error: unknown) => ({ error }))
  if ('error' in page) {
    const message =
      page.error instanceof ApiError ? page.error.message : 'The participants could not be loaded.'
    return <p role="alert">{message}</p>
  }

  return (
    <>
      <ParticipantsTable participants={page.items} query={query} />
      <Pagination query={query} total={page.total} />
      <BmiFilter query={query} />
    </>
  )
}

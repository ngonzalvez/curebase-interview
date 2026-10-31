import Link from 'next/link'
import { ApiError } from '../../api/api-error.ts'
import { listParticipants } from '../../api/list-participants.ts'
import { BmiFilter } from './bmi-filter.tsx'
import { Pagination } from './pagination.tsx'
import { loadParticipantsParams } from './participants-params.ts'
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
  const params = await loadParticipantsParams(searchParams)
  const page = await listParticipants(params).catch((error: unknown) => ({ error }))

  if ('error' in page) {
    if (page.error instanceof ApiError && page.error.status === 400) {
      return (
        <p role="alert">
          These filters aren&apos;t valid, for example the minimum BMI is above the maximum.{' '}
          <Link href="/">Clear filters</Link>
        </p>
      )
    }
    return <p role="alert">The participants could not be loaded. Please try again.</p>
  }

  return (
    <>
      <ParticipantsTable participants={page.items} params={params} />
      <Pagination params={params} total={page.total} />
      <BmiFilter params={params} />
    </>
  )
}

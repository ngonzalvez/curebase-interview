import { ListParticipantsQuerySchema } from '@curebase/contracts/participants/list-participants'
import Link from 'next/link'
import { listParticipants } from '../../api/list-participants.ts'
import { parseSearchParams } from '../../lib/parse-search-params.ts'
import { BmiFilter } from './bmi-filter.tsx'
import { Pagination } from './pagination.tsx'
import { ParticipantsTable } from './participants-table.tsx'

// It receives the page's own search parameters, so it borrows the type Next.js
// generates for the page.
type Props = Pick<PageProps<'/participants'>, 'searchParams'>

/**
 * The participants list: the BMI filter, one page of the table and the links to the
 * other pages. It renders on the server for every request, so the data is always
 * current, and filtering or paging is just following a link to a new URL.
 */
export async function Participants({ searchParams }: Props) {
  const query = await parseSearchParams(searchParams, ListParticipantsQuerySchema).catch(() => null)
  if (!query) {
    return (
      <p role="alert">
        These filters aren&apos;t valid, for example the minimum BMI is above the maximum.{' '}
        <Link href="/participants">Clear filters</Link>
      </p>
    )
  }

  const page = await listParticipants(query).catch(() => null)
  if (!page) {
    return <p role="alert">The participants could not be loaded. Please try again.</p>
  }

  return (
    <>
      <BmiFilter query={query} />
      <ParticipantsTable participants={page.items} query={query} />
      <Pagination query={query} total={page.total} />
    </>
  )
}

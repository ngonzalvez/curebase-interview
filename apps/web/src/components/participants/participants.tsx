import { ListParticipantsQuerySchema } from '@curebase/contracts/participants/list-participants'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { listParticipants } from '../../api/list-participants.ts'
import { parseSearchParams } from '../../lib/parse-search-params.ts'
import { parseUnits, UNITS_COOKIE } from '../../lib/units.ts'
import { BmiFilter } from './bmi-filter.tsx'
import { Pagination } from './pagination.tsx'
import { ParticipantsTable } from './participants-table.tsx'
import styles from './participants.module.css'
import { UnitSelector } from './unit-selector.tsx'

// It receives the page's own search parameters, so it borrows the type Next.js
// generates for the page.
type Props = Pick<PageProps<'/participants'>, 'searchParams'>

/**
 * The participants list: the toolbar with the BMI filter and the units, one page of the
 * table and the links to the other pages. It renders on the server for every request, so the data is always
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

  const units = parseUnits((await cookies()).get(UNITS_COOKIE)?.value)
  const page = await listParticipants(query).catch(() => null)
  if (!page) {
    return <p role="alert">The participants could not be loaded. Please try again.</p>
  }

  return (
    <>
      {/* The filter starts from the URL. Keying it on the filters resets it when the URL
          changes, like after Back or Clear, so it always shows what the list is filtered by. */}
      <div className={styles.toolbar}>
        <BmiFilter key={`${query.minBmi}-${query.maxBmi}`} query={query} />
        <UnitSelector units={units} />
      </div>
      <ParticipantsTable participants={page.items} query={query} units={units} />
      <Pagination query={query} total={page.total} />
    </>
  )
}

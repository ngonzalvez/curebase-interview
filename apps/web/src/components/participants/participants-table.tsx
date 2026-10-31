import type { ListParticipantsResponseSchema } from '@curebase/contracts/participants/list-participants'
import Link from 'next/link'
import type { z } from 'zod'
import type { ListParticipantsQuery } from '../../api/list-participants.ts'
import { LocalTime } from '../ui/local-time.tsx'
import styles from './participants.module.css'

type Participant = z.output<typeof ListParticipantsResponseSchema>['items'][number]

type Props = {
  participants: Participant[]
  query: ListParticipantsQuery
}

/**
 * One page of participants. BMI and registration date can be sorted by clicking their
 * headings; clicking the column that's already sorted flips the order.
 */
export function ParticipantsTable({ participants, query }: Props) {
  if (participants.length === 0) {
    return <p>No participants match these filters.</p>
  }

  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date of birth</th>
            <th>Weight (kg)</th>
            <th>Height (cm)</th>
            <SortableHeader column="bmi" label="BMI" query={query} />
            <SortableHeader column="createdAt" label="Created" query={query} />
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant.id}>
              <td>
                {participant.firstName} {participant.lastName}
              </td>
              <td>{participant.email}</td>
              <td>{participant.phone}</td>
              <td>{participant.birthDate}</td>
              <td>{participant.weightKg}</td>
              <td>{participant.heightCm}</td>
              <td>{participant.bmi.toFixed(1)}</td>
              <td>
                <LocalTime value={participant.createdAt} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type SortableHeaderProps = {
  column: ListParticipantsQuery['sort']
  label: string
  query: ListParticipantsQuery
}

/**
 * A column heading that sorts the list by that column. A new column starts with the
 * highest or newest first, and clicking the column that's already sorted flips it.
 * A new order starts again from the first page. The heading tells screen readers how it's sorted, so they don't read out the arrow.
 */
function SortableHeader({ column, label, query }: SortableHeaderProps) {
  const isSorted = query.sort === column
  const nextOrder = isSorted && query.order === 'desc' ? 'asc' : 'desc'
  const direction = query.order === 'asc' ? 'ascending' : 'descending'

  return (
    <th aria-sort={isSorted ? direction : undefined}>
      <Link href={{ query: { ...query, sort: column, order: nextOrder, offset: 0 } }}>
        {label}
        {isSorted && (query.order === 'asc' ? ' ↑' : ' ↓')}
      </Link>
    </th>
  )
}

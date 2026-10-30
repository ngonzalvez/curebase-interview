import type { ListParticipantsResponseSchema } from '@curebase/contracts/participants/list-participants'
import Link from 'next/link'
import type { z } from 'zod'
import type { ListParticipantsQuery } from '../../api/list-participants.ts'
import { listHref } from './list-query.ts'
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
            <th>
              <SortLink column="bmi" label="BMI (computed)" query={query} />
            </th>
            <th>
              <SortLink column="createdAt" label="Created" query={query} />
            </th>
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
              <td>{participant.createdAt.toLocaleString('en-US')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type SortLinkProps = {
  column: ListParticipantsQuery['sort']
  label: string
  query: ListParticipantsQuery
}

function SortLink({ column, label, query }: SortLinkProps) {
  const isSorted = query.sort === column
  const order = isSorted && query.order === 'desc' ? 'asc' : 'desc'
  const arrow = isSorted ? (query.order === 'desc' ? ' ↓' : ' ↑') : ''

  return (
    <Link href={listHref(query, { sort: column, order })}>
      {label}
      {arrow}
    </Link>
  )
}

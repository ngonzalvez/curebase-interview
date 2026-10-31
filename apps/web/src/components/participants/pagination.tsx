import Link from 'next/link'
import { type ParticipantsParams, participantsHref } from '../../app/search-params.ts'
import styles from './participants.module.css'

type Props = {
  params: ParticipantsParams
  total: number
}

/**
 * Shows which participants are on screen out of how many match, with links to the
 * previous and next pages. A link is left out when there's no page to go to.
 */
export function Pagination({ params, total }: Props) {
  if (total === 0) return null

  const { limit, offset } = params
  const first = offset + 1
  const last = Math.min(offset + limit, total)

  return (
    <nav className={styles.pagination} aria-label="Pages">
      {offset > 0 && (
        <Link href={participantsHref('/', { ...params, offset: Math.max(offset - limit, 0) })}>
          ← Previous
        </Link>
      )}
      <span>
        {first}–{last} of {total}
      </span>
      {last < total && (
        <Link href={participantsHref('/', { ...params, offset: offset + limit })}>Next →</Link>
      )}
    </nav>
  )
}

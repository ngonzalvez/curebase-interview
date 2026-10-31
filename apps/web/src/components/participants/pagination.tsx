import type { ListParticipantsQuery } from '../../api/list-participants.ts'
import { Button } from '../ui/button.tsx'
import { ButtonLink } from '../ui/button-link.tsx'
import styles from './participants.module.css'

type Props = {
  query: ListParticipantsQuery
  total: number
}

/**
 * Shows which participants are on screen out of how many match, with buttons to the
 * previous and next pages. Both buttons are always there, disabled when there's no page
 * to go to, so the bar doesn't shift around as you page through.
 */
export function Pagination({ query, total }: Props) {
  if (total === 0) return null

  const { limit, offset } = query
  const first = offset + 1
  const last = Math.min(offset + limit, total)

  return (
    <nav className={styles.pagination} aria-label="Pages">
      <span className={styles.count}>
        Showing {first}–{last} of {total}
      </span>
      <div className={styles.pages}>
        <PageButton
          label="← Previous"
          offset={offset > 0 ? Math.max(offset - limit, 0) : undefined}
          query={query}
        />
        <PageButton
          label="Next →"
          offset={last < total ? offset + limit : undefined}
          query={query}
        />
      </div>
    </nav>
  )
}

type PageButtonProps = {
  label: string
  offset: number | undefined
  query: ListParticipantsQuery
}

/**
 * A link to another page of the list, or a disabled button when there's no such page.
 */
function PageButton({ label, offset, query }: PageButtonProps) {
  if (offset === undefined) {
    return (
      <Button variant="subtle" size="small" type="button" disabled>
        {label}
      </Button>
    )
  }

  return (
    <ButtonLink variant="subtle" size="small" href={{ query: { ...query, offset } }}>
      {label}
    </ButtonLink>
  )
}

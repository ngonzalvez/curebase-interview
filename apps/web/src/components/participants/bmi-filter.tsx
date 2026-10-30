import Form from 'next/form'
import type { ListParticipantsQuery } from '../../api/list-participants.ts'
import styles from './participants.module.css'

/**
 * Filters the list by a BMI range. It's an ordinary GET form, so submitting it just
 * navigates to a URL like /?minBmi=18.5&maxBmi=25, which the list then reads. The
 * current sort is kept, and the list goes back to its first page.
 */
export function BmiFilter({ query }: { query: ListParticipantsQuery }) {
  return (
    <Form action="/" className={styles.filter}>
      <label>
        Min BMI
        <input name="minBmi" type="number" step="0.1" min="0" defaultValue={query.minBmi} placeholder="e.g. 18.5" />
      </label>
      <label>
        Max BMI
        <input name="maxBmi" type="number" step="0.1" min="0" defaultValue={query.maxBmi} placeholder="e.g. 24.9" />
      </label>
      <input type="hidden" name="sort" value={query.sort} />
      <input type="hidden" name="order" value={query.order} />
      <button type="submit">Filter</button>
    </Form>
  )
}

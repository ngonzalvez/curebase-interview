import Form from 'next/form'
import Link from 'next/link'
import type { ListParticipantsQuery } from '../../api/list-participants.ts'
import { Button } from '../ui/button.tsx'
import { Field } from '../ui/field.tsx'
import styles from './participants.module.css'

/**
 * The toolbar above the list, filtering it by a BMI range, with a way to clear the
 * filter once one is set. It's an ordinary GET form, so submitting it just
 * navigates to a URL like /participants?minBmi=18.5&maxBmi=25, which the list then reads. The
 * current sort is kept, and the list goes back to its first page.
 */
export function BmiFilter({ query }: { query: ListParticipantsQuery }) {
  return (
    // The inputs only read their default once. Keying the form on the current filters
    // rebuilds it when the URL changes, like after Back or Clear filters, so the inputs
    // always show what the list is actually filtered by.
    <Form key={`${query.minBmi}-${query.maxBmi}`} action="/participants" className={styles.filter}>
      <Field
        compact
        label="Min BMI"
        name="minBmi"
        type="number"
        step="0.1"
        min="0"
        defaultValue={query.minBmi}
        placeholder="e.g. 18.5"
      />
      <Field
        compact
        label="Max BMI"
        name="maxBmi"
        type="number"
        step="0.1"
        min="0"
        defaultValue={query.maxBmi}
        placeholder="e.g. 24.9"
      />
      <input type="hidden" name="sort" value={query.sort} />
      <input type="hidden" name="order" value={query.order} />
      <Button variant="subtle">Filter</Button>
      {(query.minBmi !== undefined || query.maxBmi !== undefined) && (
        <Link className={styles.clear} href="/participants">
          Clear
        </Link>
      )}
    </Form>
  )
}

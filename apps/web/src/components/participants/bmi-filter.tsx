import Form from 'next/form'
import { Button } from '../ui/button.tsx'
import { Field } from '../ui/field.tsx'
import type { ParticipantsParams } from '../../app/search-params.ts'
import styles from './participants.module.css'

/**
 * Filters the list by a BMI range. It's an ordinary GET form, so submitting it just
 * navigates to a URL like /?minBmi=18.5&maxBmi=25, which the list then reads. The
 * current sort is kept, and the list goes back to its first page.
 */
export function BmiFilter({ params }: { params: ParticipantsParams }) {
  return (
    <Form action="/" className={styles.filter}>
      <Field
        label="Min BMI"
        name="minBmi"
        type="number"
        step="0.1"
        min="0"
        defaultValue={params.minBmi ?? undefined}
        placeholder="e.g. 18.5"
      />
      <Field
        label="Max BMI"
        name="maxBmi"
        type="number"
        step="0.1"
        min="0"
        defaultValue={params.maxBmi ?? undefined}
        placeholder="e.g. 24.9"
      />
      <input type="hidden" name="sort" value={params.sort} />
      <input type="hidden" name="order" value={params.order} />
      <div>
        <Button variant="secondary">Filter</Button>
      </div>
    </Form>
  )
}

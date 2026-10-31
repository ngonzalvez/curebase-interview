'use client'

import Form from 'next/form'
import { useState } from 'react'
import type { ListParticipantsQuery } from '../../api/list-participants.ts'
import { Button } from '../ui/button.tsx'
import { ButtonLink } from '../ui/button-link.tsx'
import { Field } from '../ui/field.tsx'
import styles from './participants.module.css'

/**
 * The toolbar above the list, filtering it by a BMI range, with a way to clear the
 * filter once one is set. It's an ordinary GET form, so submitting it just navigates to
 * a URL like /participants?minBmi=18.5&maxBmi=25, which the list then reads. The
 * current sort is kept, and the list goes back to its first page.
 *
 * Each input limits the other as you type, so the browser itself stops a range whose
 * maximum is below its minimum and points at the field to fix. The API checks the same
 * rule, for anyone who edits the URL by hand.
 */
export function BmiFilter({ query }: { query: ListParticipantsQuery }) {
  const [minBmi, setMinBmi] = useState(query.minBmi?.toString() ?? '')
  const [maxBmi, setMaxBmi] = useState(query.maxBmi?.toString() ?? '')
  const isFiltered = query.minBmi !== undefined || query.maxBmi !== undefined

  return (
    <Form action="/participants" className={styles.filter}>
      <Field
        compact
        label="Min BMI"
        name="minBmi"
        type="number"
        step="0.1"
        min="0"
        max={maxBmi || undefined}
        value={minBmi}
        onChange={(event) => setMinBmi(event.target.value)}
        placeholder="e.g. 18.5"
      />
      <Field
        compact
        label="Max BMI"
        name="maxBmi"
        type="number"
        step="0.1"
        min={minBmi || '0'}
        value={maxBmi}
        onChange={(event) => setMaxBmi(event.target.value)}
        placeholder="e.g. 24.9"
      />
      <input type="hidden" name="sort" value={query.sort} />
      <input type="hidden" name="order" value={query.order} />
      <Button variant="subtle" size="small">
        Filter
      </Button>
      {isFiltered && (
        <ButtonLink variant="danger" size="small" href="/participants">
          Clear
        </ButtonLink>
      )}
    </Form>
  )
}

import type { ComponentProps } from 'react'
import styles from './field.module.css'

type Props = ComponentProps<'input'> & {
  label: string
  name: string
  error?: string
  compact?: boolean
}

/**
 * A labelled input with room for its error message underneath. The input is marked
 * invalid and linked to the message, so screen readers announce what's wrong. The
 * className goes on the outer label, so a layout can place the field where it wants.
 * Compact fields are smaller and quieter, for toolbars rather than forms.
 */
export function Field({ label, name, error, compact = false, className, ...input }: Props) {
  const errorId = `${name}-error`

  return (
    <label
      className={[styles.field, compact && styles.compact, className].filter(Boolean).join(' ')}
    >
      {label}
      <input
        className={styles.input}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...input}
      />
      {error && (
        <span id={errorId} role="alert">
          {error}
        </span>
      )}
    </label>
  )
}

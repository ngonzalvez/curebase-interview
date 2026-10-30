import type { ComponentProps } from 'react'

type Props = ComponentProps<'input'> & {
  label: string
  name: string
  error?: string
}

/**
 * A labelled input with room for its error message underneath. The input is marked
 * invalid and linked to the message, so screen readers announce what's wrong.
 */
export function Field({ label, name, error, ...input }: Props) {
  const errorId = `${name}-error`

  return (
    <label>
      {label}
      <input name={name} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...input} />
      {error && (
        <span id={errorId} role="alert">
          {error}
        </span>
      )}
    </label>
  )
}

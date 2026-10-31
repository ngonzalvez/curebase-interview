import Link from 'next/link'
import type { ComponentProps } from 'react'
import styles from './button.module.css'

type Props = ComponentProps<typeof Link> & {
  variant?: 'primary' | 'secondary' | 'subtle' | 'danger'
}

/**
 * A link that looks like a button, for actions that take you to another page, like
 * adding a participant or clearing the filters. It's still a real link, so it can be
 * opened in a new tab, and it comes in the same variants as Button.
 */
export function ButtonLink({ variant = 'primary', className, ...link }: Props) {
  return (
    <Link
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
      {...link}
    />
  )
}

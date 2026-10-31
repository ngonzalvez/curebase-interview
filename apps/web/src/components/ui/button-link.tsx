import Link from 'next/link'
import type { ComponentProps } from 'react'
import styles from './button.module.css'

/**
 * A link that looks like a primary button, for actions that take you to another page,
 * like adding a participant. It's still a real link, so it can be opened in a new tab.
 */
export function ButtonLink({ className, ...link }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={[styles.button, styles.primary, className].filter(Boolean).join(' ')}
      {...link}
    />
  )
}

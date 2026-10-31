import Link from 'next/link'
import type { ComponentProps } from 'react'
import { type ButtonStyle, buttonClassName } from './button.tsx'

/**
 * A link that looks like a button, for actions that take you to another page, like
 * adding a participant or clearing the filters. It's still a real link, so it can be
 * opened in a new tab, and it takes the same variants and sizes as Button.
 */
export function ButtonLink({
  variant,
  size,
  fullWidth,
  ...link
}: ButtonStyle & ComponentProps<typeof Link>) {
  return <Link className={buttonClassName({ variant, size, fullWidth })} {...link} />
}

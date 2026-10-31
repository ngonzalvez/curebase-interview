import type { ComponentProps } from 'react'
import styles from './button.module.css'

type Props = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'subtle'
  fullWidth?: boolean
}

/**
 * The app's button. Primary is for the main action on a screen, like saving, secondary
 * for smaller ones, and subtle for actions that shouldn't draw the eye, like filtering. It's a plain <button>, so it takes every
 * attribute a button does, and defaults to submitting its form.
 */
export function Button({
  variant = 'primary',
  fullWidth = false,
  type = 'submit',
  ...button
}: Props) {
  const className = [styles.button, styles[variant], fullWidth && styles.fullWidth]
    .filter(Boolean)
    .join(' ')
  return <button className={className} type={type} {...button} />
}

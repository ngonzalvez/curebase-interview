import type { ComponentProps } from 'react'
import styles from './button.module.css'

export type ButtonStyle = {
  variant?: 'primary' | 'secondary' | 'subtle' | 'danger'
  size?: 'medium' | 'small'
  fullWidth?: boolean
}

/**
 * The app's button. Primary is for the main action on a screen, like saving, secondary
 * for smaller ones, like filtering, subtle for actions that shouldn't draw the eye, and
 * danger for ones that undo or remove something, like clearing the filters. Small
 * buttons sit next to compact fields in toolbars.
 *
 * It's a plain <button>, so it takes every attribute a button does, and defaults to
 * submitting its form.
 */
export function Button({
  variant,
  size,
  fullWidth,
  type = 'submit',
  ...button
}: ButtonStyle & ComponentProps<'button'>) {
  return (
    <button className={buttonClassName({ variant, size, fullWidth })} type={type} {...button} />
  )
}

/**
 * The class names for a button style, shared with ButtonLink so a link styled as a
 * button looks exactly like one.
 */
export function buttonClassName({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
}: ButtonStyle) {
  return [
    styles.button,
    styles[variant],
    size === 'small' && styles.small,
    fullWidth && styles.fullWidth,
  ]
    .filter(Boolean)
    .join(' ')
}

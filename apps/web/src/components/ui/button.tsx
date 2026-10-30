import type { ComponentProps } from 'react'
import styles from './button.module.css'

/**
 * The app's one button style. It's a plain <button>, so it takes every attribute a
 * button does, and defaults to submitting its form.
 */
export function Button({ type = 'submit', ...button }: ComponentProps<'button'>) {
  return <button className={styles.button} type={type} {...button} />
}

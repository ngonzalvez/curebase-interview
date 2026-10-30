'use client'

import { useEffect } from 'react'
import styles from './toast.module.css'

type Props = {
  message: string
  onDismiss: () => void
}

const VISIBLE_FOR_MS = 4000

/**
 * A short confirmation that floats in the corner and goes away by itself after a few
 * seconds, or when it's closed. It's announced by screen readers without moving focus,
 * so it never interrupts what the user is doing. Showing a new message restarts the timer.
 */
export function Toast({ message, onDismiss }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, VISIBLE_FOR_MS)
    return () => clearTimeout(timer)
  }, [message, onDismiss])

  return (
    <div className={styles.toast} role="status">
      <span>{message}</span>
      <button className={styles.close} type="button" onClick={onDismiss} aria-label="Close">
        ×
      </button>
    </div>
  )
}

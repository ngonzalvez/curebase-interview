'use client'

import { useSyncExternalStore } from 'react'

/**
 * Shows a moment in the viewer's own time zone. Only the browser knows that zone, so
 * the server renders an empty <time> element carrying the exact moment, and the browser
 * fills in the text once the page loads. Rendering nothing on the server keeps its HTML
 * identical to the browser's first render, so React has nothing to correct.
 */
export function LocalTime({ value }: { value: Date }) {
  const isBrowser = useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  )

  return <time dateTime={value.toISOString()}>{isBrowser && value.toLocaleString()}</time>
}

/**
 * Whether we're in the browser never changes after the page loads, so there's nothing
 * to subscribe to.
 */
function neverChanges() {
  return () => {}
}

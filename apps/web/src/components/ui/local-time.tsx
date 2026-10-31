'use client'

import { useIsBrowser } from '../../hooks/use-is-browser.ts'

/**
 * Shows a moment in the viewer's own time zone. Only the browser knows that zone, so
 * the server renders an empty <time> element carrying the exact moment, and the browser
 * fills in the text once the page loads.
 */
export function LocalTime({ value }: { value: Date }) {
  const isBrowser = useIsBrowser()

  return <time dateTime={value.toISOString()}>{isBrowser && value.toLocaleString()}</time>
}

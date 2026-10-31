import { useSyncExternalStore } from 'react'

/**
 * Tells a component whether it's running in the browser. It's false on the server and
 * during the browser's first render, then true, so anything that only the browser
 * knows, like the viewer's time zone, can be shown without the server and browser
 * HTML disagreeing.
 *
 * React's hook for outside values wants a way to subscribe to changes, but being in the
 * browser never changes once the page has loaded, so the subscription does nothing.
 */
export function useIsBrowser() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

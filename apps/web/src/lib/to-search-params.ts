/**
 * Turns an object into URL parameters, leaving out anything that isn't set, so
 * optional filters don't show up in the URL as "undefined".
 */
export function toSearchParams(values: Record<string, string | number | undefined>) {
  const params = new URLSearchParams()
  for (const [name, value] of Object.entries(values)) {
    if (value !== undefined) params.set(name, String(value))
  }
  return params
}

import {
  createLoader,
  createSerializer,
  type inferParserType,
  parseAsFloat,
  parseAsInteger,
  parseAsStringLiteral,
} from 'nuqs/server'

/**
 * The list's filters, sort and page, kept in the URL so they survive a reload and can
 * be shared. nuqs turns each parameter into the right type, and anything blank or
 * unreadable becomes null or the default. It doesn't check the values make sense, like
 * a minimum above the maximum; the API does that, and the list shows its answer.
 *
 * The defaults match the API's, so leaving a parameter out means the same thing on
 * both sides, and links leave defaults out of the URL to keep it short.
 */
const participantsParams = {
  minBmi: parseAsFloat,
  maxBmi: parseAsFloat,
  sort: parseAsStringLiteral(['createdAt', 'bmi'] as const).withDefault('createdAt'),
  order: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('desc'),
  limit: parseAsInteger.withDefault(20),
  offset: parseAsInteger.withDefault(0),
}

export type ParticipantsParams = inferParserType<typeof participantsParams>

export const loadParticipantsParams = createLoader(participantsParams)

export const participantsHref = createSerializer(participantsParams, { clearOnDefault: true })

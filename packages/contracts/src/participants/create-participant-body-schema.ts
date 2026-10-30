import { ParticipantSchema } from '@curebase/domain/participants/participant-schema'

/**
 * The body of POST /participants: a participant, as the domain defines it. Unknown
 * fields are rejected rather than ignored, so a typo in a field name fails loudly
 * instead of quietly dropping data.
 */
export const CreateParticipantBodySchema = ParticipantSchema.strict()

import { ParticipantSchema } from '@curebase/domain/participants/participant-schema'
import { ParticipantResponseSchema } from './participant-response-schema.ts'

/**
 * The body of POST /participants: a participant, as the domain defines it. Unknown
 * fields are rejected rather than ignored, so a typo in a field name fails loudly
 * instead of quietly dropping data.
 */
export const CreateParticipantBodySchema = ParticipantSchema.strict()

/**
 * What POST /participants sends back: the participant as it was saved, with the id
 * and BMI that the database filled in.
 */
export const CreateParticipantResponseSchema = ParticipantResponseSchema

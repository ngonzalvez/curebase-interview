import { z } from 'zod'

/**
 * What makes a participant valid, wherever one is created or changed. Participants
 * register with their whole profile at once, so every field is required.
 *
 * Emails are stored in lowercase so the same person can't register twice with
 * different casing. Height and weight are metric and only need to be positive;
 * the form can accept other units, but converts them before sending.
 *
 * The messages are written for the person filling in the form, since the web app shows
 * them next to each field and the API sends the same ones back when a request is invalid.
 */
export const ParticipantSchema = z.object({
  email: z
    .email(messages('Email', 'Enter a valid email address'))
    .max(254, 'Email must be at most 254 characters')
    .toLowerCase(),
  firstName: z
    .string(messages('First name'))
    .trim()
    .min(1, 'First name is required')
    .max(100, 'First name must be at most 100 characters'),
  lastName: z
    .string(messages('Last name'))
    .trim()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be at most 100 characters'),
  phone: z
    .string(messages('Phone'))
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, 'Enter a valid phone number, like +1 555 010 0100'),
  birthDate: z.iso
    .date(messages('Date of birth', 'Enter a valid date'))
    .refine(isNotInTheFuture, "Date of birth can't be in the future"),
  heightCm: z
    .number(messages('Height', 'Height must be a number'))
    .positive('Height must be greater than 0'),
  weightKg: z
    .number(messages('Weight', 'Weight must be a number'))
    .positive('Weight must be greater than 0'),
})

// A field that's missing gets "<label> is required"; one of the wrong kind gets the
// message given for it, like "Enter a valid email address".
function messages(label: string, invalid = `${label} is required`) {
  return {
    error: (issue: { input?: unknown }) =>
      issue.input === undefined ? `${label} is required` : invalid,
  }
}

function isNotInTheFuture(isoDate: string) {
  return isoDate <= new Date().toISOString().slice(0, 10)
}

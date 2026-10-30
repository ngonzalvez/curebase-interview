'use client'

import { CreateParticipantBodySchema } from '@curebase/contracts/participants/create-participant'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'
import { ApiError } from '../../api/api-error.ts'
import { registerParticipant } from '../../api/register-participant.ts'
import { Button } from '../ui/button.tsx'
import { Field } from '../ui/field.tsx'
import styles from './registration-form.module.css'
import { toParticipantData, type Units } from './to-participant-data.ts'

type FieldErrors = Record<string, string>

/**
 * The form staff use to register a participant. It checks the data with the same
 * schema as the API, so most mistakes are caught before anything is sent. The API
 * still has the final word: a duplicate email or anything the browser missed comes
 * back as an error and is shown next to the field it belongs to. After a successful
 * registration the form clears and the list below refreshes.
 */
export function RegistrationForm() {
  const router = useRouter()
  const [units, setUnits] = useState<Units>('metric')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [message, setMessage] = useState<{ text: string; isError: boolean }>()
  const [isSaving, setIsSaving] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setMessage(undefined)

    const parsed = CreateParticipantBodySchema.safeParse(
      toParticipantData(new FormData(form), units),
    )
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
        ),
      )
      return
    }

    setIsSaving(true)
    try {
      const participant = await registerParticipant(parsed.data)
      form.reset()
      setErrors({})
      setMessage({
        text: `${participant.firstName} ${participant.lastName} was registered.`,
        isError: false,
      })
      router.refresh()
    } catch (error) {
      if (!(error instanceof ApiError)) {
        setMessage({ text: 'The server could not be reached. Please try again.', isError: true })
        return
      }
      setErrors(Object.fromEntries(error.fieldErrors.map(({ path, message }) => [path, message])))
      setMessage({ text: error.message, isError: true })
    } finally {
      setIsSaving(false)
    }
  }

  const height = units === 'metric' ? 'Height (cm)' : 'Height (in)'
  const weight = units === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <Field
        className={styles.half}
        label="First name"
        name="firstName"
        error={errors.firstName}
        autoComplete="off"
      />
      <Field
        className={styles.half}
        label="Last name"
        name="lastName"
        error={errors.lastName}
        autoComplete="off"
      />
      <Field
        className={styles.half}
        label="Email"
        name="email"
        type="email"
        error={errors.email}
        autoComplete="off"
      />
      <Field
        className={styles.half}
        label="Phone"
        name="phone"
        type="tel"
        error={errors.phone}
        autoComplete="off"
      />

      <fieldset className={styles.units}>
        <legend>Units</legend>
        <label className={styles.unit}>
          <input type="radio" checked={units === 'metric'} onChange={() => setUnits('metric')} /> cm
          / kg
        </label>
        <label className={styles.unit}>
          <input
            type="radio"
            checked={units === 'imperial'}
            onChange={() => setUnits('imperial')}
          />{' '}
          in / lbs
        </label>
      </fieldset>

      <Field
        className={styles.third}
        label={weight}
        name="weight"
        type="number"
        step="0.1"
        min="0"
        error={errors.weightKg}
      />
      <Field
        className={styles.third}
        label={height}
        name="height"
        type="number"
        step="0.1"
        min="0"
        error={errors.heightCm}
      />
      <Field
        className={styles.third}
        label="Date of birth"
        name="birthDate"
        type="date"
        error={errors.birthDate}
      />

      <div className={styles.actions}>
        <Button fullWidth disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save Participant'}
        </Button>
        {message && <p role={message.isError ? 'alert' : 'status'}>{message.text}</p>}
      </div>
    </form>
  )
}

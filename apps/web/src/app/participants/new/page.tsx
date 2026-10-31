import Link from 'next/link'
import { RegistrationForm } from '../../../components/registration/registration-form.tsx'
import styles from './page.module.css'

/**
 * Where staff register a new participant. After each registration the form clears,
 * so several participants can be entered one after another.
 */
export default function NewParticipantPage() {
  return (
    <>
      <div className={styles.heading}>
        <Link className={styles.back} href="/participants">
          ← Participants
        </Link>
        <h1>Register a participant</h1>
      </div>

      <RegistrationForm />
    </>
  )
}

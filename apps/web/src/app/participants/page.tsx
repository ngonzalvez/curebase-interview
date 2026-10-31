import { Suspense } from 'react'
import { Participants } from '../../components/participants/participants.tsx'
import { RegistrationForm } from '../../components/registration/registration-form.tsx'
import styles from './page.module.css'

/**
 * The participants page: staff register participants at the top and browse them below.
 * The list waits on the URL and the API, so it streams in behind a loading message
 * while the rest of the page shows right away.
 */
export default function ParticipantsPage({ searchParams }: PageProps<'/participants'>) {
  return (
    <main className={styles.main}>
      <h1>Clinical Trial Participant Capture</h1>

      <RegistrationForm />

      <section>
        <h2>Participants</h2>
        <Suspense fallback={<p>Loading participants…</p>}>
          <Participants searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  )
}

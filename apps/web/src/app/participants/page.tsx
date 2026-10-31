import { Suspense } from 'react'
import { Participants } from '../../components/participants/participants.tsx'
import { ButtonLink } from '../../components/ui/button-link.tsx'
import styles from './page.module.css'

/**
 * The list of registered participants, with a way to add a new one. The list waits on
 * the URL and the API, so it streams in behind a loading message while the title and
 * the button show right away.
 */
export default function ParticipantsPage({ searchParams }: PageProps<'/participants'>) {
  return (
    <>
      <div className={styles.heading}>
        <h1>Participants</h1>
        <ButtonLink href="/participants/new">Add participant</ButtonLink>
      </div>

      <Suspense fallback={<p>Loading participants…</p>}>
        <Participants searchParams={searchParams} />
      </Suspense>
    </>
  )
}

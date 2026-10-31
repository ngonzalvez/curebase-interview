'use client'

import { useRouter } from 'next/navigation'
import { saveUnits, unitLabels, type Units } from '../../lib/units.ts'
import styles from './participants.module.css'

/**
 * Switches the list between metric and imperial units. The choice is a personal
 * preference, so it's kept in a cookie for a year rather than in the URL: it sticks
 * across visits and doesn't need to travel with every filter and page link. After
 * saving it, the list is rendered again on the server in the new units.
 */
export function UnitSelector({ units }: { units: Units }) {
  const router = useRouter()

  function choose(next: Units) {
    saveUnits(next)
    router.refresh()
  }

  return (
    <div className={styles.unitSelector} role="group" aria-label="Units">
      {(['metric', 'imperial'] as const).map((option) => (
        <button
          key={option}
          type="button"
          className={styles.unit}
          aria-pressed={units === option}
          onClick={() => choose(option)}
        >
          {unitLabels[option].height} / {unitLabels[option].weight}
        </button>
      ))}
    </div>
  )
}

import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import styles from './layout.module.css'

// next/font serves the font from our own domain and exposes it as a CSS variable,
// which typography.css picks up.
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Clinical Trial Participant Capture',
  description: 'Register clinical trial participants and browse them by BMI.',
}

/**
 * The HTML shell around every page: the language, the font, the global styles and the
 * app's name at the top, which always leads back to the participants.
 */
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>
        <div className={styles.shell}>
          <header>
            <Link className={styles.appName} href="/participants">
              Clinical Trial Participant Capture
            </Link>
          </header>
          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  )
}

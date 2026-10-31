import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
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
 * page width.
 */
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  )
}

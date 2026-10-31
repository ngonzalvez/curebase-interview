import type { NextConfig } from 'next'

// Every app reads the same .env at the root of the repo. In CI or production there's
// no file, and the variables come from the environment instead.
try {
  process.loadEnvFile('../../.env')
} catch {}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The shared packages are plain TypeScript, so Next.js has to compile them too.
  transpilePackages: ['@curebase/contracts', '@curebase/domain'],

  // There's no homepage yet, so the root sends staff straight to the participants.
  // It's temporary, so a real homepage can take over the URL later.
  async redirects() {
    return [{ source: '/', destination: '/participants', permanent: false }]
  },
}

export default nextConfig

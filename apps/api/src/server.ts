import { buildApp } from './app.ts'

const app = buildApp()

// Port moves to config.ts in the next step.
await app.listen({ port: 3001, host: '0.0.0.0' })

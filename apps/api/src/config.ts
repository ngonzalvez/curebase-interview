import { z } from 'zod'

const EnvSchema = z.object({
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().positive().default(3001),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  WEB_ORIGIN: z.url(),
})

export type Config = {
  host: string
  port: number
  logLevel: z.infer<typeof EnvSchema>['LOG_LEVEL']
  webOrigin: string
}

// The only place in the API that reads process.env.
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = EnvSchema.parse(env)

  return {
    host: parsed.HOST,
    port: parsed.PORT,
    logLevel: parsed.LOG_LEVEL,
    webOrigin: parsed.WEB_ORIGIN,
  }
}

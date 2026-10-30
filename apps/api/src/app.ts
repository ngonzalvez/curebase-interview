import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import type { Config } from './config.ts'
import { sendErrorResponse } from './errors/send-error-response.ts'
import { errorHandler } from './plugins/error-handler.ts'
import { healthRoutes } from './routes/health/index.ts'

// Builds the app without starting it, so tests can call it with app.inject().
// The config is passed in, so tests never depend on environment variables.
export function buildApp(config: Config) {
  // Logging: Fastify's request logs omit headers and bodies by default.
  // The redact list masks sensitive fields if anything logs them by hand.
  const app = Fastify({
    logger: {
      level: config.logLevel,
      redact: ['req.headers.authorization', 'req.headers.cookie', '*.email', '*.password'],
    },
  }).withTypeProvider<ZodTypeProvider>()

  // Schemas: routes declare Zod schemas. Requests are validated against them,
  // and responses are serialized through them, which drops undeclared fields.
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  // Errors: every error and unknown route returns an RFC 9457 Problem Details body.
  app.setErrorHandler(errorHandler)
  app.setNotFoundHandler((_request, reply) => sendErrorResponse(reply, { status: 404 }))

  // Security: secure response headers, CORS limited to the web app's origin,
  // and a per-client request limit.
  app.register(helmet)
  app.register(cors, { origin: config.webOrigin })
  app.register(rateLimit, { max: 100, timeWindow: '1 minute' })

  // Routes: one plugin per resource.
  app.register(healthRoutes)

  return app
}

export type App = ReturnType<typeof buildApp>

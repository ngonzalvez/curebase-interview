import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import type { Config } from './config.ts'
import { sendErrorResponse } from './errors/send-error-response.ts'
import { databasePlugin } from './plugins/database.ts'
import { errorHandler } from './plugins/error-handler.ts'
import { healthRoutes } from './routes/health/index.ts'
import { participantRoutes } from './routes/participants/index.ts'

/**
 * Builds the API with everything wired up, but doesn't start listening. That's what
 * lets tests send requests with app.inject() and no real server. The config comes
 * in as an argument, so tests never depend on environment variables either.
 */
export function buildApp(config: Config) {
  // Logging: Fastify's request logs omit headers and bodies by default.
  // The redact list masks sensitive fields if anything logs them by hand.
  const app = Fastify({
    logger: {
      level: config.logLevel,
      redact: ['req.headers.authorization', 'req.headers.cookie', '*.email', '*.password'],
    },
  }).withTypeProvider<ZodTypeProvider>()

  // Database: endpoints reach Postgres through app.db (request.server.db).
  app.register(databasePlugin, { url: config.databaseUrl })

  // Schemas: each route declares Zod schemas for what it accepts and what it returns.
  // Requests that don't match are rejected, and any response field the schema doesn't
  // declare is dropped before it leaves the API.
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
  app.register(participantRoutes)

  return app
}

export type App = ReturnType<typeof buildApp>

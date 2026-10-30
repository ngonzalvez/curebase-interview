import type { FastifyInstance } from 'fastify'
import { getHealthEndpoint } from './get-health-endpoint.ts'

/**
 * Registers the health check route.
 */
export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', getHealthEndpoint)
}

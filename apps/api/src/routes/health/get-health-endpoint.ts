/**
 * Lets a load balancer or uptime check know the API process is up and answering.
 * It doesn't touch the database, so it says nothing about whether Postgres is reachable.
 */
export const getHealthEndpoint = {
  async handler() {
    return { status: 'ok' }
  },
}

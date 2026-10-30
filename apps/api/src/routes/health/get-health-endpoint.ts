/**
 * Lets a load balancer or uptime check know the API process is up and answering.
 * It doesn't touch the database, so it says nothing about whether Postgres is reachable.
 */
export async function getHealthEndpoint() {
  return { status: 'ok' }
}

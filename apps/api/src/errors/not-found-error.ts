import { AppError } from './app-error.ts'

/**
 * Thrown when the record a request points to doesn't exist. The client gets a 404,
 * with a generic message unless a more specific one helps.
 */
export class NotFoundError extends AppError {
  constructor(message = 'The resource was not found.') {
    super(404, message)
  }
}

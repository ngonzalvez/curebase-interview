import { AppError } from './app-error.ts'

/**
 * Thrown when a request clashes with data that already exists, like signing up with
 * an email that's taken. The client gets a 409 with the message.
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message)
  }
}

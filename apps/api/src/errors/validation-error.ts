import { AppError, type FieldError } from './app-error.ts'

/**
 * Thrown when a request is well formed but breaks a rule that schemas alone can't
 * check. The client gets a 400 listing which fields are wrong and why.
 */
export class ValidationError extends AppError {
  constructor(errors: FieldError[]) {
    super(400, 'The request is invalid.', errors)
  }
}

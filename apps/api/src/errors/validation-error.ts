import { AppError, type FieldError } from './app-error.ts'

export class ValidationError extends AppError {
  constructor(errors: FieldError[]) {
    super(400, 'The request is invalid.', errors)
  }
}

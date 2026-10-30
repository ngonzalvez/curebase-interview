import { AppError } from './app-error.ts'

export class NotFoundError extends AppError {
  constructor(message = 'The resource was not found.') {
    super(404, message)
  }
}

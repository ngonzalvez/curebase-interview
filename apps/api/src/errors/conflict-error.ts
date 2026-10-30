import { AppError } from './app-error.ts'

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message)
  }
}

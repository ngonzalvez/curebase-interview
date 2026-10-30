export type FieldError = { path: string; message: string }

// Base class for errors whose status and message are safe to send to clients.
export class AppError extends Error {
  readonly statusCode: number
  readonly errors: FieldError[]

  constructor(statusCode: number, message: string, errors: FieldError[] = []) {
    super(message)
    this.name = new.target.name
    this.statusCode = statusCode
    this.errors = errors
  }
}

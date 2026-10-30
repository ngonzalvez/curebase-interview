export type FieldError = { path: string; message: string }

/**
 * The base for errors we throw on purpose. Their status and message are written for
 * the client, so the error handler sends them as they are, along with any field errors.
 */
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

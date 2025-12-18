/**
 * ValidationException
 *
 * Custom exception thrown when input validation fails or business rules are violated.
 * Returns 400 HTTP status code when caught by error handling middleware.
 *
 * @example
 * throw new ValidationException('Email address is required')
 *
 * @example
 * throw new ValidationException('Invalid status transition', {
 *   currentStatus: 'FEASIBILITY',
 *   attemptedStatus: 'PAID_OFF',
 *   allowedStatuses: ['GO', 'PASS', 'CLOSED']
 * })
 */
export class ValidationException extends Error {
  public readonly statusCode: number = 400;
  public readonly isOperational: boolean = true;
  public readonly details?: any;

  /**
   * Create a ValidationException
   * @param message - Description of the validation failure
   * @param details - Optional additional context about the validation failure
   */
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationException';
    this.details = details;

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationException);
    }
  }
}

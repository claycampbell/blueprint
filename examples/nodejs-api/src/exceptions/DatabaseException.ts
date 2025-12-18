/**
 * DatabaseException
 *
 * Custom exception thrown when database operations fail.
 * Returns 500 HTTP status code when caught by error handling middleware.
 *
 * Wraps underlying database errors (e.g., pg errors) with additional context.
 *
 * @example
 * catch (error) {
 *   throw new DatabaseException('Failed to create project', error)
 * }
 *
 * @example
 * throw new DatabaseException('Transaction rollback failed', originalError, {
 *   operation: 'createLoanWithGuarantors',
 *   loanId: '123',
 *   guarantorCount: 3
 * })
 */
export class DatabaseException extends Error {
  public readonly statusCode: number = 500;
  public readonly isOperational: boolean = true;
  public readonly originalError?: Error;
  public readonly context?: any;

  /**
   * Create a DatabaseException
   * @param message - High-level description of what database operation failed
   * @param originalError - The underlying database error (e.g., from pg library)
   * @param context - Optional additional context about the operation
   */
  constructor(message: string, originalError?: Error, context?: any) {
    // Include original error message if available
    const fullMessage = originalError
      ? `${message}: ${originalError.message}`
      : message;

    super(fullMessage);
    this.name = 'DatabaseException';
    this.originalError = originalError;
    this.context = context;

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseException);
    }
  }
}

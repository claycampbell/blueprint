/**
 * NotFoundException
 *
 * Custom exception thrown when a requested entity is not found in the database.
 * Returns 404 HTTP status code when caught by error handling middleware.
 *
 * @example
 * throw new NotFoundException('Project', '123e4567-e89b-12d3-a456-426614174000')
 * // "Project with ID 123e4567-e89b-12d3-a456-426614174000 not found"
 *
 * @example
 * throw new NotFoundException('User not found with email: john@example.com')
 * // Custom message format
 */
export class NotFoundException extends Error {
  public readonly statusCode: number = 404;
  public readonly isOperational: boolean = true;

  /**
   * Create a NotFoundException
   * @param entityNameOrMessage - Either the entity name (e.g., 'Project') or a full error message
   * @param entityId - Optional entity ID (used when first param is entity name)
   */
  constructor(entityNameOrMessage: string, entityId?: string) {
    // If entityId provided, format as standard "Entity with ID X not found" message
    // Otherwise, use the first parameter as the full message
    const message = entityId
      ? `${entityNameOrMessage} with ID ${entityId} not found`
      : entityNameOrMessage;

    super(message);
    this.name = 'NotFoundException';

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundException);
    }
  }
}

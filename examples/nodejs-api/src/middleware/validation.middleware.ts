/**
 * Validation Middleware
 *
 * Express middleware for automatic DTO validation using class-validator.
 * Validates request body/query against DTO classes and returns 400 if invalid.
 *
 * @example
 * // In routes:
 * router.post('/', validate(CreateProjectDTO), createProjectHandler)
 * router.get('/', validateQuery(ProjectQueryDTO), listProjectsHandler)
 */

import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate as classValidate, ValidationError } from 'class-validator';

/**
 * Validation source - where to get data from request
 */
export type ValidationSource = 'body' | 'query' | 'params';

/**
 * Format validation errors into user-friendly messages
 *
 * @param errors - Array of validation errors from class-validator
 * @returns Array of formatted error messages
 */
function formatValidationErrors(errors: ValidationError[]): string[] {
  const messages: string[] = [];

  errors.forEach((error) => {
    if (error.constraints) {
      messages.push(...Object.values(error.constraints));
    }

    // Handle nested validation errors
    if (error.children && error.children.length > 0) {
      const nestedMessages = formatValidationErrors(error.children);
      messages.push(...nestedMessages.map((msg) => `${error.property}.${msg}`));
    }
  });

  return messages;
}

/**
 * Create a validation middleware for a DTO class
 *
 * @param dtoClass - The DTO class to validate against
 * @param source - Where to get data from ('body', 'query', 'params')
 * @returns Express middleware function
 *
 * @example
 * router.post('/projects', validate(CreateProjectDTO), handler)
 * router.get('/projects', validate(ProjectQueryDTO, 'query'), handler)
 */
export function validate(
  dtoClass: any,
  source: ValidationSource = 'body'
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get data from specified source
      const data = req[source];

      // Transform plain object to DTO instance
      const dtoInstance = plainToInstance(dtoClass, data, {
        enableImplicitConversion: true, // Auto-convert strings to numbers, etc.
        excludeExtraneousValues: false,
      });

      // Validate the DTO instance
      const errors = await classValidate(dtoInstance, {
        whitelist: true, // Strip properties that don't have decorators
        forbidNonWhitelisted: false,
        skipMissingProperties: false,
        validationError: { target: false, value: false }, // Don't expose values in errors
      });

      // If validation errors exist, return 400
      if (errors.length > 0) {
        const messages = formatValidationErrors(errors);
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: messages,
        }) as any;
      }

      // Attach validated DTO to request for use in handlers
      (req as any).dto = dtoInstance;

      next();
    } catch (error) {
      console.error('Validation middleware error:', error);
      res.status(500).json({
        success: false,
        error: 'Validation processing failed',
      });
    }
  };
}

/**
 * Convenience function for validating request body
 *
 * @param dtoClass - The DTO class to validate against
 * @returns Express middleware function
 *
 * @example
 * router.post('/projects', validateBody(CreateProjectDTO), handler)
 */
export function validateBody(dtoClass: any) {
  return validate(dtoClass, 'body');
}

/**
 * Convenience function for validating query parameters
 *
 * @param dtoClass - The DTO class to validate against
 * @returns Express middleware function
 *
 * @example
 * router.get('/projects', validateQuery(ProjectQueryDTO), handler)
 */
export function validateQuery(dtoClass: any) {
  return validate(dtoClass, 'query');
}

/**
 * Convenience function for validating route parameters
 *
 * @param dtoClass - The DTO class to validate against
 * @returns Express middleware function
 *
 * @example
 * router.get('/projects/:id', validateParams(ProjectIdParamDTO), handler)
 */
export function validateParams(dtoClass: any) {
  return validate(dtoClass, 'params');
}

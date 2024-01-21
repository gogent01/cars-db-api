import { NextFunction, Request, Response } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import { ValidationException } from '../errors/ValidationException';

export class ValidationMiddleware {
  processValidationErrors(req: Request, res: Response, next: NextFunction): void {
    const validationErrors: ValidationError[] = validationResult(req).array();
    if (validationErrors.length > 0) {
      return next(new ValidationException(validationErrors));
    }
    return next();
  }
}

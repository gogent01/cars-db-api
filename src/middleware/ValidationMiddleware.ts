import { NextFunction, Request, Response } from 'express';
import { FieldValidationError, ValidationError, validationResult } from 'express-validator';
import { ValidationException } from '../errors/ValidationException';

export class ValidationMiddleware {
  required(body: string[]) {
    return function (req: Request, res: Response, next: NextFunction) {
      const validationErrors: FieldValidationError[] = [];
      for (const field of body) {
        if (!req.body.hasOwnProperty(field)) {
          validationErrors.push({
            type: 'field',
            path: field,
            msg: `${field}_is_required`,
            location: 'body',
            value: undefined,
          });
        }
      }

      if (validationErrors.length > 0) {
        return next(new ValidationException(validationErrors));
      }

      return next();
    };
  }

  processValidationErrors(req: Request, res: Response, next: NextFunction): void {
    const validationErrors: ValidationError[] = validationResult(req).array();
    if (validationErrors.length > 0) {
      return next(new ValidationException(validationErrors));
    }
    return next();
  }
}

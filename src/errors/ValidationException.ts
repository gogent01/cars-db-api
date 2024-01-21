import { ExpressError } from './ExpressError';
import { ValidationError } from 'express-validator';

export class ValidationException extends ExpressError {
  constructor(errors: ValidationError[], message: string = 'validation_failure') {
    super(422, message, errors);
  }
}

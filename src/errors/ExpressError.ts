import { ValidationError } from 'express-validator';

interface ErrorResponseBody {
  path: string;
  timestamp: number;
  message: string;
  details?: ValidationFailure[];
}

interface ValidationFailure {
  field: string;
  message: string;
}

export class ExpressError {
  readonly status: number;
  readonly message: string;
  readonly details: ValidationFailure[];

  constructor(status: number, message: string, validationErrors: ValidationError[] = []) {
    this.status = status;
    this.message = message;

    if (validationErrors) {
      this.details = validationErrors.map((validationError) => {
        if (validationError.type === 'field') {
          return {
            field: validationError.path,
            message: validationError.msg,
          };
        } else if (validationError.type === 'unknown_fields') {
          return {
            field: 'unknown_fields',
            message: validationError.msg,
          };
        } else {
          return {
            field: 'validation_error',
            message: validationError.msg,
          };
        }
      });
    }
  }

  toResponseBody(originalUrl: string): ErrorResponseBody {
    return {
      path: originalUrl,
      timestamp: new Date().getTime(),
      message: this.message,
      details: this.details.length > 0 ? this.details : undefined,
    };
  }
}

import { check, ValidationChain } from 'express-validator';

export class UserValidationMiddleware {
  email: ValidationChain = check('email')
    .trim()
    .notEmpty()
    .withMessage('email_invalid')
    .bail()
    .isEmail()
    .withMessage('email_invalid')
    .bail()
    .normalizeEmail({ gmail_remove_dots: false });

  password: ValidationChain = check('password')
    .trim()
    .notEmpty()
    .withMessage('password_invalid')
    .bail()
    .isLength({ min: 6, max: 32 })
    .withMessage('password_size');
}

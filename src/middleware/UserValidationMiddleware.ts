import { check, ValidationChain } from 'express-validator';

export class UserValidationMiddleware {
  email: ValidationChain = check('email')
    .exists()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('email_required')
    .bail()
    .isEmail()
    .withMessage('email_invalid')
    .bail()
    .normalizeEmail({ gmail_remove_dots: false });

  password: ValidationChain = check('password')
    .exists()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('password_required')
    .bail()
    .isLength({ min: 6, max: 32 })
    .withMessage('password_size');
}

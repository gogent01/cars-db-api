import { check, param, ValidationChain } from 'express-validator';

export class CarValidationMiddleware {
  carId: ValidationChain = param('carId')
    .trim()
    .notEmpty()
    .withMessage('id_required')
    .bail()
    .custom((value: string) => {
      return value.match(/^[0-9a-fA-F]{24}$/);
    })
    .withMessage('id_invalid')
    .bail();

  brand: ValidationChain = check('brand')
    .trim()
    .notEmpty()
    .withMessage('brand_required')
    .bail()
    .isString()
    .isLength({ max: 64 })
    .withMessage('brand_invalid')
    .bail();

  model: ValidationChain = check('model')
    .trim()
    .notEmpty()
    .withMessage('model_required')
    .bail()
    .isString()
    .isLength({ max: 64 })
    .withMessage('model_invalid')
    .bail();

  year: ValidationChain = check('year')
    .trim()
    .notEmpty()
    .withMessage('year_required')
    .bail()
    .isInt({ min: 1886, max: new Date().getFullYear() })
    .withMessage('year_invalid')
    .bail();

  price: ValidationChain = check('price')
    .trim()
    .notEmpty()
    .withMessage('price_required')
    .bail()
    .isInt({ min: 0, max: 10 ** 9 })
    .withMessage('price_invalid')
    .bail();

  sort: ValidationChain = check('sort')
    .optional()
    .isString()
    .trim()
    .custom((value) => {
      return typeof value === 'string' && ['brand', 'model', 'year', 'price'].includes(value);
    })
    .withMessage('sort_field_invalid')
    .bail();

  direction: ValidationChain = check('direction')
    .optional()
    .isString()
    .trim()
    .custom((value) => {
      return typeof value === 'string' && ['ASC', 'DESC'].includes(value);
    })
    .withMessage('sort_direction_invalid')
    .bail();
}

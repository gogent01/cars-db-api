import express from 'express';
import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { CarValidationMiddleware } from '../middleware/CarValidationMiddleware';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware';

const CarRouter = express.Router();
const auth = new AuthMiddleware();
const carChecks = new CarValidationMiddleware();
const validation = new ValidationMiddleware();

CarRouter.get(
  '/api/v1/cars',
  auth.onlyAuth,
  carChecks.brand.optional(),
  carChecks.model.optional(),
  carChecks.year.optional(),
  carChecks.price.optional(),
  carChecks.sort,
  carChecks.direction,
  validation.processValidationErrors,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    return res.status(405).send();
  }
);

CarRouter.post(
  '/api/v1/cars',
  auth.onlyAuth,
  carChecks.brand,
  carChecks.model,
  carChecks.year,
  carChecks.price,
  validation.processValidationErrors,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    return res.status(405).send();
  }
);

CarRouter.put(
  '/api/v1/cars/:carId',
  auth.onlyAuth,
  carChecks.carId,
  carChecks.brand,
  carChecks.model,
  carChecks.year,
  carChecks.price,
  validation.processValidationErrors,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    return res.status(405).send();
  }
);

CarRouter.delete(
  '/api/v1/cars/:carId',
  auth.onlyAuth,
  carChecks.carId,
  validation.processValidationErrors,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    return res.status(405).send();
  }
);

export { CarRouter };

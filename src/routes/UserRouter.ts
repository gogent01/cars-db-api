import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { UserValidationMiddleware } from '../middleware/UserValidationMiddleware';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware';

const UserRouter = express.Router();
const userChecks = new UserValidationMiddleware();
const validation = new ValidationMiddleware();

UserRouter.post(
  'api/v1/user/auth',
  userChecks.email,
  userChecks.password,
  validation.processValidationErrors,
  (req: Request, res: Response) => {
    return res.status(405).send();
  }
);

export { UserRouter };

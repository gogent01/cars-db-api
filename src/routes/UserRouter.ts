import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { UserValidationMiddleware } from '../middleware/UserValidationMiddleware';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware';
import { MongoUserCtrl } from '../controllers/MongoUserCtrl';
import { NotFoundException } from '../errors/NotFoundException';
import { InternalServerErrorException } from '../errors/InternalServerErrorException';

const UserRouter = express.Router();
const userChecks = new UserValidationMiddleware();
const validation = new ValidationMiddleware();

UserRouter.post(
  'api/v1/user/auth',
  userChecks.email,
  userChecks.password,
  validation.processValidationErrors,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const userCtrl = new MongoUserCtrl();
    const token = await userCtrl.login({ email, password }).catch((error) => {
      if (error.message === 'user_not_found') return next(new NotFoundException('user_not_found'));
      else return next(new InternalServerErrorException());
    });

    return res.json({ token });
  }
);

export { UserRouter };

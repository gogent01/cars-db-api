import express from 'express';
import type { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AuthMiddleware } from '../services/AuthMiddleware';

const CarRouter = express.Router();
const auth = new AuthMiddleware();

CarRouter.get('/api/v1/cars', auth.onlyAuth, (req: AuthRequest, res: Response, next: NextFunction) => {
  return res.status(405).send();
});

CarRouter.post('/api/v1/cars', auth.onlyAuth, (req: AuthRequest, res: Response, next: NextFunction) => {
  return res.status(405).send();
});

CarRouter.put('/api/v1/cars/:carId', auth.onlyAuth, (req: AuthRequest, res: Response, next: NextFunction) => {
  return res.status(405).send();
});

CarRouter.delete('/api/v1/cars/:carId', auth.onlyAuth, (req: AuthRequest, res: Response, next: NextFunction) => {
  return res.status(405).send();
});

export { CarRouter };

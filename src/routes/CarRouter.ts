import express from 'express';
import type { Request, Response, NextFunction } from 'express';

const CarRouter = express.Router();

CarRouter.get('/api/v1/cars', (req: Request, res: Response) => {
  return res.status(405).send();
});

CarRouter.post('/api/v1/cars', (req: Request, res: Response) => {
  return res.status(405).send();
});

CarRouter.put('/api/v1/cars/:carId', (req: Request, res: Response) => {
  return res.status(405).send();
});

CarRouter.delete('/api/v1/cars/:carId', (req: Request, res: Response) => {
  return res.status(405).send();
});

export { CarRouter };

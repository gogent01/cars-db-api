import express from 'express';
import type { Response, NextFunction } from 'express';
import { AuthRequest, Car, CarFindOptions } from '../types';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { CarValidationMiddleware } from '../middleware/CarValidationMiddleware';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware';
import { MongoCarCtrl } from '../controllers/MongoCarCtrl';
import { InternalServerErrorException } from '../errors/InternalServerErrorException';
import { NotFoundException } from '../errors/NotFoundException';
import { lchmodSync } from 'fs';

const CarRouter = express.Router();
const auth = new AuthMiddleware();
const carChecks = new CarValidationMiddleware();
const validation = new ValidationMiddleware();

CarRouter.get(
  '/api/v1/cars',
  auth.onlyAuth,
  carChecks.brand,
  carChecks.model,
  carChecks.year,
  carChecks.price,
  carChecks.sort,
  carChecks.direction,
  validation.processValidationErrors,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const options: CarFindOptions = {
      filter: {
        brand: (req.query.brand as string) || undefined,
        model: (req.query.model as string) || undefined,
        year: req.query.year ? parseInt(req.query.year as string, 10) : undefined,
        price: req.query.price ? parseInt(req.query.price as string, 10) : undefined,
      },
      sort: {
        field: (req.query.sort as keyof Omit<Car, '_id'>) || undefined,
        direction: (req.query.direction as 'ASC' | 'DESC') || undefined,
      },
    };

    const carCtrl = new MongoCarCtrl();
    const cars = await carCtrl.find(options).catch((error) => {
      return next(new InternalServerErrorException());
    });

    if (!cars) return;

    return res.json(cars);
  }
);

CarRouter.post(
  '/api/v1/cars',
  auth.onlyAuth,
  validation.required(['brand', 'model', 'year', 'price']),
  carChecks.brand,
  carChecks.model,
  carChecks.year,
  carChecks.price,
  validation.processValidationErrors,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const car: Car = {
      brand: req.body.brand,
      model: req.body.model,
      year: req.body.year,
      price: req.body.price,
    };

    const carCtrl = new MongoCarCtrl();
    const savedCar = await carCtrl.create(car).catch((error) => {
      return next(new InternalServerErrorException());
    });

    if (!savedCar) return;

    return res.json(savedCar);
  }
);

CarRouter.put(
  '/api/v1/cars/:carId',
  auth.onlyAuth,
  validation.required(['brand', 'model', 'year', 'price']),
  carChecks.carId,
  carChecks.brand,
  carChecks.model,
  carChecks.year,
  carChecks.price,
  validation.processValidationErrors,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const car: Required<Car> = {
      _id: req.params.carId,
      brand: req.body.brand,
      model: req.body.model,
      year: req.body.year,
      price: req.body.price,
    };

    const carCtrl = new MongoCarCtrl();
    const updatedCar = await carCtrl.update(car).catch((error) => {
      if (error.message === 'car_not_found') {
        return next(new NotFoundException('car_not_found'));
      }
      return next(new InternalServerErrorException());
    });

    if (!updatedCar) return;

    return res.json(updatedCar);
  }
);

CarRouter.delete(
  '/api/v1/cars/:carId',
  auth.onlyAuth,
  carChecks.carId,
  validation.processValidationErrors,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { carId } = req.params;

    const carCtrl = new MongoCarCtrl();
    const deletedCar = await carCtrl.delete(carId).catch((error) => {
      if (error.message === 'car_not_found') {
        return next(new NotFoundException('car_not_found'));
      }
      return next(new InternalServerErrorException());
    });

    if (!deletedCar) return;

    return res.json(deletedCar);
  }
);

export { CarRouter };

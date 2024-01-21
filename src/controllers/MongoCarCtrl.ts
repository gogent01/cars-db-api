import { CarCtrl } from './abstract/CarCtrl';
import { Car, CarFindOptions } from '../types';
import { CarModel } from '../models/CarModel';

export class MongoCarCtrl extends CarCtrl {
  async create(car: Car): Promise<Car> {
    const savedCar = await new CarModel(car).save().catch((error) => {
      throw new Error('db_error_create_car');
    });

    return savedCar.toCar();
  }

  async find(options?: CarFindOptions): Promise<Car[]> {
    const filters = options?.filter || {};
    const sort = options?.sort?.field
      ? {
          [options.sort.field]: (options.sort.direction || 'ASC') === 'ASC' ? 1 : -1,
        }
      : { brand: 1 };

    const cars = await CarModel.find({ ...filters }, {}, { sort }).catch((error) => {
      throw new Error('db_error_find_cars');
    });

    return cars.map((car) => car.toCar());
  }

  async update(car: Required<Car>): Promise<Car> {
    const updatedCar = await CarModel.findByIdAndUpdate(
      car._id,
      { brand: car.brand, model: car.model, year: car.year, price: car.price },
      { new: true }
    ).catch((error) => {
      throw new Error('db_error_update_car');
    });

    if (updatedCar === null) throw new Error('car_not_found');

    return updatedCar.toCar();
  }

  async delete(_id: string): Promise<Car> {
    const deletedCar = await CarModel.findById(_id).catch((error) => {
      throw new Error('db_error_find_car');
    });
    if (deletedCar === null) throw new Error('car_not_found');

    await CarModel.deleteOne({ _id }).catch((error) => {
      throw new Error('db_error_delete_car');
    });

    return deletedCar.toCar();
  }
}

import { Car, CarFindOptions } from '../../types';

export abstract class CarCtrl {
  abstract create(car: Car): Promise<Car>;
  abstract find(options: CarFindOptions): Promise<Car[]>;
  abstract update(car: Required<Car>): Promise<Car>;
  abstract delete(_id: string): Promise<Car>;
}

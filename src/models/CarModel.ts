import { Model, model, Schema } from 'mongoose';
import { Car } from '../types';

type CarMethods = {
  toCar: () => Required<Car>;
};

type CarModel = Model<Car, {}, CarMethods>;

const carSchema = new Schema<Car, CarModel, CarMethods>({
  brand: { type: 'string', required: true },
  model: { type: 'string', required: true },
  year: { type: 'number', required: true },
  price: { type: 'number', required: true },
});

carSchema.method('toCar', function (): Required<Car> {
  return {
    _id: this._id.toString(),
    brand: this.brand,
    model: this.model,
    year: this.year,
    price: this.price,
  };
});

const CarModel = model<Car, CarModel>('car', carSchema);

export { CarModel };

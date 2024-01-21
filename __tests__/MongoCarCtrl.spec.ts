import { MongoDBService } from '../src/services/MongoDBService';
import { CarModel } from '../src/models/CarModel';
import { MongoCarCtrl } from '../src/controllers/MongoCarCtrl';
import { Car } from '../src/types';

const CARS: Car[] = [
  {
    brand: 'Nissan',
    model: 'Qashqai',
    year: 2019,
    price: 1700000,
  },
  {
    brand: 'Nissan',
    model: 'Qashqai',
    year: 2019,
    price: 1700000,
  },
  {
    brand: 'Nissan',
    model: 'X-Trail',
    year: 2012,
    price: 1400000,
  },
  {
    brand: 'Audi',
    model: 'A3',
    year: 2019,
    price: 1950000,
  },
  {
    brand: 'Skoda',
    model: 'Superb',
    year: 2022,
    price: 3800000,
  },
  {
    brand: 'Kia',
    model: 'Sportage',
    year: 2020,
    price: 1950000,
  },
];

beforeAll(async () => {
  const dbService = MongoDBService.getInstance();
  await dbService.connect();
});

afterEach(async () => {
  await CarModel.deleteMany({});
});

describe('Tests for car creation', () => {
  it('creates a car when provided valid data', async () => {
    const carCtrl = new MongoCarCtrl();
    const car: Car = {
      brand: 'Nissan',
      model: 'Qashqai',
      year: 2019,
      price: 1700000,
    };

    await carCtrl.create(car);

    const savedCar = await CarModel.findOne({ ...car });
    const plainSavedCar = savedCar?.toCar() || null;

    expect(plainSavedCar).not.toBeNull();
    expect(plainSavedCar.brand).toBe(car.brand);
    expect(plainSavedCar.model).toBe(car.model);
    expect(plainSavedCar.year).toBe(car.year);
    expect(plainSavedCar.price).toBe(car.price);
  });
});

describe('Tests for car retrieval', () => {
  beforeEach(async () => {
    await CarModel.create(CARS);
  });

  it('returns all car info on a find query: _id, brand, model, year and price', async () => {
    const carCtrl = new MongoCarCtrl();
    const cars = await carCtrl.find();

    const car = cars.at(0);
    expect(car).not.toBeUndefined();
    expect(Object.keys(car)).toEqual(['_id', 'brand', 'model', 'year', 'price']);
  });

  it('returns all stored cars on an empty find query', async () => {
    const carCtrl = new MongoCarCtrl();
    const cars = await carCtrl.find();

    expect(cars.length).toBe(6);
  });

  it.each`
    field      | value        | count
    ${'brand'} | ${'Nissan'}  | ${3}
    ${'model'} | ${'Qashqai'} | ${2}
    ${'year'}  | ${2020}      | ${1}
    ${'price'} | ${1950000}   | ${2}
    ${'brand'} | ${'Lada'}    | ${0}
    ${'model'} | ${'Granta'}  | ${0}
    ${'year'}  | ${'2010'}    | ${0}
    ${'price'} | ${'250000'}  | ${0}
  `(
    'returns only cars of a specified $field on a find query with a corresponding filter',
    async ({ field, value, count }) => {
      const carCtrl = new MongoCarCtrl();
      const cars = await carCtrl.find({ filter: { [field]: value } });

      expect(cars.length).toBe(count);
    }
  );

  it('returns cars in ASC order by brand on a find query without sorting options provided', async () => {
    const carCtrl = new MongoCarCtrl();
    const cars = await carCtrl.find();

    expect(cars[0].price).toBe(1950000);
  });

  it.each`
    field      | direction | firstPrice
    ${'brand'} | ${'ASC'}  | ${1950000}
    ${'model'} | ${'ASC'}  | ${1950000}
    ${'year'}  | ${'ASC'}  | ${1400000}
    ${'price'} | ${'ASC'}  | ${1400000}
    ${'brand'} | ${'DESC'} | ${3800000}
    ${'model'} | ${'DESC'} | ${1400000}
    ${'year'}  | ${'DESC'} | ${3800000}
    ${'price'} | ${'DESC'} | ${3800000}
  `(
    'returns cars in $direction order by $field on a find query with a corresponding sort',
    async ({ field, direction, firstPrice }) => {
      const carCtrl = new MongoCarCtrl();
      const cars = await carCtrl.find({ sort: { field, direction } });

      expect(cars[0].price).toBe(firstPrice);
    }
  );

  it.each`
    field      | direction    | firstPrice
    ${'brand'} | ${undefined} | ${1950000}
    ${'model'} | ${undefined} | ${1950000}
    ${'year'}  | ${undefined} | ${1400000}
    ${'price'} | ${undefined} | ${1400000}
  `(
    'returns cars in ASC order by $field on a find query with a corresponding sort field without direction provided',
    async ({ field, direction, firstPrice }) => {
      const carCtrl = new MongoCarCtrl();
      const cars = await carCtrl.find({ sort: { field, direction } });

      expect(cars[0].price).toBe(firstPrice);
    }
  );

  it.each`
    filterField | filterValue  | sortField  | sortDirection | count | firstPrice
    ${'brand'}  | ${'Nissan'}  | ${'price'} | ${'ASC'}      | ${3}  | ${1400000}
    ${'model'}  | ${'Qashqai'} | ${'year'}  | ${'DESC'}     | ${2}  | ${1700000}
    ${'year'}   | ${2019}      | ${'brand'} | ${'ASC'}      | ${3}  | ${1950000}
    ${'price'}  | ${'1950000'} | ${'model'} | ${'DESC'}     | ${2}  | ${1950000}
  `(
    'returns cars with respect to various filter ($filterField: $filterValue) and sort ($sortField: $sortDirection) params',
    async ({ filterField, filterValue, sortField, sortDirection, count, firstPrice }) => {
      const carCtrl = new MongoCarCtrl();
      const cars = await carCtrl.find({
        filter: { [filterField]: filterValue },
        sort: { field: sortField, direction: sortDirection },
      });

      expect(cars.length).toBe(count);
      expect(cars[0].price).toBe(firstPrice);
    }
  );
});

describe('Tests for car updating', () => {
  beforeEach(async () => {
    await CarModel.create(CARS);
  });

  it('updates a car when provided valid data', async () => {
    const carCtrl = new MongoCarCtrl();
    const carToChange = await CarModel.findOne({ ...CARS[0] });
    carToChange.price = 6000000;
    await carCtrl.update(carToChange);

    const updatedCar = await CarModel.findById(carToChange._id);
    const plainUpdatedCar = updatedCar?.toCar() || null;

    expect(plainUpdatedCar).not.toBeNull();
    expect(plainUpdatedCar.brand).toBe(carToChange.brand);
    expect(plainUpdatedCar.model).toBe(carToChange.model);
    expect(plainUpdatedCar.year).toBe(carToChange.year);
    expect(plainUpdatedCar.price).toBe(carToChange.price);
  });
});

describe('Tests for car deletion', () => {
  beforeEach(async () => {
    await CarModel.create(CARS);
  });

  it('deletes a car when provided valid data', async () => {
    const carCtrl = new MongoCarCtrl();
    const carToDelete = await CarModel.findOne({ ...CARS[0] });
    await carCtrl.delete(carToDelete._id);

    const deletedCar = await CarModel.findById(carToDelete._id);
    const plainDeletedCar = deletedCar?.toCar() || null;

    expect(plainDeletedCar).toBeNull();
  });
});

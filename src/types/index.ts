import type { Request } from 'express';

export type User = {
  _id?: string;
  email: string;
  password: string;
};

export type UserCredentials = Pick<User, 'email' | 'password'>;

export interface AuthRequest extends Request {
  userId: string;
}

export type Car = {
  _id?: string;
  brand: string;
  model: string;
  year: number;
  price: number;
};

export type CarFindOptions = {
  filter?: CarFilterOptions;
  sort?: CarSortOptions;
};

type CarFilterOptions = Partial<Omit<Car, '_id'>>;

type CarSortOptions = {
  field: keyof Omit<Car, '_id'>;
  direction?: 'ASC' | 'DESC';
};

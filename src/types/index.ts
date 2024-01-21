export type User = {
  _id?: string;
  email: string;
  password: string;
};

export type UserCredentials = Pick<User, 'email' | 'password'>;

export type AuthUserData = {
  _id: string;
};

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

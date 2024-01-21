import { User, UserCredentials } from '../../types';

export abstract class UserCtrl {
  abstract create(user: User): Promise<Required<User>>;
  abstract login(credentials: UserCredentials): Promise<string>;
}

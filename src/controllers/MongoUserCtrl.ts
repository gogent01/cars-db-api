import bcrypt from 'bcrypt';
import { UserCtrl } from './abstract/UserCtrl';
import { User, UserCredentials } from '../types';
import { UserModel } from '../models/UserModel';
import { TokenService } from '../services/TokenService';

export class MongoUserCtrl extends UserCtrl {
  async create(user: User): Promise<Required<User>> {
    const hash = await bcrypt.hash(user.password, 12);

    const savedUser = await new UserModel({
      email: user.email,
      password: hash,
    }).save();

    return savedUser.toUser();
  }

  async login(credentials: UserCredentials): Promise<string> {
    const storedUser = await UserModel.findOne({
      email: credentials.email,
    });
    if (!storedUser) {
      throw new Error('user_not_found');
    }

    const user = storedUser.toJSON() as Required<User>;
    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password).catch((error) => {
      throw new Error('user_not_found');
    });
    if (!isPasswordCorrect) throw new Error('user_not_found');

    const tokenService = new TokenService();
    const authToken = await tokenService.createAuthToken(user).catch((error) => {
      throw new Error('jwt_token_error');
    });

    return authToken;
  }
}

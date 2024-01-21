import { Model, model, Schema } from 'mongoose';
import { User } from '../types';

type UserMethods = {
  toUser: () => Required<User>;
};
type UserModel = Model<User, {}, UserMethods>;

const userSchema = new Schema<User, UserModel, UserMethods>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.method('toUser', function (): Required<User> {
  return {
    _id: this._id.toString(),
    email: this.email,
    password: this.password,
  };
});

const UserModel = model<User, UserModel>('user', userSchema);

export { UserModel };

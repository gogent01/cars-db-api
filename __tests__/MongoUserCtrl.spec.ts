import { MongoUserCtrl } from '../src/controllers/MongoUserCtrl';
import { User, UserCredentials } from '../src/types';
import { UserModel } from '../src/models/UserModel';
import { MongoDBService } from '../src/services/MongoDBService';
import { TokenService } from '../src/services/TokenService';

beforeAll(async () => {
  const dbService = MongoDBService.getInstance();
  await dbService.connect();
});

afterEach(async () => {
  await UserModel.deleteMany({});
});

describe('Tests for user creation', () => {
  it('creates a user when valid input is provided', async () => {
    const userCtrl = new MongoUserCtrl();
    const user: User = {
      email: 'user1@example.com',
      password: 'P4ssword!',
    };
    await userCtrl.create(user);

    const savedUser = await UserModel.findOne({ email: 'user1@example.com' });
    const plainSavedUser = savedUser?.toUser() ?? null;

    expect(plainSavedUser).not.toBeNull();
    expect(plainSavedUser.email).toEqual(user.email);
  });
});

describe('Tests for user authentication', () => {
  it('returns a JWT token with user ID, when logging in with valid credentials', async () => {
    const userCtrl = new MongoUserCtrl();
    const user: User = {
      email: 'user1@example.com',
      password: 'P4ssword!',
    };
    const savedUser = await userCtrl.create(user);

    const credentials: UserCredentials = {
      email: user.email,
      password: user.password,
    };
    const token = await userCtrl.login(credentials);

    const tokenService = new TokenService();
    const decodedToken = await tokenService.decodeAuthToken(token);

    expect(token).not.toBeUndefined();
    expect(decodedToken).not.toBeUndefined();
    expect(Object.keys(decodedToken)).toEqual(['_id', 'iat', 'exp']);
    expect(decodedToken._id).toBe(savedUser._id);
  });

  it('returns a JWT token which expires in 10 minutes, when logging in with valid credentials', async () => {
    const userCtrl = new MongoUserCtrl();
    const user: User = {
      email: 'user1@example.com',
      password: 'P4ssword!',
    };
    await userCtrl.create(user);

    const credentials: UserCredentials = {
      email: user.email,
      password: user.password,
    };
    const token = await userCtrl.login(credentials);

    const tokenService = new TokenService();
    const decodedToken = await tokenService.decodeAuthToken(token);

    const NOW = new Date().getTime();
    const TEN_MINUTES = 60 * 10;

    expect(decodedToken.iat * 1000).toBeLessThanOrEqual(NOW);
    expect(decodedToken.exp * 1000).toBeGreaterThanOrEqual(NOW);
    expect(decodedToken.exp - decodedToken.iat).toBe(TEN_MINUTES);
  });
});

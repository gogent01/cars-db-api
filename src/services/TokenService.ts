import path from 'path';
import dotenv from 'dotenv';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import { User } from '../types';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

type AuthTokenData = {
  _id: string;
  iat: number;
  exp: number;
};

export class TokenService {
  createAuthToken(user: Required<User>): Promise<string> {
    return new Promise<string>((resolve, reject) =>
      jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: 600 }, (err, token) => {
        if (token) return resolve(token);
        reject(err);
      })
    );
  }

  decodeAuthToken(token: string): Promise<AuthTokenData> {
    return new Promise((resolve, reject) =>
      jwt.verify(token, process.env.JWT_SECRET, { complete: true }, (err, tokenData) => {
        const payload = tokenData.payload as AuthTokenData;
        if (payload) return resolve(payload);
        reject(err);
      })
    );
  }
}

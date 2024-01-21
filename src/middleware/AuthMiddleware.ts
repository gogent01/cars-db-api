import type { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/TokenService';
import { AuthRequest } from '../types';
import { AuthorizationException } from '../errors/AuthorizationException';

export class AuthMiddleware {
  async onlyAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return next(new AuthorizationException());
    }

    const tokenService = new TokenService();
    const decodedToken = await tokenService.decodeAuthToken(token).catch((error) => {
      return next(new AuthorizationException());
    });

    if (!decodedToken) return next(new AuthorizationException());
    (req as AuthRequest).userId = decodedToken._id;

    next();
  }
}

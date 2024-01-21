import { Request, Response, NextFunction } from 'express';
import { ExpressError } from './ExpressError';

export function ErrorHandler(err: ExpressError, req: Request, res: Response, next: NextFunction) {
  res.status(err.status).send(err.toResponseBody(req.originalUrl));
}

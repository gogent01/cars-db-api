import express from 'express';
import type { Request, Response, NextFunction } from 'express';

const UserRouter = express.Router();

UserRouter.post('api/v1/user/auth', (req: Request, res: Response) => {
  return res.status(405).send();
});

export { UserRouter };

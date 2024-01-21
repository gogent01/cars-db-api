import express, { type Application } from 'express';
import path from 'path';
import dotenv from 'dotenv';

import { MongoDBService } from './services/MongoDBService';
import { HealthRouter } from './routes/HealthRouter';
import { UserRouter } from './routes/UserRouter';
import { CarRouter } from './routes/CarRouter';
import { ErrorHandler } from './errors/ErrorHandler';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export class App {
  readonly PORT: string;
  readonly api: Application;
  readonly db: MongoDBService;

  constructor(port: string = '3000') {
    this.PORT = port;
    this.api = express();
    this.db = MongoDBService.getInstance();
  }

  async launch(): Promise<void> {
    await this.db.connect();

    const api = this.api;
    api.use(express.json({ limit: '1mb' }));
    api.use(HealthRouter);
    api.use(UserRouter);
    api.use(CarRouter);
    api.use(ErrorHandler);
    api.disable('x-powered-by');

    api.listen(this.PORT, () => console.log(`Cars DB API has been launched on port ${this.PORT}! 🚀`));
  }
}

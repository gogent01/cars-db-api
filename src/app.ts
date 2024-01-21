import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

import { MongoDBService } from './services/MongoDBService';
import { HealthRouter } from './routes/HealthRouter';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const dbService = MongoDBService.getInstance();
dbService.connect();

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(HealthRouter);

app.disable('x-powered-by');

export { app };

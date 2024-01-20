import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';

import { HealthRouter } from './routes/HealthRouter';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true`
  )
  .then(() => console.log('DB Connected!'));

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(HealthRouter);

app.disable('x-powered-by');

export { app };

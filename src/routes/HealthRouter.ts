import express from 'express';
import mongoose from 'mongoose';
import { MongoDBService } from '../services/MongoDBService';

const HealthRouter = express.Router();

HealthRouter.get('/api/v1/health/live', (req, res) => {
  return res.status(200).send();
});

HealthRouter.get('/api/v1/health/db', (req, res) => {
  const dbService = MongoDBService.getInstance();
  const status = dbService.isReady ? 200 : 503;
  return res.status(status).send();
});

export { HealthRouter };

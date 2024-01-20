import express from 'express';
import mongoose from 'mongoose';

const HealthRouter = express.Router();

HealthRouter.get('/api/v1/health/live', (req, res) => {
  console.log(mongoose.connection.readyState);
  return res.status(200).send();
});

HealthRouter.get('/api/v1/health/db', (req, res) => {
  const status = mongoose.connection.readyState === 1 ? 200 : 503;
  return res.status(status).send();
});

export { HealthRouter };

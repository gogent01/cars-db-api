import mongoose, { Connection, ConnectionStates, Mongoose } from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export class MongoDBService {
  private static instance: MongoDBService;
  private connection: Mongoose;
  private constructor() {}

  get isReady(): boolean {
    return this.connection.connection.readyState === 1;
  }

  static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }

    return MongoDBService.instance;
  }

  async connect(): Promise<void> {
    if (this.connection) return;

    const DB_USER = process.env.DB_USER;
    const DB_PASSWORD = process.env.DB_PASSWORD;
    const DB_URL = process.env.DB_URL;
    const DB_NAME = process.env.NODE_ENV === 'test' ? process.env.DB_NAME_TEST : process.env.DB_NAME;
    const url = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true`;
    const connection = await mongoose.connect(url).catch((error) => {
      Promise.reject(error);
    });
    if (!connection) return;

    console.log('DB Connected!');
    this.connection = connection;
  }
}

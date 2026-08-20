import mongoose from "mongoose";
import { seedAdmin } from "../utils/seedAdmin";
import { AppConfig } from "./app.config";
import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../constants/http-status.enum";
import { Logger } from "../utils/logger";

const MONGO_URI = AppConfig.MONGO_URI;
const DB_NAME = AppConfig.DB_NAME;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}
const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      dbName: DB_NAME,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      Logger.log(`Connected to MongoDB: ${DB_NAME}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    await seedAdmin();
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export const databaseConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    const error = err as Error;
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message || "Database connection failed",
    });
  }
};

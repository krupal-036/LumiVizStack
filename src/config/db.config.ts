import mongoose from "mongoose";
import { seedAdmin } from "../utils/seedAdmin";
import { AppConfig } from "./app.config";
import { NextFunction } from "express";

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
      if (AppConfig.NODE_ENV !== "production") {
        console.log(`Connected to MongoDB: ${DB_NAME}`);
      }
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

export const databaseConfig = async (req: any, res: any, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Database connection failed",
    });
  }
};
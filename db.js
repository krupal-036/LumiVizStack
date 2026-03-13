import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "lumivizstack_db";

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(`${MONGO_URI}/${DB_NAME}`, opts).then((mongoose) => {
      console.log(`Connected to MongoDB: ${DB_NAME}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // 4. If connection fails, clear the promise so the next request can try again
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectDB;

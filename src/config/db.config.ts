import mongoose from "mongoose";
import { seedAdmin } from "../utils/seedAdmin";

const MONGO_URI = process.env.MONGO_URI_2 as string;
const DB_NAME = process.env.DB_NAME as string;

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
        };

        cached.promise = mongoose.connect(`${MONGO_URI}/${DB_NAME}`, opts).then((mongoose) => {
            if (process.env.NODE_ENV as string !== "production") {
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

export default connectDB;
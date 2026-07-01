import cors from 'cors';
import { NextFunction } from 'express';
import connectDB from './db.config';

const allowedOrigins = (process.env.ALLOWED_ORIGINS as string).split(',');

export const corsConfig = cors({
    origin: allowedOrigins,
    credentials: true,
});

export const databaseConfig = async (
    req: any,
    res: any,
    next: NextFunction,
) => {
    try {
        await connectDB();
        next();
    } catch (err: any) {
        res.status(500).json({
            message: err.message || 'Database connection failed',
        });
    }
};

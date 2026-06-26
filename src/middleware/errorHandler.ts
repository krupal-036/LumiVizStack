import { Request, Response, NextFunction } from 'express';

/**
 * Centralized Error Handling Middleware.
 * Standardizes API responses for validation errors, duplicates, JWT failures, and DB constraints.
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error('--- Global Error Handler ---');
    console.error(err);

    let statusCode = err.status || 500;
    let message = err.message || 'Internal Server Error';
    let errors: any = undefined;

    // Handle Mongoose Schema Validation Errors (built-in, custom, async)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Mongoose Schema Validation Failed';
        errors = Object.values(err.errors).map((e: any) => ({
            field: e.path,
            value: e.value,
            message: e.message
        }));
    }

    // Handle MongoDB Duplicate Key Error (e.g. Email field uniqueness)
    else if (err.code === 11000) {
        statusCode = 400;
        message = 'Database Conflict Error';
        const key = err.keyValue ? Object.keys(err.keyValue)[0] as string : 'field';
        const value = err.keyValue ? err.keyValue[key] : 'value';
        errors = [{
            field: key,
            value: value,
            message: `${key} '${value}' is already registered and must be unique`
        }];
    }

    // Handle JWT Verification Errors
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid access token';
    }
    else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Access token has expired';
    }

    res.status(statusCode).json({
        data: {
            success: false,
            message,
            errors,
            stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
        }
    });
}
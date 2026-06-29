import { Request, Response } from 'express';
import os from 'os';

export const healthCheck = (req: Request, res: Response): void => {
    res.status(200).json({
        status: 'ok',
        code: 200,
        message: 'API is successfully working!',
        timestamp: new Date().toISOString(), // Standard ISO format for tracking
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        system: {
            platform: os.platform(),
            architecture: os.arch(),
            freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
            totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
        },
    });
};

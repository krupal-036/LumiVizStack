// backend/src/middleware/healthCheck.middleware.ts
import { Request, Response } from "express";
import { AppConfig } from "../config/app.config";
import { HttpStatus } from "../constants/http-status.enum";

export const healthCheck = () => {
    return (req: Request, res: Response): void => {
        res.status(HttpStatus.OK).json({
            status: "ok",
            code: HttpStatus.OK,
            message: "API is successfully working!",
            timestamp: new Date().toISOString(),
            environment: AppConfig.NODE_ENV,
            version: process.env.npm_package_version || "1.0.0",
        });
    };
};

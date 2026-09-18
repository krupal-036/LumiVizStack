// backend/src/middleware/requestLogger.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppLogger } from "../utils/handlers/logHandler";

export const requestLogger = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const timestamp = new Date().toISOString();
        AppLogger.log(
            `[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip} REQ ID ${req.headers["x-request-id"]}`,
        );
        next();
    };
};

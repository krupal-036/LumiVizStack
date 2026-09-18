// backend/src/middleware/serverlessTimeout.ts
import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../constants/http-status.enum";

export const serverlessTimeout = (timeoutMs: number = 9000) => {
    return (_req: Request, res: Response, next: NextFunction) => {
        res.setTimeout(timeoutMs, () => {
            if (!res.headersSent) {
                res.status(HttpStatus.GATEWAY_TIMEOUT).json({
                    success: false,
                    error: { code: "TIMEOUT", message: "Request timed out on the server." },
                });
            }
        });
        next();
    };
};

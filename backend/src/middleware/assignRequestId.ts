// backend/src/middleware/assignRequestId.ts
import { NextFunction, Request, Response } from "express";

export const assignRequestId = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const id =
            (req.headers["x-request-id"] as string) ||
            (req.headers["x-vercel-id"] as string) ||
            globalThis.crypto.randomUUID();
        res.setHeader("X-Request-Id", id);
        next();
    };
};

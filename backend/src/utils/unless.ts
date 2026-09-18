// backend/src/utils/unless.ts
import { NextFunction, Request, RequestHandler, Response } from "express";

export const unless = (path: string, middleware: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (path === req.path) {
            return next();
        }
        return middleware(req, res, next);
    };
};

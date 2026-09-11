// backend/src/middleware/serveFrontend.middleware.ts
import { NextFunction, Response, RequestHandler, Request } from "express";
import fs from "fs";
import path from "path";
import { HttpStatus } from "../constants/http-status.enum";

export const serveFrontend = (DIST_PATH: string): RequestHandler => {
    const htmlPath = path.join(DIST_PATH, "index.html");

    let indexHtmlContent: string | null = null;

    try {
        if (fs.existsSync(htmlPath)) {
            indexHtmlContent = fs.readFileSync(htmlPath, "utf8");
        } else {
            console.error(`[Frontend Error]: index.html not found at ${htmlPath}`);
        }
    } catch (err) {
        console.error("[Frontend Error]: Failed to read index.html into memory:", err);
    }

    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (indexHtmlContent !== null) {
                res.setHeader("Content-Type", "text/html; charset=UTF-8");
                return res.send(indexHtmlContent);
            }

            return res.status(HttpStatus.NOT_FOUND).json({
                error: "Frontend build not found",
            });
        } catch (err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: "Error loading frontend",
            });
        }
    };
};

import { Request, Response, NextFunction } from "express";
import { AppConfig } from "../config/app.config";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  if (AppConfig.NODE_ENV !== "production") {
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  }
  next();
};

import { Request, Response } from "express";
import os from "os";
import { AppConfig } from "../config/app.config";

export const healthCheck = (req: Request, res: Response): void => {
  res.status(200).json({
    status: "ok",
    code: 200,
    message: "API is successfully working!",
    timestamp: new Date().toISOString(),
    environment: AppConfig.NODE_ENV,
    version: process.env.npm_package_version || "1.0.0",
    system: {
      platform: os.platform(),
      architecture: os.arch(),
      freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
      totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
    },
  });
};

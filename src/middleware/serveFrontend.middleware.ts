import { NextFunction } from "express";
import fs from "fs";
import path from "path";

export const serveFrontend = (DIST_PATH: string) => {
  return (req: any, res: any, next: NextFunction) => {
    const htmlPath = path.join(DIST_PATH, "index.html");

    try {
      if (fs.existsSync(htmlPath)) {
        return res.sendFile(htmlPath);
      }

      return res.status(404).json({
        error: "Frontend build not found",
      });
    } catch (err) {
      return res.status(500).json({
        error: "Error loading frontend",
      });
    }
  };
};

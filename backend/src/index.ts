// backend/src/index.ts
import "dotenv/config";
import path from "path";
import fs from "fs";

import express, { RequestHandler } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compression from "compression";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import profileRoutes from "./routes/profile.routes";
import historyRoutes from "./routes/history.routes";

import { siteGuard } from "./middleware/siteGuard.middleware";
import { startDevServer } from "./utils/startDevServer";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { serveFrontend } from "./middleware/serveFrontend.middleware";
import { corsConfig } from "./config/cors.config";
import { requestLogger } from "./middleware/requestLogger.middleware";
import { apiLimiter, authLimiter, rateLimiter } from "./middleware/apiLimiter";
import { healthCheck } from "./middleware/healthCheck.middleware";
import { databaseConfig } from "./config/db.config";

const app = express();
const DIST_PATH: string = fs.existsSync(path.join(process.cwd(), "public"))
    ? path.join(process.cwd(), "public")
    : path.join(process.cwd(), "backend", "public");
const serveApp: RequestHandler = serveFrontend(DIST_PATH);

app.set("trust proxy", 1);

app.use(compression());
app.use(express.static(DIST_PATH));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(corsConfig);
app.use(databaseConfig);
app.use("/api/auth", siteGuard, authLimiter, userRoutes);
app.use("/api/admin", apiLimiter, adminRoutes);
app.use("/api/profile", apiLimiter, profileRoutes);
app.use("/api/history", apiLimiter, historyRoutes);
app.get("/api/health", rateLimiter, healthCheck);

startDevServer(app);

app.get("/", serveApp);
app.use("/api/*splat", serveApp);
app.get("*splat", serveApp);

app.use(errorHandler);

export default app;

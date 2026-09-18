// backend/src/index.ts
import "dotenv/config";
import fs from "fs";
import hpp from "hpp";
import path from "path";
import helmet from "helmet";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import express, { RequestHandler } from "express";

import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import profileRoutes from "./routes/profile.routes";
import historyRoutes from "./routes/history.routes";

import { AppConfig } from "./config/app.config";
import { corsConfig } from "./config/cors.config";
import { databaseConfig } from "./config/db.config";

import { unless } from "./utils/unless";
import { AppLogger } from "./utils/handlers/logHandler";
import { startServer } from "./utils/handlers/serverHandler";

import { siteGuard } from "./middleware/siteGuard.middleware";
import { assignRequestId } from "./middleware/assignRequestId";
import { healthCheck } from "./middleware/healthCheck.middleware";
import { serverlessTimeout } from "./middleware/serverlessTimeout";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { serveFrontend } from "./middleware/serveFrontend.middleware";
import { requestLogger } from "./middleware/requestLogger.middleware";
import { apiLimiter, authLimiter, rateLimiter } from "./middleware/apiLimiter";

process.on("unhandledRejection", (reason: unknown) => {
    AppLogger.error("FATAL UNHANDLED REJECTION:", reason);
});
process.on("uncaughtException", (error: Error) => {
    AppLogger.error("FATAL UNCAUGHT EXCEPTION:", error);
});

const app = express();
const DIST_PATH: string = fs.existsSync(path.join(process.cwd(), "public"))
    ? path.join(process.cwd(), "public")
    : path.join(process.cwd(), "backend", "public");
const serveApp: RequestHandler = serveFrontend(DIST_PATH);

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(assignRequestId());

app.use(
    helmet({
        contentSecurityPolicy: AppConfig.isDevelopment ? false : undefined,
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
);

app.use(compression());
app.use(express.static(DIST_PATH));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(hpp());
app.use(requestLogger());
app.use(corsConfig());
app.use(methodOverride());
app.use(serverlessTimeout());
app.use(unless("/api/health", databaseConfig()));

app.use("/api/auth", siteGuard, authLimiter, userRoutes);
app.use("/api/admin", apiLimiter, adminRoutes);
app.use("/api/profile", apiLimiter, profileRoutes);
app.use("/api/history", apiLimiter, historyRoutes);
app.get("/api/health", rateLimiter, healthCheck());

startServer(app);

app.get("/", serveApp);
app.all("/api/*splat", serveApp);
app.get("*splat", serveApp);
app.use(errorHandler);

export default app;

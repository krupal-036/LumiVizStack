import "dotenv/config";
import path from "path";
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import profileRoutes from "./routes/profile.routes";

import { siteGuard } from "./middleware/siteGuard";
import { startDevServer } from "./utils/startDevServer";
import { errorHandler } from "./middleware/errorHandler";
import { serveFrontend } from "./middleware/serveFrontend";
import { corsConfig, databaseConfig } from "./config/config";
import { requestLogger } from './middleware/requestLogger.middleware';
import { apiLimiter, authLimiter, rateLimiter } from "./middleware/apiLimiter";

const DIST_PATH: string = path.join(process.cwd(), "public");

const serveApp: any = serveFrontend(DIST_PATH);

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());

if (process.env.NODE_ENV as string !== "production") { app.use(requestLogger); }

app.use(express.static(DIST_PATH));

app.use(corsConfig);
app.use(databaseConfig);

app.use("/api/auth", siteGuard, authLimiter, userRoutes);
app.use("/api/admin", apiLimiter, adminRoutes);
app.use("/api/profile", apiLimiter, profileRoutes);
// app.use("/api/history", apiLimiter, historyRoutes);


app.get("/api/health", rateLimiter, (req: Request, res: Response) => {
    res.status(200).json({
        message: "API is Successfully working!",
        status: "ok",
        code: 200,
    });
});

startDevServer(app);

app.get("/", serveApp);
app.get("/api/*splat", serveApp);
app.get("*splat", serveApp);

app.use(errorHandler);

export default app;
import 'dotenv/config';
import path from 'path';
import express, { RequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import profileRoutes from './routes/profile.routes';
import historyRoutes from './routes/history.routes';

import { siteGuard } from './middleware/siteGuard.middleware';
import { startDevServer } from './utils/startDevServer';
import { errorHandler } from './middleware/errorHandler.middleware';
import { serveFrontend } from './middleware/serveFrontend.middleware';
import { corsConfig, databaseConfig } from './config/config';
import { requestLogger } from './middleware/requestLogger.middleware';
import { apiLimiter, authLimiter, rateLimiter } from './middleware/apiLimiter';
import { healthCheck } from './middleware/healthCheck.middleware';

const app = express();
const DIST_PATH: string = path.join(process.cwd(), 'public');
const serveApp: RequestHandler = serveFrontend(DIST_PATH);

app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);
app.use(express.static(DIST_PATH));

app.use(corsConfig);
app.use(databaseConfig);
app.use((req: any, res: any) =>  res.sendFile(path.join(DIST_PATH, 'index.html')));
app.use('/api/auth', siteGuard, authLimiter, userRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api/profile', apiLimiter, profileRoutes);
app.use('/api/history', apiLimiter, historyRoutes);
app.get('/api/health', rateLimiter, healthCheck);

startDevServer(app);

app.get('/', serveApp);
app.get('/api/*splat', serveApp);
app.get('*splat', serveApp);

app.use(errorHandler);

export default app;

// backend/src/config/cors.config.ts
import cors from "cors";
import { AppConfig } from "./app.config";

const allowedOrigins = AppConfig.ALLOWED_ORIGINS;

export const corsConfig = () => {
    return cors({
        origin: allowedOrigins,
        credentials: true,
    })
}

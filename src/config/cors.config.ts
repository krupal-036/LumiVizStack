import cors from "cors";
import { AppConfig } from "./app.config";

const allowedOrigins = AppConfig.ALLOWED_ORIGINS;

export const corsConfig = cors({
  origin: allowedOrigins,
  credentials: true,
});



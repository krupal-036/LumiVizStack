// backend/src/utils/handlers/serverHandler.ts
import { AppConfig } from "../../config/app.config";
import { AppLogger } from "./logHandler";

export const startServer = (app: any): void => {
    if (AppConfig.NODE_ENV !== "production") {
        const PORT = AppConfig.PORT;
        const server = app.listen(PORT, "0.0.0.0", () => {
            AppLogger.log(
                `[${AppConfig.NODE_ENV}] Server running locally on http://localhost:${PORT}`,
            );
        });
        const shutdown = (signal: string) => {
            AppLogger.log(`Received ${signal}. Closing HTTP server...`);
            server.close(() => {
                AppLogger.log("HTTP server closed.");
                process.exit(0);
            });
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    }
};

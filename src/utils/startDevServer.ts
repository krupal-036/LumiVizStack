import { AppConfig } from "../config/app.config";
import { Logger } from "./logger";

export const startDevServer = (app: any): void => {
  if (AppConfig.NODE_ENV !== "production") {
    const PORT = AppConfig.PORT;
    app.listen(PORT, () => {
      Logger.log(`[${AppConfig.NODE_ENV}] Server running on http://localhost:${PORT}`);
    });
  }
};

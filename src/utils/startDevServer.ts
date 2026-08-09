import { AppConfig } from "../config/app.config";

export const startDevServer = (app: any) => {
  if (AppConfig.NODE_ENV !== "production") {
    const PORT = AppConfig.PORT;
    app.listen(PORT, () => {
      console.log(`[${AppConfig.NODE_ENV}] Server running on http://localhost:${PORT}`);
    });
  }
};

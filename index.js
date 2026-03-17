import fs from "fs";
import express from "express";
// import cors from "cors";
import path from "path";
import "dotenv/config";

// import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js"
import adminRoutes from "./routes/admin.js";
import historyRoutes from "./routes/history.js";
import { apiLimiter, authLimiter, rateLimiter } from "./middleware/apiLimiter.js";
import { serveFrontend } from "./middleware/serveFrontend.js";
import { corsMiddleware, dbMiddleware } from "./middleware/config.js";

const app = express();
app.set("trust proxy", 1);

const DIST_PATH = path.join(process.cwd(), "public");
const serveApp = serveFrontend(DIST_PATH);

app.use(express.json());
app.use(express.static(DIST_PATH));



// app.use(
//   cors({
//     origin: [
//       "https://lumivizstack.vercel.app",
//       "http://localhost:5173",
//       "http://localhost:3000",
//     ],
//     credentials: true,
//   }),
// );

// app.use(async (req, res, next) => {
//   try {
//     await connectDB();
//     next();
//   } catch (err) {
//     res.status(500).json({ error: "Database connection failed" });
//   }
// });

app.use(corsMiddleware);
app.use(dbMiddleware);

// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/history", historyRoutes);
// app.use("/api/profile", profileRoutes);



app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/admin", apiLimiter, adminRoutes);
app.use("/api/history", apiLimiter, historyRoutes);
app.use("/api/profile", apiLimiter, profileRoutes);

app.get("/api/health", rateLimiter, (req, res) => {
  res.status(200).json({
    message: "Node App is Successfully working!",
    status: "ok",
    code: 200,
  });
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`App running on http://localhost:${PORT}`),
  );
}

app.get("/", serveApp);
app.get("/api/*splat", serveApp);
app.get("*splat", serveApp);

export default app;

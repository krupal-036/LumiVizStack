import fs from "fs";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import authRoutes from "./routes/auth.js";
import RateLimiter from "./middleware/RateLimiter.js";
// import "./db.js";
import connectDB from "./db.js";
import historyRoutes from "./routes/history.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const DIST_PATH = path.join(__dirname, "public/dist");

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://lumivizstack.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use(express.static(DIST_PATH));

app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

app.get("/api/health", RateLimiter, (req, res) => {
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

app.get("/", (req, res) => {
  const htmlPath = path.join(DIST_PATH, "index.html");
  try {
    if (fs.existsSync(htmlPath)) {
      res.sendFile(htmlPath);
    } else {
      res.status(404).json("Frontend not found in 'public' folder.");
    }
  } catch (err) {
    res.status(500).json("Error loading frontend.");
  }
});

app.get("/api/*splat", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.get("*splat", (req, res) => {
  const htmlPath = path.join(DIST_PATH, "index.html");
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.status(404).json("Page not found.");
  }
});

export default app;

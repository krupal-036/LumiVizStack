import fs from "fs";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import RateLimiter from "./middleware/RateLimiter.js";
import "./db.js";
import historyRoutes from "./routes/history.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const DIST_PATH = path.join(process.cwd(), "public/dist");

app.use(express.json());
app.use(express.static(DIST_PATH));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://lumivizstack.vercel.app"],
    credentials: true,
  }),
);

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

export default app;

// app.get("/", (req, res) => {
// const htmlPath = path.join(DIST_PATH, "index.html");
// try {
//   let html = fs.readFileSync(htmlPath, "utf8");
//   res.send(html);
// } catch (err) {
//   res.status(500).send("Error loading index.html. Ensure 'public/dist' exists.");
// }
// res.status(200).send("Success")
// });

// app.get("/api/*splat", (req, res) => {
//   console.log(`Invalid API hit: ${req.params.splat}. Redirecting...`);
//   res.status(404).json({ error: "API route not found" });
// });

// app.get("/*splat", (req, res) => {
//   res.sendFile(path.join(DIST_PATH, "index.html"));
// });

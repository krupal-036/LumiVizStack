import cors from "cors";
import connectDB from "../db.js";

export const corsMiddleware = cors({
  origin: [
    "https://lumivizstack.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
});

export const dbMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
};

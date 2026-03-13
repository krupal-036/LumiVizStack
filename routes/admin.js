import express from "express";
import User from "../models/User.js";
import History from "../models/History.js";
import verifyToken from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Dashboard stats
router.get("/stats", verifyToken, isAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const historyCount = await History.countDocuments();
    res.json({ users: userCount, records: historyCount });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Get all users
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Delete user
router.delete("/user/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await History.deleteMany({ userId });

    res.json({ message: "User and associated history deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// All history
router.get("/all-history", verifyToken, isAdmin, async (req, res) => {
  try {
    const allHistory = await History.find().populate(
      "userId",
      "username email"
    );

    res.json(allHistory);
  } catch (err) {
    res.status(500).json("Server error");
  }
});

export default router;
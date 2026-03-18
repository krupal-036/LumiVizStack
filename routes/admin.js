import express from "express";
import User from "../models/User.js";
import History from "../models/History.js";
import verifyToken from "../middleware/verifyToken.js";
import mongoose from "mongoose";
import { isAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// @route   GET api/admin/stats
// @desc    Get count of documents

router.get("/stats", verifyToken, isAdmin, async (req, res) => {
  try {
    const [userCount, historyCount, publicCount, deletedCount] = await Promise.all([
      User.countDocuments(),
      History.countDocuments(),
      History.countDocuments({ isPublic: true }),
      History.countDocuments({ isDeleted: true })
    ]);
    res.json({ users: userCount, records: historyCount, isPublic: publicCount, isDeleted: deletedCount });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   GET api/admin/users
// @desc    Get every users

router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   DELETE api/admin/user/:userid
// @desc    Delete User and all history of User

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


// @route   DELETE api/admin/users/allhistory/id
// @desc    DELETE all history of User at Admin Side

router.delete("/users/allhistory/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const result = await History.deleteMany({ userId });

    res.json({ 
      message: "Associated history deleted successfully", 
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   GET api/admin/allhistory
// @desc    Get all history of User at Admin Side

router.get("/allhistory", verifyToken, isAdmin, async (req, res) => {
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
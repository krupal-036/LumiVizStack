import express from "express";
import User from "../models/User.js";
import History from "../models/History.js";
import verifyToken from "../middleware/verifyToken.js";
import mongoose from "mongoose";
import { isAdmin } from "../middleware/adminAuth.js";
import SystemSettings from "../models/SystemSettings.js";

const router = express.Router();


// @route   GET api/admin/settings
// @desc    Get current site settings

router.get("/settings", verifyToken, isAdmin, async (req, res) => {
  try {
    let settings = await SystemSettings.findOne({ configName: "global_config" });
    if (!settings) settings = await SystemSettings.create({ configName: "global_config" });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Server not available..., error fetching settings" });
  }
});


// @route   PATCH api/admin/settings/auth
// @desc    Update login/signup toggles

router.patch("/settings/auth", verifyToken, isAdmin, async (req, res) => {
  const { isLoginEnabled, isSignupEnabled } = req.body;

  try {
    const updated = await SystemSettings.findOneAndUpdate(
      { configName: "global_config" },
      { isLoginEnabled, isSignupEnabled },
      {
        upsert: true,
        returnDocument: 'after'
      }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server not available..., error updating settings" });
  }
});


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
    res.status(500).json({ message: "Failed to load dashboard statistics." });
  }
});

// @route   GET api/admin/users
// @desc    Get every users

router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const usersWithStats = await User.aggregate([
      {
        $lookup: {
          from: "histories",
          localField: "_id",
          foreignField: "userId",
          as: "userHistory"
        }
      },
      {
        $addFields: {
          historyCount: { $size: "$userHistory" }
        }
      },
      {

        $project: {
          password: 0,
          userHistory: 0
        }
      }
    ]);

    res.json(usersWithStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get users with history counts." });
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
    res.status(500).json({ message: "Error occured during Deletion of User & its all History" });
  }
});

// @route   DELETE api/admin/history/all
// @desc    DELETE all history of History Collection at Admin Side

router.delete("/history/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await History.deleteMany({});

    res.json({
      message: `Total ${result.deletedCount} history records have been permanently deleted`
    },
    );
  } catch (err) {
    res.status(500).json({ message: "Failed to delete history" });
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
    res.status(500).json({ message: "Error Occured during Deletion of User's History" });
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
    res.status(500).json({ message: "Can't Get All History" });
  }
});

export default router;
import express from "express";
import History from "../models/History.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();


import { isAdmin } from "../middleware/adminAuth.js";

router.get("/admin", verifyToken, isAdmin, async (req, res) => {
  try {
    const histories = await History.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    res.json(histories);
  } catch (err) {
    res.status(500).json("Server error");
  }
});
// @route   POST api/history/save
// @desc    Save visualization history (Max 5 per user)

router.post("/save", verifyToken, async (req, res) => {
  try {
    const { title, type, data, rawInput, urlInput, inputType, isPublic } = req.body;
    const userId = req.user.id;

    // 1. Create and save the new item first
    const newHistory = new History({
      userId,
      title,
      type,
      data,
      rawInput,
      urlInput,
      inputType,
      isPublic: isPublic || false,
    });
    const savedItem = await newHistory.save();

    // 2. Cleanup: Find all items, sort by date, and keep only the latest 5
    const userHistories = await History.find({ userId }).sort({ createdAt: -1 });

    if (userHistories.length > 5) {
      const idsToDelete = userHistories.slice(5).map(item => item._id);
      await History.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Save error:", err.message);
    res.status(500).json("Server error");
  }
});



// @route   PUT api/history/:id/toggle
// @desc    Toggle isPublic flag
router.put("/:id/toggle", verifyToken, async (req, res) => {
  try {
    const historyItem = await History.findById(req.params.id);

    if (!historyItem) {
      return res.status(404).json({ message: "History not found" });
    }

    // Check ownership
    if (historyItem.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not verified" });
    }

    historyItem.isPublic = !historyItem.isPublic;
    await historyItem.save();

    res.json(historyItem);
  } catch (err) {
    console.error("Toggle error:", err.message);
    res.status(500).json("Server error");
  }
});

// @route   GET api/history/user
// @desc    Get logged-in user's history
router.get("/user", verifyToken, async (req, res) => {
  try {
    const histories = await History.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(histories);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

// @route   GET api/history/public/:id
// @desc    Get public history by ID (accessible by anyone)
router.get("/public/:id", async (req, res) => {
  try {
    const historyItem = await History.findById(req.params.id);

    if (!historyItem) {
      return res.status(404).json({ message: "History not found" });
    }

    if (!historyItem.isPublic) {
      return res.status(403).json({ message: "This visualization is private" });
    }

    res.json(historyItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});


// @route   DELETE api/history/:id
// @desc    Delete a history item
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const historyItem = await History.findById(req.params.id);

    if (!historyItem) {
      return res.status(404).json({ message: "History not found" });
    }

    const isOwner = historyItem.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await History.deleteOne({ _id: req.params.id });
    res.json({ message: "History removed" });
  } catch (err) {
    res.status(500).json("Server error");
  }
});


export default router;
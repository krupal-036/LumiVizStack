import express from "express";
import History from "../models/History.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();


// @route   POST api/history/save
// @desc    Save visualization history (Max 10 per user)

router.post("/save", verifyToken, async (req, res) => {
  try {
    const { title, type, data, rawInput, urlInput, inputType, isPublic, isDeleted } = req.body;
    const userId = req.user.id;

    if (rawInput) {
      const rawLines = rawInput.trim().split('\n').length;
      if (rawLines > 500) {
        return res.status(400).json({ message: `Input text is too long (${rawLines} lines). Max 500.` });
      }
    }

    if (data) {
      const dataLines = JSON.stringify(data, null, 2).split('\n').length;
      if (dataLines > 500) {
        return res.status(400).json({ message: `JSON data structure is too large (${dataLines} lines). Max 500.` });
      }
    }

    if (title) {
      const existingTitle = await History.findOne({
        userId,
        title: title.trim(),
      });

      if (existingTitle) {
        return res.status(400).json({
          message: "You already have a visualization with this title. Please choose a unique name."
        });
      }
    }

    const trimmedInput = rawInput?.trim();

    if (data) {
      const duplicate = await History.findOne({
        userId,
        data: data
      });
      if (duplicate) {
        return res.status(400).json({ message: "A visualization with this exact data already exists in your history." });
      }
    }

    if (trimmedInput) {

      let normalizedInput;
      try {
        normalizedInput = JSON.stringify(JSON.parse(trimmedInput));
      } catch (e) {
        normalizedInput = trimmedInput.trim();
      }

      const histories = await History.find({ userId, isDeleted: false });
      const isDuplicate = histories.some(h => {
        try {
          const storedNorm = h.rawInput ? JSON.stringify(JSON.parse(h.rawInput)) : h.rawInput;
          return storedNorm === normalizedInput;
        } catch (e) {
          return h.rawInput === trimmedInput;
        }
      });

      if (isDuplicate) {
        return res.status(400).json({ message: "A visualization with this exact data input already exists." });
      }
    }

    if (trimmedInput) {
      const duplicate = await History.findOne({ userId, rawInput: trimmedInput });
      if (duplicate) {
        return res.status(400).json({
          message: "A visualization with this exact data already exists in your history."
        });
      }
    }

    const newHistory = new History({
      userId, title, type, data, rawInput: trimmedInput, urlInput, inputType, isPublic: !!isPublic || false, isDeleted: !!isDeleted || false,
    });

    const savedItem = await newHistory.save();
    const userHistories = await History.find({ userId }).sort({ createdAt: -1 });

    if (userHistories.length > 10) {
      const idsToDelete = userHistories.slice(10).map(item => item._id);
      await History.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Save error:", err.message);
    res.status(500).json({ message: "Server Unavailable..." });
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

    const isOwner = historyItem.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(401).json({ message: "User not authorized" });
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
    res.status(500).json("Server error really");
  }
});


// @route   GET api/history/public/:shareId
// @desc    Get public history by Share ID (accessible by anyone)

router.get("/public/:shareId", async (req, res) => {
  const { shareId } = req.params;
  try {
    const historyItem = await History.findOne({ shareId });

    if (!historyItem) {
      return res.status(404).json({ message: "History not found..." });
    }

    if (historyItem.isDeleted) {
      return res.status(403).json({ message: "This visualization has been deleted by the user..." });
    }

    if (!historyItem.isPublic) {
      return res.status(403).json({ message: "This visualization is private..." });
    }

    res.json(historyItem);
  } catch (err) {
    console.error("Public fetch error:", err.message);
    res.status(500).json("Server error");
  }
});


// @route   PUT api/history/delete-all
// @desc    Mark all history as deleted (Soft Delete)

router.put("/delete-all", verifyToken, async (req, res) => {
  try {
    const result = await History.updateMany(
      { userId: req.user.id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } }
    );

    res.json({
      message: "History cleared successfully",
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear history" });
  }
});


// @route   DELETE api/history/delete-all
// @desc    Delete all history items

router.delete("/delete-all", verifyToken, async (req, res) => {
  try {
    const result = await History.deleteMany({ userId: req.user.id });
    res.json({
      message: "History permanently deleted",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete history" });
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


// @route   PUT api/history/:id/
// @desc    Toggle isDelete flag

router.put("/:id", verifyToken, async (req, res) => {
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

    historyItem.isDeleted = !historyItem.isDeleted;
    await historyItem.save();

    res.json(historyItem);
  } catch (err) {
    console.error("Toggle error:", err.message);
    res.status(500).json("Server error");
  }
});

export default router;
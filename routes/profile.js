import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import verifyToken from "../middleware/verifyToken.js";
import History from "../models/History.js";

const router = express.Router();

// @route   PUT api/profile/update
router.put("/update", verifyToken, async (req, res) => {
    const { username, password } = req.body;
    const updateData = {};

    try {
        if (username) {
            const trimmedName = username.trim().toLowerCase();

            const usernameRegex = /^[a-z][a-z0-9]*$/;

            if (!usernameRegex.test(trimmedName)) {
                return res.status(400).json({
                    message: "Username must start with a letter and contain only lowercase letters/numbers."
                });
            }

            if (trimmedName.length < 3 || trimmedName.length > 20) {
                return res.status(400).json({ message: "Username must be between 3 and 20 characters" });
            }

            const reservedWords = ["admin", "root", "support", "help", "official", "moderator"];
            if (reservedWords.includes(trimmedName)) {
                return res.status(400).json({ message: "This username is reserved and cannot be used." });
            }

            const existingUser = await User.findOne({
                username: trimmedName,
                _id: { $ne: req.user.id },
            });

            if (existingUser) {
                return res.status(400).json({ message: "Username is already taken" });
            }

            updateData.username = trimmedName;
        }

        if (password) {
            if (password.length < 6) {
                return res
                    .status(400)
                    .json({ message: "Password must be at least 6 characters long" });
            }

            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No changes provided" });
        }

        const user = await User.findOneAndUpdate(
            { _id: req.user.id },
            { $set: updateData },
            {
                returnDocument: 'after',
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((val) => val.message);
            return res.status(400).json({ message: messages[0] });
        }

        console.error("Update Error:", err.message);
        res.status(500).json({ message: "Server error during update" });
    }
});


// @route   PUT api/profile/delete

router.put("/delete", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { isDeleted: true } },
            {
                returnDocument: "after",
                runValidators: true,
            },
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await History.deleteMany({ userId: userId });

        res.json({
            success: true,
            message: "Profile deactivated and history cleared successfully",
        });
    } catch (err) {
        console.error("Delete Profile Error:", err.message);
        res
            .status(500)
            .json({ message: "Server error during account deactivation" });
    }
});

export default router;
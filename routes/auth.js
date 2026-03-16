import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// @route   POST api/auth/register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const email = req.body.email?.toLowerCase();
  if (!email || !password || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const trimmedName = username.trim().toLowerCase();
    const usernameRegex = /^[a-z][a-z0-9]*$/;

    if (!usernameRegex.test(trimmedName)) {
      return res.status(400).json({
        message: "Username must start with a letter and contain only lowercase letters/numbers.",
      });
    }

    if (trimmedName.length < 3 || trimmedName.length > 20) {
      return res.status(400).json({ message: "Username must be between 3 and 20 characters" });
    }

    const reservedWords = ["admin", "root", "support", "help", "official", "moderator"];
    if (reservedWords.includes(trimmedName)) {
      return res.status(400).json({ message: "This username is reserved and cannot be used." });
    }

    const existingUsername = await User.findOne({ username: trimmedName });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    user = new User({ username: trimmedName, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      userId: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "9h",
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages[0], errors: messages });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }

    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST api/auth/login
router.post("/login", async (req, res) => {
  const { password } = req.body;
  const email = req.body.email?.toLowerCase();

  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!user || user?.isDeleted) {
      return res.status(400).json({ message: "Account deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const payload = {
      userId: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "9h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages[0], errors: messages });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }

    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

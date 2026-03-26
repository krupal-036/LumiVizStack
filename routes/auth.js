import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validateRegister, validateLogin } from "../middleware/authValidation.js";

const router = express.Router();

// @route   POST api/auth/register
// @desc    Create new User

router.post("/register", validateRegister, async (req, res) => {
  const { username, email, password } = req.cleanData;

  try {
    const user = new User({ username, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      userId: user.id,
      role: user.role,
      credits: user.credits,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        credits: user.credits,
      },
    });
  } catch (err) {
    handleErrors(err, res);
  }
});

// @route   POST api/auth/login
// @desk    Login Existing User

router.post("/login", validateLogin, async (req, res) => {
  const user = req.user;

  try {
    const payload = { userId: user.id, role: user.role, credits: user.credits };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.json({
      token,
      user: { id: user.id, name: user.username, email: user.email, role: user.role, credits: user.credits },
    });
  } catch (err) {
    handleErrors(err, res);
  }
});

const handleErrors = (err, res) => {
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ message: messages[0], errors: messages });
  }
  if (err.code === 11000) {
    return res.status(400).json({ message: "Email already in use" });
  }
  console.error(err.message);
  res.status(500).json({ message: "Server not Available" });
};

export default router;

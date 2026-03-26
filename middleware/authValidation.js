import User from "../models/User.js";
import bcrypt from "bcryptjs";

const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const usernameRegex = /^[a-z][a-z0-9]*$/;

export const validateRegister = async (req, res, next) => {

  if (req.siteSignupDisabled) {
    return res.status(403).json({ message: "New sign-ups are currently disabled by the administrator." });
  }

  const { username, password } = req.body;
  const email = req.body.email?.trim()?.toLowerCase();

  if (!email || !password || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const trimmedName = username.trim().toLowerCase();

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

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid Email Address" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long and include an uppercase letter, a number, and a special character."
    });
  }

  try {
    const existingUsername = await User.findOne({ username: trimmedName });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    req.cleanData = { username: trimmedName, email, password };
    next();
  } catch (err) {
    res.status(500).json({ message: "Validation Server Error" });
  }
};


export const validateLogin = async (req, res, next) => {
  const { password } = req.body;
  const email = req.body.email?.trim()?.toLowerCase();

  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password) return res.status(400).json({ message: "Password is required" });

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid Email Format" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Invalid Password Format. Check length and required characters."
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email Address.." });
    }

    if (req.siteLoginDisabled && user.role !== "admin") {
      return res.status(403).json({
        message: "Login is temporarily disabled for users. Please try again later."
      });
    }

    if (user.isDeleted) {
      return res.status(400).json({ message: "Account deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: "Login Validation Error" });
  }
};
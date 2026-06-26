import { NextFunction } from "express";
import { emailRegex, passwordRegex, usernameRegex } from "../../utils/regex";
import { getUserByField } from "../../repositories/user.repo";

export const validateRegister = async (req: any, res: any, next: NextFunction) => {

    if (req.siteSignupDisabled) {
        return res.status(403).json({ message: "New sign-ups are currently disabled by the administrator." });
    }

    const { username, password } = req.body;
    const email = req.body.email?.trim()?.toLowerCase();

    if (!email || !password || !username || !req.body) {
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

    const reservedWords = ["admin", "root", "support", "help", "official", "moderator", "krupal", "krupalfataniya"];
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
        const existingUsername = await getUserByField({ username: trimmedName });
        if (existingUsername) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        const existingEmail = await getUserByField({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        req.user = { username: trimmedName, email, password };

        next();

    } catch (err) {
        res.status(500).json({ message: "Server validation failed during registration" });
    }
};
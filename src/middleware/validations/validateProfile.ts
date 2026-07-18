import { Response, NextFunction } from "express";
import { countUserByField, getUserByField } from "../../repositories/user.repo";
import { usernameRegex } from "../../utils/regex";

export const validateProfile = async (req: any, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  const userId = req.user?.id;
  try {
    const user = await getUserByField({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let isChanged = false;

    if (username) {
      const trimmedName = username.trim().toLowerCase();

      if (!usernameRegex.test(trimmedName)) {
        return res.status(400).json({
          message: "Username must start with a letter and contain only lowercase letters/numbers.",
        });
      }
      if (trimmedName.length < 3 || trimmedName.length > 20) {
        return res.status(400).json({
          message: "Username must be between 3 and 20 characters",
        });
      }

      const reservedWords = ["admin", "root", "support", "help", "official", "moderator"];
      if (reservedWords.includes(trimmedName)) {
        return res.status(400).json({
          message: "This username is reserved and cannot be used.",
        });
      }
      if (user.username !== trimmedName) {
        const existingUser = await countUserByField({
          username: trimmedName,
          _id: { $ne: userId },
        });

        if (existingUser) {
          return res.status(400).json({ message: "Username is already taken" });
        }

        req.body.username = trimmedName;
        isChanged = true;
      }
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters long",
        });
      }
      isChanged = true;
    }

    if (!isChanged) {
      return res.status(400).json({ message: "No changes provided" });
    }

    req.validatedUserData = user;

    next();
  } catch (err) {
    return res.status(500).json({
      message: "Server validation failed during update user profile",
    });
  }
};

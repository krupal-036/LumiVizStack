import { AppConfig } from "../config/app.config";
import User from "../models/User.model";
import { getUserByField } from "../repositories/user.repo";
import { Logger } from "./logger";

export const seedAdmin = async () => {
  const adminEmail = AppConfig.ADMIN_EMAIL;
  const adminPassword = AppConfig.ADMIN_PASSWORD;

  const existing = await getUserByField({ email: adminEmail });

  if (existing) {
    Logger.log("Default admin user already exists. Skipping seed.");
    return;
  }

  await User.create({
    username: "admin",
    email: adminEmail,
    password: adminPassword,
    role: "admin",
  });
  Logger.log("Default admin user seeded successfully.");
};

import User from "../models/User.model";
import { getUserByField } from "../repositories/user.repo";

export const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL as string;
  const adminPassword = process.env.ADMIN_PASSWORD as string;

  const existing = await getUserByField({ email: adminEmail });

  if (existing) {
    if ((process.env.NODE_ENV as string) !== "production") {
      console.log("Default admin user already exists. Skipping seed.");
    }
    return;
  }

  await User.create({
    username: "admin",
    email: adminEmail,
    password: adminPassword,
    role: "admin",
  });

  if ((process.env.NODE_ENV as string) !== "production") {
    console.log("Default admin user seeded successfully.");
  }
};

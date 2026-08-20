import { IUser } from "../models/User.model";
import { signToken } from "../utils/tokenHandler";
import { ResponseHandler } from "../utils/responseHandler";
import * as userRepo from "../repositories/user.repo";
import * as historyRepo from "../repositories/history.repo";
import { UserRequest } from "../types/types";
import { HttpStatus } from "../constants/http-status.enum";

export const register = async (userData: Pick<IUser, "username" | "email" | "password">) => {
  try {
    const user = await userRepo.createUser(userData);
    const token = signToken({
      userId: user.id,
      name: user.username,
      email: user.email,
      role: user.role,
      credits: user.credits,
    });
    return ResponseHandler.send(HttpStatus.CREATED, { token });
  } catch (err: any) {
    return ResponseHandler.send(HttpStatus.BAD_REQUEST, { message: "Server not Available" });
  }
};

export const login = async (user: UserRequest) => {
  try {
    const token = signToken({
      userId: user.id,
      role: user.role,
      name: user.username,
      email: user.email,
      credits: user.credits,
    });
    return ResponseHandler.send(HttpStatus.OK, { token });
  } catch (err: any) {
    return ResponseHandler.send(HttpStatus.BAD_REQUEST, { message: "Server not Available" });
  }
};

export const updateUserData = async (req: any) => {
  const { username, password } = req.body;
  try {
    const user = req.validatedUserData;
    if (username) user.username = username;
    if (password) user.password = password;
    await user.save();
    return ResponseHandler.send(HttpStatus.CREATED, {
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return ResponseHandler.send(HttpStatus.INTERNAL_SERVER_ERROR, { message: "Profile Update failed." });
  }
};

export const toggleProfileStatus = async (data: any) => {
  try {
    if (data.role === "admin")
      return ResponseHandler.send(HttpStatus.BAD_REQUEST, {
        message: "Admin role is restricted here.",
      });
    const user = await userRepo.getUserByField({ _id: data.id });
    if (!user) return ResponseHandler.send(HttpStatus.NOT_FOUND, { message: "User not found" });
    user.isDeleted = true;
    await user?.save();
    await historyRepo.deleteManyByField({ userId: data.id });
    return ResponseHandler.send(HttpStatus.CREATED, {
      message: "Profile deactivated and history cleared successfully",
    });
  } catch (err) {
    return ResponseHandler.send(HttpStatus.INTERNAL_SERVER_ERROR, {
      message: "Server error during account deactivation",
    });
  }
};

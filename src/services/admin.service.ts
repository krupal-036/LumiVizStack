import * as userRepo from "../repositories/user.repo";
import * as ssRepo from "../repositories/systemSettings.repo";
import * as historyRepo from "../repositories/history.repo";
import { responseHandler } from "../utils/responseHandler";

export const getSettings = async () => {
  try {
    let settings = await ssRepo.getSystemConfig();
    if (!settings) settings = await ssRepo.createSystemConfig();
    return responseHandler(200, settings);
  } catch (err) {
    return responseHandler(500, {
      message: "Failed to load system settings.",
    });
  }
};

export const updateSettings = async (data: any) => {
  try {
    const settings: any = await ssRepo.getSystemConfig();

    settings.isLoginEnabled = data?.isLoginEnabled ?? settings.isLoginEnabled;
    settings.isSignupEnabled = data?.isSignupEnabled ?? settings.isSignupEnabled;

    await settings.save();
    return responseHandler(200, settings);
  } catch (err) {
    return responseHandler(500, {
      message: "Failed to update system settings.",
    });
  }
};

export const getStats = async () => {
  try {
    const [userCount, historyCount, publicCount, deletedCount] = await Promise.all([
      userRepo.countUserByField(),
      historyRepo.countHistoryByField({}),
      historyRepo.countHistoryByField({ isPublic: true }),
      historyRepo.countHistoryByField({ isDeleted: true }),
    ]);
    return responseHandler(200, {
      users: userCount,
      records: historyCount,
      isPublic: publicCount,
      isDeleted: deletedCount,
    });
  } catch (err) {
    return responseHandler(500, {
      message: "Failed to load dashboard statistics.",
    });
  }
};

export const getUsersStats = async () => {
  try {
    const usersWithStats = await userRepo.getUsersStats();
    return responseHandler(200, usersWithStats);
  } catch (err) {
    return responseHandler(500, {
      message: "Failed to get users with history counts.",
    });
  }
};

export const toggleUserStatus = async (userId: any) => {
  try {
    const userItem = await userRepo.getUserByField({ _id: userId });
    if (!userItem) return responseHandler(404, { message: "User not found" });
    userItem.isDeleted = !userItem.isDeleted;
    await userItem.save();
    return responseHandler(200, userItem);
  } catch (err) {
    return responseHandler(500, {
      message: "Failed to toggle user status.",
    });
  }
};

export const removeUserAndHistory = async (userId: any) => {
  try {
    const user = await userRepo.deleteUserById(userId);
    if (!user) return responseHandler(200, { message: "User not found" });
    const delHistory = await historyRepo.deleteManyByField({
      userId: userId,
    });
    return responseHandler(200, {
      message: `${user.username} and its associated ${delHistory.deletedCount} history document deleted successfully`,
    });
  } catch (err) {
    return responseHandler(500, {
      message: "Error occured during Deletion of User & its all History",
    });
  }
};

export const removeHistoryCollection = async () => {
  try {
    const result = await historyRepo.deleteManyByField({});
    return responseHandler(200, {
      message: `Total ${result.deletedCount} history records have been permanently deleted`,
    });
  } catch (err) {
    return responseHandler(500, { message: "Failed to delete history" });
  }
};

export const removeAllHistoryOfUserById = async (userId: any) => {
  try {
    const user = await userRepo.getUserByField({ _id: userId });
    if (!user) return responseHandler(404, { message: "User not found" });

    const result = await historyRepo.deleteManyByField({ userId });
    const count = result.deletedCount;
    const message =
      count === 0
        ? `User ${user.username} had no associated history records to delete.`
        : `Successfully deleted ${count} associated history ${count === 1 ? "document" : "documents"} for user ${user.username}.`;

    return responseHandler(200, { message });
  } catch (err) {
    return responseHandler(500, {
      message: "Error Occured during Deletion of User's History",
    });
  }
};

export const getAllHistoryAdmin = async () => {
  try {
    const allHistory = await historyRepo.getAllHistoryAdmin();
    return responseHandler(200, allHistory);
  } catch (err) {
    return responseHandler(500, { message: "Can't Get All History" });
  }
};

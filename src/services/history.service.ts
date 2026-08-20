import * as userRepo from "../repositories/user.repo";
import * as historyRepo from "../repositories/history.repo";
import { ResponseHandler } from "../utils/responseHandler";
import { HttpStatus } from "../constants/http-status.enum";

export const createHistory = async (historyData: any) => {
  try {
    const { title, type, data, urlInput, inputType, isPublic, isDeleted } = historyData.body;
    const userId = historyData.user.id;
    const trimmedInput = historyData.trimmedInput;
    let updatedUser: any;

    if (historyData.user.role !== "admin") {
      updatedUser = await userRepo.getUserByField({
        _id: userId,
        credits: { $gte: 0 },
      });
      if (!updatedUser) {
        const userCheck = await userRepo.getUserByField({
          _id: userId,
        });
        if (!userCheck) return ResponseHandler.send(HttpStatus.NOT_FOUND, { message: "User not found" });
        if (userCheck.isDeleted)
          return ResponseHandler.send(HttpStatus.NOT_FOUND, {
            message: "Account was Disabled",
          });
        if (userCheck.credits <= 0)
          return ResponseHandler.send(HttpStatus.FORBIDDEN, {
            message: "Insufficient credits.",
          });
      }

      updatedUser.credits -= 1;
      await updatedUser.save();
    }

    const newHistory = await historyRepo.createHistory({
      userId,
      title,
      type,
      data,
      rawInput: trimmedInput,
      urlInput,
      inputType,
      isPublic: !!isPublic || false,
      isDeleted: !!isDeleted || false,
    });

    let userHistories: any = await historyRepo.getHistoriesByField({
      userId,
    });
    userHistories.sort((a: any, b: any) => b.createdAt - a.createdAt);

    if (userHistories.length > 10 && data.user.role !== "admin") {
      const idsToDelete = userHistories.slice(10).map((h: any) => h._id);
      await historyRepo.deleteManyByField({ _id: { $in: idsToDelete } });
    }

    return ResponseHandler.send(HttpStatus.CREATED, {
      newHistory,
      credits: updatedUser?.credits,
    });
  } catch (err) {
    return ResponseHandler.send(HttpStatus.INTERNAL_SERVER_ERROR, {
      message: "Error while saving History.",
    });
  }
};

export const toggleHistoryStatus = async (user: any, id: any) => {
  try {
    const historyItem = await historyRepo.getHistoryByField({ _id: id });

    if (!historyItem)
      return ResponseHandler.send(HttpStatus.NOT_FOUND, { message: "History not found." });

    const isOwner = historyItem.userId.toString() === user.id;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin)
      return ResponseHandler.send(HttpStatus.UNAUTHORIZED, { message: "User not authorized." });
    historyItem.isPublic = !historyItem.isPublic;

    await historyItem.save();

    return ResponseHandler.send(HttpStatus.CREATED, historyItem);
  } catch (err) {
    return ResponseHandler.send(HttpStatus.INTERNAL_SERVER_ERROR, { message: "History toggle error." });
  }
};

export const getAllHistoryForUser = async (userId: any) => {
  try {
    let histories: any = await historyRepo.getHistoriesByField({ userId });
    histories.sort((a: any, b: any) => b.createdAt - a.createdAt);
    return ResponseHandler.send(HttpStatus.CREATED, histories);
  } catch (err) {
    return ResponseHandler.send(HttpStatus.INTERNAL_SERVER_ERROR, {
      message: "Server error while fetching all history for user.",
    });
  }
};

export const getPublicHistory = async (shareId: any) => {
  try {
    const historyItem = await historyRepo.getHistoryByField({ shareId });

    if (!historyItem) {
      return ResponseHandler.send(HttpStatus.NOT_FOUND, { message: "History not found..." });
    }

    const userItem: any = await userRepo.getUserByField({
      _id: historyItem.userId,
    });

    if (userItem.isDeleted) {
      return ResponseHandler.send(HttpStatus.FORBIDDEN, {
        message:
          "Access denied. The account associated with this visualization is currently disabled",
      });
    }
    if (historyItem.isDeleted) {
      return ResponseHandler.send(HttpStatus.FORBIDDEN, {
        message: "This visualization has been deleted by the user...",
      });
    }

    if (!historyItem.isPublic) {
      return ResponseHandler.send(HttpStatus.FORBIDDEN, {
        message: "This visualization is private...",
      });
    }

    return ResponseHandler.send(HttpStatus.CREATED, historyItem);
  } catch (err) {
    return ResponseHandler.send(HttpStatus.INTERNAL_SERVER_ERROR, {
      message: "Server error while fetching public history by share id",
    });
  }
};

export const toggleDeleteAllHistory = async (userId: any) => {
  try {
    const results = await historyRepo.getHistoriesByField({
      userId,
      isDeleted: { $ne: true },
    });

    const savePromises = results.map(async (doc) => {
      doc.isDeleted = true;
      return await doc.save();
    });

    await Promise.all(savePromises);

    return ResponseHandler.send(HttpStatus.CREATED, {
      message: `Total ${results.length} History cleared successfully`,
      modifiedCount: results.length,
    });
  } catch (err) {
    return ResponseHandler.send(HttpStatus.INTERNAL_SERVER_ERROR, {
      message: "Failed to clear history",
    });
  }
};

export const deleteAllHistoryUser = async (userId: any) => {
  try {
    const result = await historyRepo.deleteManyByField({ userId });
    return ResponseHandler.send(HttpStatus.CREATED, {
      message: "History permanently deleted",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    return ResponseHandler.send(HttpStatus.INTERNAL_SERVER_ERROR, {
      message: "Failed to delete history",
    });
  }
};

export const deleteOneHistoryItem = async (data: any, id: any) => {
  try {
    const historyItem = await historyRepo.getHistoryByField({ _id: id });

    if (!historyItem) {
      return ResponseHandler.send(HttpStatus.NOT_FOUND, { message: "History not found" });
    }

    const isOwner = historyItem.userId.toString() === data.id;
    const isAdmin = data.role === "admin";

    if (!isOwner && !isAdmin) {
      return ResponseHandler.send(HttpStatus.UNAUTHORIZED, { message: "User not authorized" });
    }

    await historyRepo.deleteManyByField({ _id: id });
    return ResponseHandler.send(HttpStatus.CREATED, {
      message: "History successfully deleted",
    });
  } catch (err) {
    return ResponseHandler.send(HttpStatus.INTERNAL_SERVER_ERROR, {
      message: "Server error while deleting a history",
    });
  }
};

export const toggleDeleteHistory = async (data: any, id: any) => {
  try {
    const historyItem = await historyRepo.getHistoryByField({ _id: id });

    if (!historyItem) {
      return ResponseHandler.send(HttpStatus.NOT_FOUND, { message: "History not found" });
    }

    const isOwner = historyItem.userId.toString() === data.id;
    const isAdmin = data.role === "admin";

    if (!isOwner && !isAdmin) {
      return ResponseHandler.send(HttpStatus.UNAUTHORIZED, { message: "User not authorized" });
    }

    historyItem.isDeleted = !historyItem.isDeleted;
    await historyItem.save();

    return ResponseHandler.send(HttpStatus.CREATED, historyItem);
  } catch (err) {
    return ResponseHandler.send(HttpStatus.INTERNAL_SERVER_ERROR, {
      message: "Server error while deleting a history",
    });
  }
};

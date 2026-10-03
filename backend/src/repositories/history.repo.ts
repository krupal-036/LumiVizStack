// backend/src/repositories/history.repo.ts
import { Request, Response } from "express";
import History from "../models/History.model";
import { HttpStatus } from "../constants/http-status.enum";

export const getAllHistoryAdmin = async () => {
    return await History.find().populate("userId", "username email");
};

export const countHistoryByField = async (field: any = {}) => {
    return await History.countDocuments(field);
};

export const deleteManyByField = async (field: any = {}) => {
    return await History.deleteMany(field);
};

export const getHistoryByField = async (field: any = {}) => {
    return await History.findOne(field);
};

export const getHistoriesByField = async (field: any = {}) => {
    return await History.find(field);
};

export const createHistory = async (data: any) => {
    return await History.create(data);
};

export const updateManyByField = async (filter: any, update: any) => {
    return await History.updateMany(filter, update);
};

export const populateAllPublicViz = async (req: Request, res: Response) => {
    try {
        const items = await History.find({ isPublic: true, isDeleted: false })
            .populate("userId", "username")
            .sort({ createdAt: -1 })
            .limit(30);
        return res.status(HttpStatus.OK).json(items);
    } catch {
        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Failed to load public gallery" });
    }
};

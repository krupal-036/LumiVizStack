import History from "../models/History.model";


export const getAllHistoryAdmin = async () => {
    return await History.find().populate("userId", "username email");
}

export const countHistoryByField = async (field: any = {}) => {
    return await History.countDocuments(field);
}

export const deleteManyByField = async (field: any = {}) => {
    return await History.deleteMany(field);
}
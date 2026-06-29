import History from '../models/History.model.js';

export const getAllHistoryAdmin = async () => {
    return await History.find().populate('userId', 'username email');
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

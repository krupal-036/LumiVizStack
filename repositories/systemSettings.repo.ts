import SystemSettings from '../models/SystemSettings.model.js';

export const getSystemConfig = async () => {
    return await SystemSettings.findOne({ configName: 'global_config' });
};

export const createSystemConfig = async () => {
    return await SystemSettings.create({ configName: 'global_config' });
};

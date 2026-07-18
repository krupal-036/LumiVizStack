import * as service from "../services/admin.service";

export const getSettings = async (req: any, res: any) => {
  const result = await service.getSettings();
  return res.status(result.code).json(result.data);
};
export const updateSettings = async (req: any, res: any) => {
  const result = await service.updateSettings(req.body);
  return res.status(result.code).json(result.data);
};

export const getStats = async (req: any, res: any) => {
  const result = await service.getStats();
  return res.status(result.code).json(result.data);
};

export const getUsersStats = async (req: any, res: any) => {
  const result = await service.getUsersStats();
  return res.status(result.code).json(result.data);
};

export const toggleUserStatus = async (req: any, res: any) => {
  const result = await service.toggleUserStatus(req.params.id);
  return res.status(result.code).json(result.data);
};

export const removeUserAndHistory = async (req: any, res: any) => {
  const result = await service.removeUserAndHistory(req.params.id);
  return res.status(result.code).json(result.data);
};

export const removeHistoryCollection = async (req: any, res: any) => {
  const result = await service.removeHistoryCollection();
  return res.status(result.code).json(result.data);
};

export const removeAllHistoryOfUserById = async (req: any, res: any) => {
  const result = await service.removeAllHistoryOfUserById(req.params.id);
  return res.status(result.code).json(result.data);
};

export const getAllHistoryAdmin = async (req: any, res: any) => {
  const result = await service.getAllHistoryAdmin();
  return res.status(result.code).json(result.data);
};

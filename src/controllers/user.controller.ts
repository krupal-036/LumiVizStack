import * as service from "../services/user.service";
import { setCookie } from "../utils/setCookie";

export const register = async (req: any, res: any) => {
  const result: any = await service.register(req.body);
  // await setCookie(res, result.data?.token);
  return res.status(result.code).json(result.data);
};

export const login = async (req: any, res: any) => {
  const result: any = await service.login(req.user);
  // await setCookie(res, result.data?.token);
  return res.status(result.code).json(result.data);
};

export const updateUserData = async (req: any, res: any) => {
  const result = await service.updateUserData(req);
  return res.status(result.code).json(result.data);
};

export const toggleProfileStatus = async (req: any, res: any) => {
  const result = await service.toggleProfileStatus(req.user);
  return res.status(result.code).json(result.data);
};

import { Request, Response } from "express";
import * as service from "../services/history.service";

export const createHistory = async (req: Request, res: Response) => {
  const result = await service.createHistory(req);
  return res.status(result.code).json(result.data);
};

export const toggleHistoryStatus = async (req: Request, res: Response) => {
  const result = await service.toggleHistoryStatus(req.user, req.params.id);
  return res.status(result.code).json(result.data);
};

export const getAllHistoryForUser = async (req: Request, res: Response) => {
  const result = await service.getAllHistoryForUser(req.user.id);
  return res.status(result.code).json(result.data);
};

export const getPublicHistory = async (req: Request, res: Response) => {
  const result = await service.getPublicHistory(req.params.shareId);
  return res.status(result.code).json(result.data);
};

export const toggleDeleteAllHistory = async (req: Request, res: Response) => {
  const result = await service.toggleDeleteAllHistory(req.user.id);
  return res.status(result.code).json(result.data);
};

export const deleteAllHistoryUser = async (req: Request, res: Response) => {
  const result = await service.deleteAllHistoryUser(req.user.id);
  return res.status(result.code).json(result.data);
};

export const deleteOneHistoryItem = async (req: Request, res: Response) => {
  const result = await service.deleteOneHistoryItem(req.user, req.params.id);
  return res.status(result.code).json(result.data);
};

export const toggleDeleteHistory = async (req: Request, res: Response) => {
  const result = await service.toggleDeleteHistory(req.user, req.params.id);
  return res.status(result.code).json(result.data);
};

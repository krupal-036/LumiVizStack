import { Response } from "express";
import { AppConfig } from "../config/app.config";

export const setCookie = async (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: AppConfig.NODE_ENV === "production" ? true : false,
    sameSite: "strict",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
};

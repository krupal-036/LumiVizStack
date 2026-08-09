import { NextFunction, Request, RequestHandler } from "express";
import { createSystemConfig, getSystemConfig } from "../repositories/systemSettings.repo";

export interface SiteGuardRequest extends Request {
  siteSignupDisabled: boolean;
  siteLoginDisabled: boolean;
}

export const siteGuard: RequestHandler = async (req, res, next) => {
  try {
    let settings = await getSystemConfig();

    if (!settings) {
      settings = await createSystemConfig();
    }

    const isSignupPath = req.path === "/register";
    const isLoginPath = req.path === "/login";

    if (isSignupPath && !settings.isSignupEnabled) {
      req.siteSignupDisabled = true;
    }

    if (isLoginPath && !settings.isLoginEnabled) {
      req.siteLoginDisabled = true;
    }

    next();
  } catch (err) {
    req.siteLoginDisabled = false;
    req.siteSignupDisabled = false;
    next(err);
  }
};

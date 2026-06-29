import { NextFunction } from 'express';
import {
    createSystemConfig,
    getSystemConfig,
} from '../repositories/systemSettings.repo';

export const siteGuard = async (req: any, res: any, next: NextFunction) => {
    try {
        let settings = await getSystemConfig();

        if (!settings) {
            settings = await createSystemConfig();
        }

        const isSignupPath = req.path === '/register';
        const isLoginPath = req.path === '/login';

        if (isSignupPath && !settings.isSignupEnabled) {
            req.siteSignupDisabled = true;
        }

        if (isLoginPath && !settings.isLoginEnabled) {
            req.siteLoginDisabled = true;
        }

        next();
    } catch (err: any) {
        if (err) {
            return err.message;
        }
        req.siteLoginDisabled = false;
        req.siteSignupDisabled = false;
        next();
    }
};

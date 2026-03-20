import SystemSettings from "../models/SystemSettings.js";

export const siteGuard = async (req, res, next) => {
    try {
        let settings = await SystemSettings.findOne({ configName: "global_config" });

        if (!settings) {
            settings = await SystemSettings.create({ configName: "global_config" });
        }

        /***************************************/
        const isSignupPath = req.path === "/register";
        const isLoginPath = req.path === "/login";

        if (isSignupPath && !settings.isSignupEnabled) {
            req.siteSignupDisabled = true;
        }

        if (isLoginPath && !settings.isLoginEnabled) {
            req.siteLoginDisabled = true;
        }

        /*****************************************/

        // req.siteLoginDisabled = !settings.isLoginEnabled;
        // req.siteSignupDisabled = !settings.isSignupEnabled;

        next();
    } catch (err) {
        console.error("SiteGuard Error:", err);
        req.siteLoginDisabled = false;
        req.siteSignupDisabled = false;
        next();
    }
};

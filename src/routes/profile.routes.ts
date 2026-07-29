import { Router } from "express";
import * as c from "../controllers/user.controller";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware";
import { validateProfile } from "../middleware/validations/validateProfile";
import { validateUser } from "../middleware/validations/validateUser";

const r = Router();

r.use(authenticate, authorizeRoles("admin", "user"));

// @route   PUT api/profile/update
// @desc    Update user profile
r.put("/update", validateProfile, validateUser, c.updateUserData);

// @route   PUT api/profile/delete
// @desc    Deactivate user and delete associated history
r.put("/delete", c.toggleProfileStatus);

export default r;

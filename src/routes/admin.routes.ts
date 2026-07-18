import { Router } from "express";
import * as c from "../controllers/admin.controller";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware";
const r = Router();

r.use(authenticate, authorizeRoles("admin"));

// @route   GET api/admin/settings
// @desc    Get current site settings
r.get("/settings", c.getSettings);

// @route   PATCH api/admin/settings/auth
// @desc    Update login/signup toggles
r.patch("/settings/auth", c.updateSettings);

// @route   GET api/admin/stats
// @desc    Get count of documents
r.get("/stats", c.getStats);

// @route   GET api/admin/users
// @desc    Get every users
r.get("/users", c.getUsersStats);

// @route   PUT api/admin/user/:id
// @desc    Soft delete Toggle for User
r.put("/user/:id", c.toggleUserStatus);

// @route   DELETE api/admin/user/:id
// @desc    Delete User and all history of User
r.delete("/user/:id", c.removeUserAndHistory);

// @route   DELETE api/admin/history
// @desc    DELETE all history of History Collection at Admin Side
r.delete("/history", c.removeHistoryCollection);

// @route   DELETE api/admin/users/history/:id
// @desc    DELETE all history of User at Admin Side
r.delete("/users/history/:id", c.removeAllHistoryOfUserById);

// @route   GET api/admin/history
// @desc    Get all history of User at Admin Side
r.get("/history", c.getAllHistoryAdmin);

export default r;

import { Router } from "express";
import User from "../models/User.model";
import History from "../models/History.model";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware";
import * as c from "../controllers/user.controller"
import { validateProfile } from "../middleware/validations/validateProfile";
const r = Router();

r.use(authenticate, authorizeRoles("admin", "user"));

// @route   PUT api/profile/update
// @desc    Update User profile
r.put("/update", validateProfile, c.updateUserData);


// @route   PUT api/profile/delete

r.put("/delete", async (req: any, res: any) => {
    try {
        const userId = req.user.id;

        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { isDeleted: true } },
            {
                returnDocument: "after",
                runValidators: true,
            },
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await History.deleteMany({ userId: userId });

        res.json({
            success: true,
            message: "Profile deactivated and history cleared successfully",
        });
    } catch (err: any) {
        console.error("Delete Profile Error:", err.message);
        res
            .status(500)
            .json({ message: "Server error during account deactivation" });
    }
});

export default r;
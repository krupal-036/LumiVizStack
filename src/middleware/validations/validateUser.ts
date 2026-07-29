import { NextFunction } from "express";
import { getUserByField } from "../../repositories/user.repo";

export const validateUser = async (req: any, res: any, next: NextFunction) => {
    const { id } = req.user;
    try {
        const user = await getUserByField({ _id: id });

        if (!user) {
            return res.status(400).json({ message: "Invalid email Address.." });
        }

        if (user.isDeleted) {
            return res.status(400).json({ message: "This action cannot be completed because your account is already deactivated." });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server validation failed" });
    }
    next();
}